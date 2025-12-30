
import React, { useRef, useEffect, useState, useMemo, ReactNode, RefObject } from 'react';
import { RESUME_DATA, PROJECTS_DATA } from '../constants';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeType } from '../App';
import { 
    IconLeetMate, 
    IconCrowdConnect, 
    IconSmartMeds, 
    IconGenericProject, 
    IconCryptography,
    IconChatbot,
    IconAccess,
    IconInterview,
    IconCodeGuardian
} from './Icon';

gsap.registerPlugin(ScrollTrigger);

interface ContentOverlayProps {
  scrollProgress: number;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

interface ScrollRevealProps {
  children: string;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.05,
  baseRotation = 2,
  blurStrength = 8,
  containerClassName = '',
  textClassName = '',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word opacity-0 inline-block" key={index} style={{ color: 'rgba(255,255,255,0.05)' }}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wordElements = el.querySelectorAll<HTMLElement>('.word');

    gsap.fromTo(
      wordElements,
      { 
        opacity: baseOpacity, 
        color: 'rgba(255,255,255,0.05)',
        filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
      },
      {
        ease: 'none',
        opacity: 1,
        color: 'var(--accent)',
        filter: 'blur(0px)',
        stagger: 0.2,
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1.2,
        }
      }
    );
  }, [children, enableBlur, baseOpacity, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <div className={`scroll-reveal-text ${textClassName}`}>{splitText}</div>
    </h2>
  );
};

const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string; fullHeight?: boolean }> = ({ children, className = "", id, fullHeight = true }) => (
  <section id={id} className={`${fullHeight ? 'min-h-screen' : ''} w-full flex flex-col justify-center px-6 md:px-24 py-16 bg-transparent ${className}`}>
    <div className="max-w-6xl mx-auto w-full relative z-20">
      {children}
    </div>
  </section>
);

const ProjectCard3D: React.FC<{ project: any }> = ({ project }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const IconComponent = (() => {
        switch (project.id) {
            case 'leetmate': return IconLeetMate;
            case 'crowdconnect': return IconCrowdConnect;
            case 'smartmeds': return IconSmartMeds;
            case 'cryptography': return IconCryptography;
            case 'chatbot': return IconChatbot;
            case 'access': return IconAccess;
            case 'interview': return IconInterview;
            case 'codeguardian': return IconCodeGuardian;
            default: return IconGenericProject;
        }
    })();

    return (
        <div 
            ref={cardRef}
            className="group relative glass-card p-8 rounded-3xl border border-white/5 hover:border-[var(--accent)] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full bg-black/40 backdrop-blur-xl"
        >
            <div ref={contentRef} className="flex flex-col h-full relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center accent-text group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                        <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{project.name}</h3>
                        <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{project.tech.split(',')[0]}</p>
                    </div>
                </div>
                <div className="flex-grow space-y-3">
                    {project.points.map((point: string, idx: number) => (
                        <p key={idx} className="text-[11px] text-gray-400 font-light leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                            {point}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ThemeSwitcher: React.FC<{ current: ThemeType; onChange: (t: ThemeType) => void }> = ({ current, onChange }) => {
    const themes: { id: ThemeType; color: string }[] = [
        { id: 'violet', color: '#8b5cf6' },
        { id: 'crimson', color: '#ef4444' },
        { id: 'emerald', color: '#10b981' },
        { id: 'amber', color: '#f59e0b' },
        { id: 'monochrome', color: '#ffffff' }
    ];

    return (
        <div className="fixed top-8 right-8 z-[100] flex items-center space-x-3 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-full shadow-2xl transition-all hover:border-white/20">
            <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest hidden sm:block">Theme</span>
            <div className="flex space-x-2">
                {themes.map(t => (
                    <button
                        key={t.id}
                        onClick={() => onChange(t.id)}
                        className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-125 ${current === t.id ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: t.color }}
                    />
                ))}
            </div>
        </div>
    );
};

const ContentOverlay: React.FC<ContentOverlayProps> = ({ scrollProgress, currentTheme, onThemeChange }) => {
  useEffect(() => {
      // Experience Reveal
      gsap.utils.toArray('.experience-item').forEach((item: any) => {
          gsap.fromTo(item, 
              { y: 50, opacity: 0 }, 
              { 
                  y: 0, opacity: 1, duration: 1, ease: "power3.out",
                  scrollTrigger: {
                      trigger: item,
                      start: "top 85%",
                      toggleActions: "play none none reverse"
                  }
              }
          );
      });

      // Simple Parallax for background text
      gsap.to(".bg-parallax-text", {
          y: -150,
          scrollTrigger: {
              trigger: "#experience",
              start: "top bottom",
              end: "bottom top",
              scrub: 1
          }
      });
  }, []);

  return (
    <div className="w-full pointer-events-none">
      <div className="pointer-events-auto">
        <ThemeSwitcher current={currentTheme} onChange={onThemeChange} />
      </div>

      {/* HERO SECTION */}
      <Section className="relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left pointer-events-none">
          <p className="accent-text font-mono text-[10px] tracking-[0.5em] uppercase mb-4 opacity-70">
            Interface Active // v4.1
          </p>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none mb-6 text-white drop-shadow-2xl">
            SATHWIK<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-[var(--accent)] to-white/90">PENTAPATI</span>
          </h1>
          <p className="max-w-lg text-lg text-gray-300 font-light leading-relaxed bg-black/20 p-4 rounded-xl backdrop-blur-sm pointer-events-auto">
            Engineering robust digital architectures and high-availability AI systems with a focus on seamless human-centric design.
          </p>
          <div className="mt-12 flex items-center space-x-6 pointer-events-auto">
              <a href="#experience" className="group relative px-8 py-3 overflow-hidden rounded-full border border-white/10 hover:border-[var(--accent)] transition-all bg-white/5">
                  <span className="relative z-10 font-bold text-sm text-white">Review Career Log</span>
              </a>
              <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SYNC_ESTABLISHED</span>
              </div>
          </div>
        </div>
      </Section>

      {/* PHILOSOPHY SECTION */}
      <Section fullHeight={false} className="py-[40vh] bg-transparent">
          <ScrollReveal containerClassName="max-w-4xl" textClassName="accent-text font-bold text-center">
            Engineering is not just about writing code; it is about architecting digital resilience. I build systems that balance high-availability with intuitive interfaces.
          </ScrollReveal>
      </Section>

      {/* EXPERIENCE SECTION */}
      <Section id="experience" className="relative bg-transparent">
        <div className="bg-parallax-text absolute -left-20 top-40 text-[20rem] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter uppercase whitespace-nowrap z-0">
            SYSTEMS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10 pointer-events-auto">
            <div className="md:col-span-4 mb-10">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none text-white">
                    CAREER <br/><span className="accent-text">HISTORY</span>
                </h2>
            </div>
            <div className="md:col-span-8 space-y-24 pl-6 border-l border-white/5">
                {RESUME_DATA.experience.map((exp, i) => (
                    <div key={i} className="experience-item">
                        <span className="text-[10px] font-mono text-[var(--accent)] opacity-80 mb-2 block tracking-[0.4em] uppercase">{exp.period}</span>
                        <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">{exp.company}</h3>
                        <p className="text-lg text-gray-400 font-medium mb-4">{exp.role}</p>
                        <div className="space-y-3">
                            {exp.points.map((p, pi) => (
                                <p key={pi} className="text-gray-500 text-sm font-light leading-relaxed">{p}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </Section>

      {/* PROJECTS SECTION */}
      <Section id="projects" className="bg-transparent">
        <div className="mb-16 pointer-events-auto">
            <h2 className="text-5xl font-bold tracking-tighter uppercase text-white">SYSTEM <span className="accent-text">DEPLOYS</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pointer-events-auto">
            {PROJECTS_DATA.map((p) => (
                <ProjectCard3D key={p.id} project={p} />
            ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 flex flex-col items-center justify-center text-[10px] font-mono text-gray-600 tracking-[0.4em] uppercase gap-4 bg-transparent">
          <div className="flex space-x-10 items-center pointer-events-auto">
              <a href={RESUME_DATA.contact.github} className="hover:accent-text">GITHUB</a>
              <a href={RESUME_DATA.contact.linkedin} className="hover:accent-text">LINKEDIN</a>
          </div>
          <div className="text-center opacity-40">© 2025 SATHWIK PENTAPATI // DIGITAL ARCHITECT</div>
      </footer>
    </div>
  );
};

export default ContentOverlay;
