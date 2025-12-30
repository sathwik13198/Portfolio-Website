
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Environment } from '@react-three/drei';
import Scene3D from './components/Scene3D';
import ContentOverlay from './components/ContentOverlay';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type ThemeType = 'violet' | 'crimson' | 'emerald' | 'amber' | 'monochrome';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);
  const xFollowerTo = useRef<any>(null);
  const yFollowerTo = useRef<any>(null);
  
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!cursorRef.current || !followerRef.current) return;

    xTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power3.out" });
    yTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power3.out" });

    xFollowerTo.current = gsap.quickTo(followerRef.current, "x", { duration: 0.5, ease: "expo.out" });
    yFollowerTo.current = gsap.quickTo(followerRef.current, "y", { duration: 0.5, ease: "expo.out" });

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      if (xTo.current && yTo.current) {
        xTo.current(clientX);
        yTo.current(clientY);
      }
      if (xFollowerTo.current && yFollowerTo.current) {
        xFollowerTo.current(clientX);
        yFollowerTo.current(clientY);
      }

      // Velocity stretching effect
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      const velocity = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      gsap.to(followerRef.current, {
        scaleX: 1 + Math.min(velocity / 100, 1.5),
        scaleY: 1 - Math.min(velocity / 200, 0.5),
        rotate: angle,
        duration: 0.3
      });

      lastPos.current = { x: clientX, y: clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' || 
                          target.tagName === 'A' || 
                          target.closest('.glass-card') ||
                          target.closest('.skill-button') ||
                          target.closest('.social-link') ||
                          target.closest('.experience-item');

      if (isInteractive) {
        document.body.classList.add('cursor-hover');
        gsap.to(cursorRef.current, { scale: 3, opacity: 0.1, duration: 0.3 });
        gsap.to(followerRef.current, { 
          width: 50, 
          height: 50, 
          borderRadius: '12px', 
          borderWidth: '2px',
          opacity: 1,
          duration: 0.5,
          boxShadow: '0 0 20px var(--accent)',
          ease: "power2.out" 
        });
      } else {
        document.body.classList.remove('cursor-hover');
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(followerRef.current, { 
          width: 32, 
          height: 32, 
          borderRadius: '50%', 
          borderWidth: '1px',
          opacity: 0.2,
          boxShadow: 'none',
          duration: 0.5 
        });
      }
    };

    const onMouseDown = () => {
      gsap.to(followerRef.current, { scale: 0.7, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(followerRef.current, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
};

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState<ThemeType>('violet');

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / scrollHeight;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="relative w-full bg-[#050505]">
      <CustomCursor />
      
      {/* FIXED 3D BACKGROUND - Z-INDEX 0 ensures it is the base layer */}
      <div className="fixed inset-0 w-full h-screen z-0 overflow-hidden">
        <Canvas 
          shadows
          camera={{ position: [0, 0, 15], fov: 35 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <Scene3D scrollProgress={scrollProgress} theme={theme} />
            <Environment preset="night" />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* SCROLLABLE HTML CONTENT - Z-INDEX 10 ensures it is above the 3D scene */}
      <div className="relative z-10 w-full">
        <ContentOverlay 
          scrollProgress={scrollProgress} 
          currentTheme={theme} 
          onThemeChange={setTheme} 
        />
      </div>

      {/* FOOTER STATUS */}
      <div className="fixed bottom-6 left-6 z-50 mix-blend-difference opacity-40 font-mono text-[10px] tracking-widest hidden md:block">
        POS: {(scrollProgress * 100).toFixed(0)}% // STATUS: ACTIVE_CORE // THEME: {theme.toUpperCase()}
      </div>
    </div>
  );
};

export default App;
