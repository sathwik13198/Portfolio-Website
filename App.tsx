
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Environment } from '@react-three/drei';
import Scene3D from './components/Scene3D';
import ContentOverlay from './components/ContentOverlay';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type ThemeType = 'violet' | 'crimson' | 'emerald' | 'amber' | 'monochrome';

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
