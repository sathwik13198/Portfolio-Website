
'use client';
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<F>) => {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _isActive: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  scrollProgress?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 2,
  gap = 25,
  baseColor = '#2a2a3a',
  activeColor = '#8855ff',
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 0.5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.2,
  scrollProgress = 0,
  className = '',
  style
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
    trail: [] as TrailPoint[]
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const startX = (width - (cols * cell - gap)) / 2 + dotSize / 2;
    const startY = (height - (rows * cell - gap)) / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ 
            cx: startX + x * cell, 
            cy: startY + y * cell, 
            xOffset: 0, 
            yOffset: 0, 
            _isActive: false 
        });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId: number;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pr = pointerRef.current;
      const { x: px, y: py } = pr;

      // Update and Draw Trail effect
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      // Filter out dead points and update age
      pr.trail = pr.trail.filter(p => p.age < p.maxAge);
      
      // Modulation factor based on scroll progress (making it more subtle as we go deeper)
      const scrollSubtlety = 1 - scrollProgress * 0.7;

      for (let i = 0; i < pr.trail.length; i++) {
        const p = pr.trail[i];
        p.age += 1;
        
        const lifeRatio = 1 - p.age / p.maxAge;
        const opacity = lifeRatio * 0.2 * scrollSubtlety;
        const size = dotSize * 10 * lifeRatio * (0.6 + scrollSubtlety * 0.4);
        
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        grad.addColorStop(0, `rgba(${activeRgb.r}, ${activeRgb.g}, ${activeRgb.b}, ${opacity})`);
        grad.addColorStop(1, `rgba(${activeRgb.r}, ${activeRgb.g}, ${activeRgb.b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // Draw Dots
      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = ox - px;
        const dy = oy - py;
        const dsq = dx * dx + dy * dy;

        let fillStyle = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = Math.pow(1 - dist / proximity, 2);
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          fillStyle = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = fillStyle;
        ctx.fill(circlePath);
        ctx.restore();
      }
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeColor, activeRgb, baseRgb, circlePath, dotSize, scrollProgress]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    buildGrid();

    const handleResize = () => buildGrid();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [buildGrid]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      pr.x = currentX;
      pr.y = currentY;

      // Unshift a new point with increased maxAge for a smoother, longer-lasting trail
      pr.trail.unshift({ x: currentX, y: currentY, age: 0, maxAge: 60 });
      if (pr.trail.length > 60) pr.trail.pop();

      if (speed > speedTrigger) {
        for (const dot of dotsRef.current) {
          const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
          if (dist < proximity && !dot._isActive) {
            dot._isActive = true;
            const pushX = (dot.cx - pr.x) * 0.2 + (vx * 0.01);
            const pushY = (dot.cy - pr.y) * 0.2 + (vy * 0.01);
            
            gsap.to(dot, {
              xOffset: pushX,
              yOffset: pushY,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(dot, {
                  xOffset: 0,
                  yOffset: 0,
                  duration: returnDuration,
                  ease: "elastic.out(1, 0.3)",
                  onComplete: () => { dot._isActive = false; }
                });
              }
            });
          }
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._isActive) {
          dot._isActive = true;
          const falloff = 1 - dist / shockRadius;
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.2,
            ease: "power3.out",
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration * 1.5,
                ease: "elastic.out(1, 0.2)",
                onComplete: () => { dot._isActive = false; }
              });
            }
          });
        }
      }
    };

    const throttledMove = throttle(onMove, 16);
    window.addEventListener('mousemove', throttledMove);
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
    };
  }, [maxSpeed, speedTrigger, proximity, returnDuration, shockRadius, shockStrength]);

  return (
    <div ref={wrapperRef} className={`w-full h-full overflow-hidden ${className}`} style={style}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default DotGrid;
