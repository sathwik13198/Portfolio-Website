
import React, { useRef, useMemo } from 'react';
import { RESUME_DATA, PROJECTS_DATA } from '../constants';
import { IconEmail, IconLinkedIn, IconGitHub, IconLeetCode } from './Icon';
import Terminal from './Terminal';

interface UIProps {
  scrollProgress: number;
}

const HolographicUI: React.FC<UIProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax tilt effect for panels based on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  return (
    <div 
      className="fixed inset-0 z-20 pointer-events-none flex flex-col perspective-1000"
      onMouseMove={handleMouseMove}
    >
      <div ref={containerRef} className="w-full h-full transition-transform duration-100 ease-out flex flex-col">
        
        {/* HEADER - Fades out as we scroll deep */}
        <header 
          className="p-10 flex justify-between items-start pointer-events-auto transition-opacity duration-500"
          style={{ opacity: 1 - scrollProgress * 5 }}
        >
          <div>
            <h1 className="text-4xl font-display font-bold neon-text tracking-tighter">
              {RESUME_DATA.name.split(' ')[0]}<br/>
              <span className="text-violet-500">{RESUME_DATA.name.split(' ')[1]}</span>
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-white/40 mt-2">SYSTEM.PROTOCOL_V12</p>
          </div>
          <div className="flex flex-col items-end space-y-4">
             <SocialIcon href={RESUME_DATA.contact.github} icon={<IconGitHub className="w-5 h-5" />} />
             <SocialIcon href={RESUME_DATA.contact.linkedin} icon={<IconLinkedIn className="w-5 h-5" />} />
             <SocialIcon href={RESUME_DATA.contact.leetcode} icon={<IconLeetCode className="w-5 h-5" />} />
          </div>
        </header>

        {/* HERO SECTION (Scroll 0.0 - 0.25) */}
        <section 
          className="flex-1 flex items-center justify-center p-10 transition-all duration-500"
          style={{ 
            opacity: scrollProgress < 0.2 ? (1 - scrollProgress * 5) : 0,
            transform: `translateY(${scrollProgress * -100}px)`
          }}
        >
          <div className="max-w-xl text-center pointer-events-auto">
             <div className="inline-block px-4 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-[10px] font-mono text-violet-400 mb-6 tracking-[0.2em] uppercase">
                Now Online
             </div>
             <h2 className="text-6xl font-display font-bold mb-6 leading-tight">
                Architecting <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Digital Realities</span>
             </h2>
             <p className="text-gray-400 text-sm font-light max-w-md mx-auto leading-relaxed">
                Scroll to explore my professional architecture through a deep-space data visualization.
             </p>
          </div>
        </section>

        {/* PROJECTS SECTION (Scroll 0.25 - 0.5) */}
        <section 
           className="fixed inset-0 flex items-center justify-end p-20 pointer-events-none transition-all duration-500"
           style={{ 
             opacity: (scrollProgress > 0.2 && scrollProgress < 0.6) ? 1 : 0,
             transform: `translateX(${(0.4 - scrollProgress) * 500}px)`
           }}
        >
          <div className="glass p-10 rounded-3xl w-full max-w-lg pointer-events-auto space-y-6">
             <h3 className="text-violet-400 font-mono text-[10px] tracking-widest uppercase">Registry // Module_Projects</h3>
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                {PROJECTS_DATA.slice(0, 4).map((p, i) => (
                    <div key={i} className="group p-4 bg-white/5 rounded-xl border border-white/5 hover:border-violet-500/40 transition-all">
                        <h4 className="font-bold text-white text-sm mb-1">{p.name}</h4>
                        <p className="text-[10px] text-gray-500 line-clamp-2">{p.points[0]}</p>
                    </div>
                ))}
             </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION (Scroll 0.6 - 0.85) */}
        <section 
           className="fixed inset-0 flex items-center justify-start p-20 pointer-events-none transition-all duration-500"
           style={{ 
             opacity: (scrollProgress > 0.6 && scrollProgress < 0.9) ? 1 : 0,
             transform: `translateX(${(scrollProgress - 0.75) * 500}px)`
           }}
        >
          <div className="glass p-10 rounded-3xl w-full max-w-lg pointer-events-auto space-y-6">
             <h3 className="text-cyan-400 font-mono text-[10px] tracking-widest uppercase">Registry // Module_History</h3>
             <div className="space-y-8">
                {RESUME_DATA.experience.slice(0, 2).map((exp, i) => (
                    <div key={i} className="relative pl-8 border-l border-white/10">
                        <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                        <h4 className="font-bold text-white text-sm">{exp.company}</h4>
                        <p className="text-[10px] text-cyan-400/60 mb-2">{exp.role}</p>
                        <p className="text-[11px] text-gray-400 font-light">{exp.points[0]}</p>
                    </div>
                ))}
             </div>
          </div>
        </section>

        {/* TERMINAL SECTION (Scroll 0.9 - 1.0) */}
        <section 
           className="fixed inset-0 flex items-center justify-center p-10 pointer-events-none transition-all duration-500"
           style={{ 
             opacity: (scrollProgress > 0.85) ? 1 : 0,
             transform: `scale(${1 + (scrollProgress - 1) * 2})`
           }}
        >
          <div className="w-full max-w-3xl h-[450px] pointer-events-auto">
              <div className="glass h-full rounded-2xl overflow-hidden flex flex-col shadow-2xl border-violet-500/50">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 border-b border-white/5">
                      <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                      <span className="text-[9px] font-mono text-gray-500 ml-4">NEURAL_INTERFACE_CONNECTED</span>
                  </div>
                  <Terminal />
              </div>
          </div>
        </section>

      </div>

      {/* FOOTER STATUS */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-none text-[9px] font-mono text-gray-600">
         <div className="flex items-center space-x-6">
            <span>DEPTH: {(scrollProgress * 1000).toFixed(0)}m</span>
            <span>SYSTEM: {scrollProgress > 0.9 ? 'FINAL_SYNC' : 'ACTIVE_SCAN'}</span>
         </div>
         <div className="opacity-50">BY SATHWIK // 2025</div>
      </footer>
    </div>
  );
};

const SocialIcon = ({ href, icon }: { href: string; icon: any }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="p-3 glass rounded-lg hover:bg-violet-500/20 hover:text-violet-400 transition-all duration-300"
  >
    {icon}
  </a>
);

export default HolographicUI;
