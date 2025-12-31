
"use client";

import React, { useRef, useEffect, useMemo, RefObject } from 'react';
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
    IconCodeGuardian,
    IconLinkedIn,
    IconGitHub
} from './Icon';

gsap.registerPlugin(ScrollTrigger);

interface ContentOverlayProps {
  scrollProgress: number;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onButtonHover: (hovered: boolean) => void;
  onSayHiClick: () => void;
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
  enableBlur = true,
  baseOpacity = 0.05,
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
            className="group relative glass-card p-8 rounded-3xl border border-white/5 hover:border-[var(--accent)] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full bg-black/40 backdrop-blur-xl"
        >
            <div className="flex flex-col h-full relative z-10">
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

const SkillPill: React.FC<{ skill: string }> = ({ skill }) => {
    return (
        <div className="skill-pill-item group/pill relative px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all duration-300 flex items-center justify-center cursor-default min-w-[80px]">
            <span className="text-[11px] font-mono text-gray-400 group-hover/pill:text-white transition-colors duration-300 uppercase tracking-wider text-center">{skill}</span>
            <div className="absolute inset-0 rounded-xl shadow-[0_0_15px_var(--accent)] opacity-0 group-hover/pill:opacity-20 transition-opacity duration-300"></div>
        </div>
    );
};

const ContentOverlay: React.FC<ContentOverlayProps> = ({ currentTheme, onThemeChange, onButtonHover, onSayHiClick }) => {
  useEffect(() => {
      gsap.utils.toArray('.reveal-card').forEach((card: any) => {
          gsap.fromTo(card, 
              { y: 50, opacity: 0, scale: 0.95 }, 
              { 
                  y: 0, 
                  opacity: 1, 
                  scale: 1,
                  duration: 1, 
                  ease: "power4.out",
                  scrollTrigger: {
                      trigger: card,
                      start: "top 90%",
                      toggleActions: "play none none reverse"
                  }
              }
          );
      });

      gsap.utils.toArray('.skill-category-card').forEach((card: any) => {
          const pills = card.querySelectorAll('.skill-pill-item');
          gsap.fromTo(pills,
              { opacity: 0, scale: 0.5, y: 15 },
              {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.05,
                  ease: "back.out(2)",
                  scrollTrigger: {
                      trigger: card,
                      start: "top 85%",
                      toggleActions: "play none none reverse"
                  }
              }
          );
      });

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

      {/* HERO */}
      <Section className="relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left pointer-events-none">
          <p className="accent-text font-mono text-[10px] tracking-[0.5em] uppercase mb-4 opacity-70 hover:opacity-100 transition-opacity duration-300 hover-glow cursor-default">Interface Active // v4.1</p>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none mb-6 text-white drop-shadow-2xl">
            <span className="inline-block transition-all duration-300 hover:scale-105 hover-glow cursor-default">SATHWIK</span>
            <br/>
            <span className="inline-block relative text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-[var(--accent)] to-white/90 transition-all duration-300 hover:scale-105 cursor-default">
              <span className="absolute inset-0 bg-gradient-to-r from-white/90 via-[var(--accent)] to-white/90 bg-clip-text text-transparent blur-sm opacity-50 hover:opacity-75 transition-opacity duration-300"></span>
              <span className="relative bg-gradient-to-r from-white/90 via-[var(--accent)] to-white/90 bg-clip-text text-transparent hover-glow" style={{backgroundSize: '200% 100%'}}>PENTAPATI</span>
            </span>
          </h1>
          <p className="max-w-lg text-lg text-gray-300 font-light leading-relaxed bg-black/20 p-4 rounded-xl backdrop-blur-sm pointer-events-auto border border-transparent hover:border-white/10 hover:bg-black/30 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)] transition-all duration-300 cursor-default">
            Engineering robust digital architectures and high-availability AI systems with a focus on seamless human-centric design.
          </p>
          <div className="mt-12 flex items-center space-x-6 pointer-events-auto">
              <a 
                href="#experience" 
                className="group relative px-8 py-3 overflow-hidden rounded-full border border-white/10 hover:border-[var(--accent)] transition-all bg-white/5 hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] active:scale-95"
                onMouseEnter={() => onButtonHover(true)}
                onMouseLeave={() => onButtonHover(false)}
              >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300"></span>
                  <span className="relative z-10 font-bold text-sm text-white flex items-center gap-2">
                    Review Career Log
                    <svg className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
              </a>
              <button
                onClick={onSayHiClick}
                className="group relative px-6 py-3 overflow-hidden rounded-full border border-white/10 hover:border-[var(--accent)] transition-all bg-white/5 hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] active:scale-95 glass-card backdrop-blur-sm"
                aria-label="Say Hi to robot"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300"></span>
                <span className="relative z-10 font-bold text-sm text-white flex items-center gap-2">
                  👋 Say Hi
                </span>
              </button>
              <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 group cursor-default">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition-transform duration-300"></span>
                  <span className="group-hover:text-gray-300 transition-colors duration-300">SYNC_ESTABLISHED</span>
              </div>
          </div>
        </div>
      </Section>

      {/* PHILOSOPHY */}
      <Section fullHeight={false} className="py-[40vh] bg-transparent">
          <ScrollReveal containerClassName="max-w-4xl" textClassName="accent-text font-bold text-center">
            Engineering is not just about writing code; it is about architecting digital resilience. I build systems that balance high-availability with intuitive interfaces.
          </ScrollReveal>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" className="relative bg-transparent overflow-hidden">
        <div className="bg-parallax-text absolute -left-20 top-40 text-[20rem] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter uppercase whitespace-nowrap z-0">SYSTEMS</div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10 pointer-events-auto">
            <div className="md:col-span-4 mb-10 md:sticky md:top-24 md:h-fit">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none text-white">CAREER <br/><span className="accent-text">HISTORY</span></h2>
                <div className="mt-6 h-1 w-24 bg-gradient-to-r from-[var(--accent)] to-transparent rounded-full"></div>
            </div>
            <div className="md:col-span-8 space-y-12 relative">
                <div className="absolute left-0 md:-left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)] via-white/5 to-transparent"></div>
                {RESUME_DATA.experience.map((exp, i) => (
                    <div key={i} className="reveal-card relative pl-8 md:pl-12 group">
                        <div className="absolute left-[-4px] md:left-[-10px] top-10 w-2 h-2 md:w-5 md:h-5 rounded-full bg-black border-2 border-[var(--accent)] z-20 shadow-[0_0_15px_var(--accent)] group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-[var(--accent)]/50 transition-all duration-700 bg-black/40 backdrop-blur-2xl shadow-2xl group-hover:bg-black/60">
                            <span className="text-[10px] font-mono text-[var(--accent)] opacity-80 mb-4 block tracking-[0.4em] uppercase">{exp.period}</span>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
                                <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight group-hover:text-[var(--accent)] transition-colors duration-500">{exp.company}</h3>
                                <p className="text-lg text-gray-400 font-medium italic">{exp.role}</p>
                            </div>
                            <div className="space-y-4">
                                {exp.points.map((p, pi) => (
                                    <div key={pi} className="flex items-start gap-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0 opacity-40"></span>
                                        <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">{p}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" className="bg-transparent">
        <div className="mb-16 pointer-events-auto">
            <h2 className="text-5xl font-bold tracking-tighter uppercase text-white">SYSTEM <span className="accent-text">DEPLOYS</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pointer-events-auto">
            {PROJECTS_DATA.map((p) => (
                <div key={p.id} className="reveal-card h-full">
                    <ProjectCard3D project={p} />
                </div>
            ))}
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" className="bg-transparent">
        <div className="mb-16 pointer-events-auto">
            <h2 className="text-5xl font-bold tracking-tighter uppercase text-white">TECHNICAL <span className="accent-text">SKILLS</span></h2>
            <p className="text-gray-500 mt-2 font-mono text-xs uppercase tracking-widest">Interactive competency mapping</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pointer-events-auto">
            {RESUME_DATA.skillCategories.map((cat, i) => (
                <div key={i} className="reveal-card skill-category-card group/cat relative p-8 rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-2xl transition-all duration-500 hover:border-[var(--accent)]/30 hover:bg-black/60 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover/cat:opacity-50 animate-[scan_3s_linear_infinite] pointer-events-none"></div>
                    
                    <h3 className="text-lg font-bold text-white mb-8 tracking-tight flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"></span>
                        {cat.title}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {cat.items.map((item, ii) => (
                            <SkillPill key={ii} skill={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </Section>

      {/* EDUCATION & ACHIEVEMENTS */}
      <Section id="education" className="bg-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 pointer-events-auto">
            <div className="space-y-12">
                <h2 className="text-4xl font-bold text-white uppercase tracking-tighter">Academic <span className="accent-text">Nodes</span></h2>
                {RESUME_DATA.education.map((edu, i) => (
                    <div key={i} className="reveal-card glass-card p-8 rounded-3xl border border-white/5 hover:border-[var(--accent)]/50 transition-all duration-500 bg-black/40 backdrop-blur-2xl hover:bg-black/60 group/edu relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/5 to-[var(--accent)]/0 opacity-0 group-hover/edu:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover/edu:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white group-hover/edu:text-[var(--accent)] transition-colors duration-500">{edu.institution}</h3>
                            <p className="text-[var(--accent)] font-mono text-xs uppercase mt-2">{edu.degree}</p>
                            <p className="text-gray-400 text-sm mt-4 italic group-hover/edu:text-gray-300 transition-colors duration-500">{edu.details}</p>
                            <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-gray-500 group-hover/edu:text-gray-400 transition-colors duration-500">
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-60 group-hover/edu:opacity-100 group-hover/edu:animate-pulse transition-opacity duration-500"></span>
                                    PERIOD: {edu.period}
                                </span>
                                <span className="accent-text group-hover/edu:opacity-80 transition-opacity duration-500">VERIFIED_LOG</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-12">
                <h2 className="text-4xl font-bold text-white uppercase tracking-tighter">Success <span className="accent-text">Records</span></h2>
                <div className="space-y-4">
                    {RESUME_DATA.achievements.map((ach, i) => (
                        <div key={i} className="reveal-card glass-card p-6 rounded-2xl border border-white/5 flex items-start gap-4 hover:border-[var(--accent)] transition-all">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                <span className="text-[var(--accent)] text-lg">★</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{ach}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" className="bg-transparent text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="text-[30vw] font-bold text-white select-none">CONNECT</span>
        </div>
        <div className="relative z-10 pointer-events-auto space-y-10">
            <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter uppercase leading-none">Let's Build <br/> The <span className="accent-text">Future.</span></h2>
            <p className="max-w-xl mx-auto text-gray-400 text-lg font-light leading-relaxed">Currently open for collaborations on mission-critical architectures and experimental digital experiences.</p>
            <div className="flex flex-wrap justify-center items-center gap-6 mt-16">
                <a href={`mailto:${RESUME_DATA.contact.email}`} className="group relative px-10 py-4 bg-white text-black font-bold rounded-full overflow-hidden hover:scale-105 transition-all">
                    <span className="relative z-10">INITIALIZE EMAIL</span>
                    <div className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </a>
                <a 
                    href="/SathwikPentapati_resume.pdf" 
                    download="Sathwik_Pentapati_Resume.pdf"
                    className="group relative px-8 py-4 border-2 border-white/20 hover:border-[var(--accent)] rounded-full font-bold text-white overflow-hidden hover:scale-105 transition-all backdrop-blur-sm bg-white/5"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        DOWNLOAD RESUME
                    </span>
                    <div className="absolute inset-0 bg-[var(--accent)]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </a>
                <div className="flex items-center space-x-4">
                    <a href={RESUME_DATA.contact.linkedin} target="_blank" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:border-[var(--accent)] hover:scale-110 transition-all"><IconLinkedIn className="w-6 h-6 text-white" /></a>
                    <a href={RESUME_DATA.contact.github} target="_blank" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:border-[var(--accent)] hover:scale-110 transition-all"><IconGitHub className="w-6 h-6 text-white" /></a>
                </div>
            </div>
        </div>
      </Section>

      <footer className="py-20 border-t border-white/5 flex flex-col items-center justify-center text-[10px] font-mono text-gray-600 tracking-[0.4em] uppercase gap-6 bg-transparent">
          <div className="flex space-x-12 items-center pointer-events-auto">
              <span className="opacity-40">System_OK</span>
              <span className="opacity-40">Lat_24.00ms</span>
              <span className="accent-text">V4.1.0_PROD</span>
          </div>
          <a 
            href="/SathwikPentapati_resume.pdf" 
            download="Sathwik_Pentapati_Resume.pdf"
            className="pointer-events-auto text-gray-500 hover:text-[var(--accent)] transition-colors duration-300 flex items-center gap-2 lowercase tracking-normal normal-case text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Resume PDF</span>
          </a>
          <div className="text-center opacity-30">© 2025 SATHWIK PENTAPATI // DIGITAL ARCHITECT</div>
      </footer>
    </div>
  );
};

export default ContentOverlay;
