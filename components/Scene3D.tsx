
import React, { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  ContactShadows, 
  Html, 
  useProgress, 
  RoundedBox,
  PerspectiveCamera,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';
import { ThemeType } from '../App';

interface Scene3DProps {
  scrollProgress: number;
  theme: ThemeType;
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

const ScreenBot = ({ themeColor, globalMouse, scrollProgress }: { themeColor: string, globalMouse: React.MutableRefObject<{x: number, y: number}>, scrollProgress: number }) => {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(true), 1000);
    const hideTimer = setTimeout(() => setShowGreeting(false), 7000);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (headRef.current) {
      // TRACKING LOGIC:
      // Horizontal (Y rotation): mouse.x is -1 to 1. 1.0 multiplier for wide range.
      const targetRotationY = globalMouse.current.x * 1.0; 
      
      // Vertical (X rotation): 
      // Mouse Y at TOP is -1. We want the head to tilt UP.
      // In this coordinate system, tilting UP is a negative X rotation.
      // So targetRotationX should equal globalMouse.y (no minus sign needed).
      const targetRotationX = globalMouse.current.y * 0.6; 
      
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotationY, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotationX, 0.1);
      
      // Floating motion
      headRef.current.position.y = 1.6 + Math.sin(t * 1.5) * 0.1;
    }

    // Eye shifting parallax (Internal eye movement)
    if (leftEyeRef.current && rightEyeRef.current) {
        // When cursor is at top (mouseY = -1), eye should move UP (+0.05)
        const eyeX = globalMouse.current.x * 0.12;
        const eyeY = -globalMouse.current.y * 0.08;
        
        leftEyeRef.current.position.x = THREE.MathUtils.lerp(leftEyeRef.current.position.x, -0.45 + eyeX, 0.15);
        leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, eyeY, 0.15);
        
        rightEyeRef.current.position.x = THREE.MathUtils.lerp(rightEyeRef.current.position.x, 0.45 + eyeX, 0.15);
        rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, eyeY, 0.15);
    }
  });

  return (
    <group>
      {/* GREETING BUBBLE */}
      {showGreeting && (
        <Html position={[1.8, 3.2, 0]} center distanceFactor={10}>
          <div className="bg-black/80 backdrop-blur-2xl border border-white/20 px-5 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-bounce transition-all">
            <p className="text-white font-mono text-xs tracking-widest uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              HELLO 👋 WORLD_
            </p>
          </div>
        </Html>
      )}

      {/* TORSO */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.95, 1.4, 16, 32]} />
          <meshStandardMaterial 
            color="#050505" 
            roughness={0.05} 
            metalness={1} 
          />
        </mesh>
      </Float>

      {/* HEAD ASSEMBLY */}
      <group ref={headRef} position={[0, 1.6, 0]}>
        <RoundedBox args={[2.4, 1.8, 1.6]} radius={0.5} smoothness={8}>
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.05} 
            metalness={1}
          />
        </RoundedBox>
        
        {/* Antennas */}
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

        {/* Screen Bezel */}
        <mesh position={[0, 0, 0.76]}>
          <RoundedBox args={[2, 1.4, 0.12]} radius={0.3} smoothness={6}>
            <meshStandardMaterial color="#000" roughness={0} metalness={1} />
          </RoundedBox>
        </mesh>

        {/* Digital Face Display */}
        <group position={[0, 0, 0.85]}>
            <mesh ref={leftEyeRef} position={[-0.45, 0, 0]}>
                <planeGeometry args={[0.42, 0.2]} />
                <meshStandardMaterial emissive={themeColor} emissiveIntensity={15} color={themeColor} transparent opacity={0.9} />
            </mesh>
            <mesh ref={rightEyeRef} position={[0.45, 0, 0]}>
                <planeGeometry args={[0.42, 0.2]} />
                <meshStandardMaterial emissive={themeColor} emissiveIntensity={15} color={themeColor} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, -0.45, 0]}>
                <planeGeometry args={[0.8, 0.04]} />
                <meshStandardMaterial emissive={themeColor} emissiveIntensity={6} color={themeColor} transparent opacity={0.6} />
            </mesh>
        </group>
        
        <pointLight position={[0, 0, 1.5]} distance={4} intensity={10} color={themeColor} />
      </group>

      {/* DRONES / HANDS */}
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
    </group>
  );
};

const Scene3D: React.FC<Scene3DProps> = ({ scrollProgress, theme }) => {
  const groupRef = useRef<THREE.Group>(null);
  const themeColor = useMemo(() => themeColors[theme], [theme]);
  
  // Custom mouse tracking to ignore HTML z-index interference
  const globalMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        // Normalize coordinates from -1 to 1
        globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        globalMouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Dynamic positioning based on scroll progress
      const visibility = Math.max(0, 1 - scrollProgress * 4);
      
      // Bot starts prominent at center-right, pushes back and fades on scroll
      const targetX = 4 - (scrollProgress * 15);
      const targetY = -0.5;
      const targetZ = -3 - (scrollProgress * 25);
      const targetScale = 1.6 * visibility;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08));
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
        />
        <Sparkles count={100} scale={15} size={3} speed={0.6} color={themeColor} opacity={0.4} />
      </group>

      {/* HIGH-FIDELITY SCENE LIGHTING */}
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
