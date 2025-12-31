
"use client";

import React, { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  ContactShadows, 
  Html, 
  useProgress, 
  RoundedBox,
  PerspectiveCamera,
  Environment,
  Sphere
} from '@react-three/drei';
import * as THREE from 'three';
import { ThemeType } from '../App';

interface Scene3DProps {
  scrollProgress: number;
  theme: ThemeType;
  buttonHovered: boolean;
  sayHiClicked: boolean;
  onSayHiComplete: () => void;
}

const themeColors: Record<ThemeType, string> = {
  violet: '#a78bfa',
  crimson: '#f87171',
  emerald: '#34d399',
  amber: '#fbbf24',
  monochrome: '#ffffff',
};

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-black/80 p-10 rounded-3xl backdrop-blur-3xl border border-white/10 shadow-2xl">
        <div className="w-40 h-[1px] bg-white/10 relative overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-[10px] font-mono tracking-[0.5em] text-[var(--accent)] uppercase animate-pulse">
          LINKING_NEURAL_CORE_{Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
};

const ScreenBot = ({ themeColor, globalMouse, scrollProgress, buttonHovered, sayHiClicked, onSayHiComplete }: { themeColor: string, globalMouse: React.MutableRefObject<{x: number, y: number}>, scrollProgress: number, buttonHovered: boolean, sayHiClicked: boolean, onSayHiComplete: () => void }) => {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftEyeMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const rightEyeMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const blinkStateRef = useRef({ isBlinking: false, lastBlink: 0, nextBlink: Math.random() * 3 + 2 });
  const headNodStateRef = useRef({ isNodding: false, nodStart: 0, nextNod: Math.random() * 8 + 5 });
  const danceAnimationRef = useRef({ isActive: false, startTime: 0 });
  
  // Handle dance animation trigger
  useEffect(() => {
    if (sayHiClicked) {
      danceAnimationRef.current.isActive = true;
      danceAnimationRef.current.startTime = Date.now();
      setShowSpeechBubble(true);
      
      // Hide speech bubble and reset animation after 3 seconds
      const hideBubble = setTimeout(() => {
        setShowSpeechBubble(false);
      }, 2500);
      
      const resetAnimation = setTimeout(() => {
        danceAnimationRef.current.isActive = false;
        onSayHiComplete();
      }, 3000);
      
      return () => {
        clearTimeout(hideBubble);
        clearTimeout(resetAnimation);
      };
    }
  }, [sayHiClicked, onSayHiComplete]);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(true), 1000);
    const hideTimer = setTimeout(() => setShowGreeting(false), 7000);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Calculate mouse distance for enhanced reactions
    const mouseDistance = Math.sqrt(globalMouse.current.x ** 2 + globalMouse.current.y ** 2);
    const mouseProximity = 1 - Math.min(mouseDistance, 1);
    
    // Scroll-based pose adjustment
    const scrollInfluence = Math.min(scrollProgress * 2, 1);
    
    // Button hover nodding animation
    let nodRotation = 0;
    if (buttonHovered) {
      const nodSpeed = 5; // nods per second
      nodRotation = Math.sin(t * nodSpeed * Math.PI) * 0.25; // ±15-20 degrees
    }
    
    // Dance animation
    let danceRotation = 0;
    let danceBounce = 0;
    let danceHeadBob = 0;
    if (danceAnimationRef.current.isActive) {
      const danceTime = (Date.now() - danceAnimationRef.current.startTime) / 1000;
      if (danceTime < 3) {
        // Full 360° rotation over 2 seconds
        danceRotation = (danceTime / 2) * Math.PI * 2;
        if (danceTime > 2) danceRotation = Math.PI * 2; // Complete rotation
        
        // Body bouncing
        danceBounce = Math.sin(danceTime * 8) * 0.3;
        
        // Head bobbing
        danceHeadBob = Math.sin(danceTime * 6) * 0.15;
      }
    }
    
    // Enhanced breathing animation (more pronounced, affected by scroll and dance)
    const breathingScale = danceAnimationRef.current.isActive 
      ? 1 + Math.sin(t * 2) * 0.12 // More pronounced during dance
      : 1 + Math.sin(t * 1.2) * 0.08 * (1 - scrollInfluence * 0.5);
    
    // Body sway (subtle side-to-side rotation, reduced with scroll and during dance)
    const bodySway = danceAnimationRef.current.isActive 
      ? 0 // No sway during dance
      : Math.sin(t * 0.8) * 0.05 * (1 - scrollInfluence);
    
    if (bodyRef.current) {
      bodyRef.current.scale.y = breathingScale;
      bodyRef.current.rotation.z = bodySway;
      // Apply dance bounce
      if (danceAnimationRef.current.isActive) {
        bodyRef.current.position.y = danceBounce;
      } else {
        bodyRef.current.position.y = 0;
      }
    }
    
    // Head animations with enhanced mouse following
    if (headRef.current) {
      const baseRotationY = globalMouse.current.x * 1.2 + bodySway * 2;
      const baseRotationX = globalMouse.current.y * 0.6;
      
      // Head nod animation (only when not button hovered or dancing)
      let nodOffset = 0;
      if (!buttonHovered && !danceAnimationRef.current.isActive) {
        if (t - headNodStateRef.current.nodStart > headNodStateRef.current.nextNod && !headNodStateRef.current.isNodding) {
          headNodStateRef.current.isNodding = true;
          headNodStateRef.current.nodStart = t;
          headNodStateRef.current.nextNod = Math.random() * 8 + 5;
        }
        if (headNodStateRef.current.isNodding) {
          const nodProgress = (t - headNodStateRef.current.nodStart) * 3;
          if (nodProgress < 0.3) {
            nodOffset = Math.sin(nodProgress * Math.PI / 0.3) * 0.15;
          } else if (nodProgress < 0.6) {
            nodOffset = Math.sin((nodProgress - 0.3) * Math.PI / 0.3) * 0.1;
          } else {
            headNodStateRef.current.isNodding = false;
            headNodStateRef.current.nodStart = t;
          }
        }
      }
      
      // Scroll-based head tilt (more dramatic pose as user scrolls)
      const scrollTilt = scrollInfluence * 0.2;
      const targetRotationY = danceAnimationRef.current.isActive 
        ? 0 // Head doesn't rotate during dance (entire group rotates)
        : baseRotationY;
      const targetRotationX = danceAnimationRef.current.isActive
        ? baseRotationX + danceHeadBob
        : baseRotationX + nodOffset + nodRotation - scrollTilt;
      const targetY = 1.6 + Math.sin(t * 1.5) * 0.12 * (1 - scrollInfluence * 0.5) + Math.sin(t * 0.6) * 0.05;
      
      // Apply head rotation (dance rotation is handled by parent group in Scene3D)
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotationY, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotationX, 0.15);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, targetY, 0.1);
      
      // Scroll-based scale (slight shrink as scrolling)
      const headScale = 1 - scrollInfluence * 0.1;
      headRef.current.scale.setScalar(THREE.MathUtils.lerp(headRef.current.scale.x, headScale, 0.1));
    }

    // Eye blink animation
    if (t - blinkStateRef.current.lastBlink > blinkStateRef.current.nextBlink && !blinkStateRef.current.isBlinking) {
      blinkStateRef.current.isBlinking = true;
      blinkStateRef.current.lastBlink = t;
      blinkStateRef.current.nextBlink = Math.random() * 4 + 2;
    }
    
    let eyeScaleY = 1;
    if (blinkStateRef.current.isBlinking) {
      const blinkProgress = (t - blinkStateRef.current.lastBlink) * 8;
      if (blinkProgress < 0.2) {
        eyeScaleY = 1 - Math.sin(blinkProgress * Math.PI / 0.2) * 0.9;
      } else if (blinkProgress < 0.4) {
        eyeScaleY = 0.1 + Math.sin((blinkProgress - 0.2) * Math.PI / 0.2) * 0.9;
      } else {
        blinkStateRef.current.isBlinking = false;
      }
    }

    // Enhanced eye following with proximity reaction
    if (leftEyeRef.current && rightEyeRef.current) {
        const eyeX = globalMouse.current.x * 0.15 * (1 + mouseProximity * 0.3);
        const eyeY = -globalMouse.current.y * 0.1 * (1 + mouseProximity * 0.3);
        
        leftEyeRef.current.position.x = THREE.MathUtils.lerp(leftEyeRef.current.position.x, -0.45 + eyeX, 0.18);
        leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, eyeY, 0.18);
        leftEyeRef.current.scale.y = eyeScaleY;
        
        rightEyeRef.current.position.x = THREE.MathUtils.lerp(rightEyeRef.current.position.x, 0.45 + eyeX, 0.18);
        rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, eyeY, 0.18);
        rightEyeRef.current.scale.y = eyeScaleY;
    }
    
    // Eye color pulse based on time (enhanced during dance)
    const baseEyeIntensity = 15 + Math.sin(t * 2) * 3;
    const eyeIntensity = danceAnimationRef.current.isActive 
      ? baseEyeIntensity + Math.sin(t * 8) * 5 // Enhanced pulse during dance
      : baseEyeIntensity;
    if (leftEyeMaterialRef.current) {
      leftEyeMaterialRef.current.emissiveIntensity = eyeIntensity;
    }
    if (rightEyeMaterialRef.current) {
      rightEyeMaterialRef.current.emissiveIntensity = eyeIntensity;
    }
    
    // Dynamic light intensity (enhanced during dance)
    if (pointLightRef.current) {
      const baseIntensity = 10 + Math.sin(t * 1.5) * 2 + mouseProximity * 3;
      pointLightRef.current.intensity = danceAnimationRef.current.isActive
        ? baseIntensity + Math.sin(t * 6) * 5 // Enhanced during dance
        : baseIntensity;
    }
  });

  return (
    <group>
      {showSpeechBubble && (
        <Html position={[0, 3.5, 0]} center distanceFactor={10}>
          <div className="bg-black/90 backdrop-blur-2xl border-2 border-[var(--accent)] px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-fade-in-up">
            <p className="text-white font-mono text-sm sm:text-base tracking-wider flex items-center gap-3">
              <span className="text-[var(--accent)] text-xl">👋</span>
              <span>Hi, this is Sathwik!</span>
            </p>
          </div>
        </Html>
      )}
      {showGreeting && (
        <Html position={[1.8, 3.2, 0]} center distanceFactor={10}>
          <div className="bg-black/80 backdrop-blur-2xl border border-white/20 px-5 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-bounce transition-all">
            <p className="text-white font-mono text-xs tracking-widest uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              HELLO WORLD
            </p>
          </div>
        </Html>
      )}

      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={bodyRef} position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.95, 1.4, 16, 32]} />
          <meshStandardMaterial 
            color="#050505" 
            roughness={0.05} 
            metalness={1} 
          />
        </mesh>
      </Float>

      <group ref={headRef} position={[0, 1.6, 0]}>
        <RoundedBox args={[2.4, 1.8, 1.6]} radius={0.5} smoothness={8}>
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.05} 
            metalness={1}
          />
        </RoundedBox>
        
        <group position={[0, 1.1, 0]}>
            <mesh position={[-0.8, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.7]} />
                <meshStandardMaterial color="#111" metalness={1} />
            </mesh>
            <mesh position={[0.8, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.7]} />
                <meshStandardMaterial color="#111" metalness={1} />
            </mesh>
            <mesh position={[-0.8, 0.4, 0]}>
                <sphereGeometry args={[0.09, 16, 16]} />
                <meshStandardMaterial emissive={themeColor} emissiveIntensity={10} color={themeColor} />
            </mesh>
            <mesh position={[0.8, 0.4, 0]}>
                <sphereGeometry args={[0.09, 16, 16]} />
                <meshStandardMaterial emissive={themeColor} emissiveIntensity={10} color={themeColor} />
            </mesh>
        </group>

        <mesh position={[0, 0, 0.76]}>
          <RoundedBox args={[2, 1.4, 0.12]} radius={0.3} smoothness={6}>
            <meshStandardMaterial color="#000" roughness={0} metalness={1} />
          </RoundedBox>
        </mesh>

        <group position={[0, 0, 0.85]}>
            <mesh ref={leftEyeRef} position={[-0.45, 0, 0]}>
                <planeGeometry args={[0.42, 0.2]} />
                <meshStandardMaterial 
                  ref={leftEyeMaterialRef}
                  emissive={themeColor} 
                  emissiveIntensity={15} 
                  color={themeColor} 
                  transparent 
                  opacity={0.9} 
                />
            </mesh>
            <mesh ref={rightEyeRef} position={[0.45, 0, 0]}>
                <planeGeometry args={[0.42, 0.2]} />
                <meshStandardMaterial 
                  ref={rightEyeMaterialRef}
                  emissive={themeColor} 
                  emissiveIntensity={15} 
                  color={themeColor} 
                  transparent 
                  opacity={0.9} 
                />
            </mesh>
            <mesh position={[0, -0.45, 0]}>
                <planeGeometry args={[0.8, 0.04]} />
                <meshStandardMaterial emissive={themeColor} emissiveIntensity={6} color={themeColor} transparent opacity={0.6} />
            </mesh>
        </group>
        
        <pointLight ref={pointLightRef} position={[0, 0, 1.5]} distance={4} intensity={10} color={themeColor} />
      </group>

      <Float speed={4} position={[-2.8, -0.5, 0.8]}>
          <RoundedBox args={[0.6, 0.6, 0.6]} radius={0.1}>
            <meshStandardMaterial color="#080808" metalness={1} roughness={0.1} />
          </RoundedBox>
          <pointLight intensity={2} distance={2} color={themeColor} />
      </Float>
      <Float speed={4} position={[2.8, -0.5, 0.8]}>
          <RoundedBox args={[0.6, 0.6, 0.6]} radius={0.1}>
            <meshStandardMaterial color="#080808" metalness={1} roughness={0.1} />
          </RoundedBox>
          <pointLight intensity={2} distance={2} color={themeColor} />
      </Float>
      
      {/* Floating geometric shapes around robot */}
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.5} floatIntensity={0.8}>
          <group position={[
            Math.sin(i * Math.PI * 2 / 3) * 2.5,
            -0.5 + i * 0.3,
            Math.cos(i * Math.PI * 2 / 3) * 2.5
          ]}>
            <Sphere args={[0.15, 16, 16]}>
              <meshStandardMaterial 
                color={themeColor} 
                emissive={themeColor}
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
              />
            </Sphere>
          </group>
        </Float>
      ))}
    </group>
  );
};

const Scene3D: React.FC<Scene3DProps> = ({ scrollProgress, theme, buttonHovered, sayHiClicked, onSayHiComplete }) => {
  const groupRef = useRef<THREE.Group>(null);
  const themeColor = useMemo(() => themeColors[theme], [theme]);
  const globalMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        globalMouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Get dance animation state from ScreenBot (we'll use a ref callback or check if sayHiClicked)
  const danceStartTimeRef = useRef(0);
  
  useEffect(() => {
    if (sayHiClicked) {
      danceStartTimeRef.current = Date.now();
    }
  }, [sayHiClicked]);

  useFrame(() => {
    if (groupRef.current) {
      const visibility = Math.max(0, 1 - scrollProgress * 4);
      const targetX = 4 - (scrollProgress * 15);
      const targetY = -0.5;
      const targetZ = -3 - (scrollProgress * 25);
      const targetScale = 1.6 * visibility;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08));
      
      // Apply dance rotation to the entire robot group
      if (sayHiClicked) {
        const danceTime = (Date.now() - danceStartTimeRef.current) / 1000;
        if (danceTime < 2) {
          const danceRotation = (danceTime / 2) * Math.PI * 2;
          groupRef.current.rotation.y = danceRotation;
        } else if (danceTime < 3) {
          groupRef.current.rotation.y = Math.PI * 2; // Complete rotation
        } else {
          groupRef.current.rotation.y = 0; // Reset
        }
      } else {
        groupRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <Suspense fallback={<Loader />}>
      <color attach="background" args={['#020202']} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={35} />

      <group ref={groupRef} position={[4, -0.5, -3]} scale={1.6}>
        <ScreenBot 
          themeColor={themeColor} 
          globalMouse={globalMouse}
          scrollProgress={scrollProgress}
          buttonHovered={buttonHovered}
          sayHiClicked={sayHiClicked}
          onSayHiComplete={onSayHiComplete}
        />
        <Sparkles count={100} scale={15} size={3} speed={0.6} color={themeColor} opacity={0.4} />
      </group>

      <ambientLight intensity={1.2} />
      <spotLight 
        position={[30, 40, 30]} 
        angle={0.2} 
        penumbra={1} 
        intensity={800} 
        color={themeColor} 
        castShadow 
      />
      <pointLight position={[-20, 10, 15]} intensity={300} color="#ffffff" />
      <directionalLight position={[5, 15, 10]} intensity={3} color="#ffffff" />
      
      <ContactShadows 
        opacity={0.9} 
        scale={40} 
        blur={3} 
        far={20} 
        color={themeColor} 
      />
      
      <Environment preset="night" />
    </Suspense>
  );
};

export default Scene3D;
