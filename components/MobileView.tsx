import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RESUME_DATA, PROJECTS_DATA } from '../constants';
import type { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconLeetMate, IconCrowdConnect, IconSmartMeds, IconGenericProject, IconEmail, IconLinkedIn, IconGitHub, IconLeetCode } from './Icon';
import DotGrid from './DotGrid';

interface MobileViewProps {
    toggleTheme: () => void;
}

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
];

// Typing Animation Component (as seen in DesktopView)
const TypingAnimation: React.FC<{ roles: string[]; prefix?: string; className?: string; }> = ({ 
  roles, 
  prefix = "Software Developer - ", 
  className = "" 
}) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentRole = roles[roleIndex];
      const updatedText = isDeleting 
        ? currentRole.substring(0, text.length - 1)
        : currentRole.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentRole) {
        setTypingSpeed(2000); // Pause at end of word
        setIsDeleting(true);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
        setTypingSpeed(150);
      } else if (isDeleting) {
        setTypingSpeed(75);
      } else {
        setTypingSpeed(150);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex, roles, typingSpeed]);

  return (
    <h2 className={className}>
      {`${prefix}${text}`}
      <span className="animate-pulse">|</span>
    </h2>
  );
};


const MobileNav: React.FC<{ toggleTheme: () => void }> = ({ toggleTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    // FIX: Changed ref type to allow for null values from ref callbacks on unmount.
    const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (isOpen) {
            // FIX: Filter out any null values from the refs array before passing to GSAP.
            gsap.fromTo(navLinksRef.current.filter(Boolean), 
                { y: -30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [isOpen]);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <span className="text-xl font-bold text-gray-800 dark:text-white">SP</span>
                    </div>
                    <div className="flex items-center">
                         <button onClick={toggleTheme} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none" aria-label="Toggle dark mode">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>
                        <div className="-mr-2 flex md:hidden ml-2">
                            <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navLinks.map((link, i) => (
                            <a key={link.name} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} ref={el => { navLinksRef.current[i] = el; }} className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium opacity-0">{link.name}</a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}

const MobileChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'model', parts: [{ text: "Hi! How can I help you learn about Sathwik's resume?" }] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    const suggestions = [
        "Tell me about Sathwik",
        "What are his top skills?",
        "Summarize his experience",
    ];

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
  
    const handleApiCall = async (userInput: string, currentMessages: ChatMessage[]) => {
        setIsLoading(true);
        try {
          const responseText = await getChatbotResponse(userInput, currentMessages);
          const modelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
          setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
          const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I couldn't get a response. Please try again." }] };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
  
      const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      const currentInput = input;
      setInput('');
      await handleApiCall(currentInput, newMessages);
    };

    const handleSuggestionClick = async (suggestion: string) => {
        if (isLoading) return;
        const userMessage: ChatMessage = { role: 'user', parts: [{ text: suggestion }] };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        await handleApiCall(suggestion, newMessages);
    };
  
    return (
      <>
        <div className={`fixed bottom-0 right-0 m-4 sm:m-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <button onClick={() => setIsOpen(true)} className="chatbot-glow bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center" aria-label="Open chatbot">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>
        </div>
        
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>

        <div className={`fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="mx-auto max-w-lg h-[70vh] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-t-2xl flex flex-col shadow-2xl">
                <header className="flex items-center justify-between p-4 border-b border-gray-300/50 dark:border-gray-700/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" aria-label="Close chatbot">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                            </div>
                        </div>
                    ))}

                    {!isLoading && messages.length === 1 && (
                        <div className="flex flex-col items-start space-y-2 pt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Or try one of these prompts:</p>
                            {suggestions.map((text, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSuggestionClick(text)}
                                    className="bg-gray-200/80 dark:bg-gray-700/80 text-blue-600 dark:text-blue-400 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300/50 dark:border-gray-700/50">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about my resume..."
                            className="w-full px-4 py-2 bg-gray-200/50 dark:bg-gray-900/50 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-blue-600 text-white rounded-full p-3 disabled:bg-blue-400 disabled:cursor-not-allowed" disabled={isLoading || !input.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </>
    );
  };


const ProjectCard: React.FC<{ project: typeof PROJECTS_DATA[0] }> = ({ project }) => {
    const ProjectIcon = useMemo(() => {
        const name = project.name.toLowerCase();
        if (name.includes('leetmate')) return IconLeetMate;
        if (name.includes('crowdconnect')) return IconCrowdConnect;
        if (name.includes('smart meds')) return IconSmartMeds;
        return IconGenericProject;
    }, [project.name]);

    return (
        <div className="project-card animated-card bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 dark:border-black/20 shadow-md">
            <div className="p-6">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg flex items-center justify-center">
                        <ProjectIcon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h4>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{project.tech}</p>
                    </div>
                </div>
                <ul className="list-disc list-inside mt-4 space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                    {project.points.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
            </div>
        </div>
    );
};


const MobileView: React.FC<MobileViewProps> = ({ toggleTheme }) => {

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(".header-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
        
        gsap.fromTo(".contact-icon", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.4 }
        );

        gsap.utils.toArray('.animated-card').forEach((card: any) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 50 }, 
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        return () => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    
    const technicalSkills = [
        { title: "Languages", skills: RESUME_DATA.skills.languages },
        { title: "Tools & Platforms", skills: RESUME_DATA.skills.toolsAndPlatforms },
        { title: "Technologies & Frameworks", skills: RESUME_DATA.skills.technologiesAndFrameworks },
        { title: "Testing & Security", skills: RESUME_DATA.skills.testingAndSecurity },
        { title: "Operating Systems", skills: RESUME_DATA.skills.operatingSystems },
    ];

    return (
        <div className="relative w-full text-gray-800 dark:text-gray-200">
             <div className="absolute inset-0 z-0 opacity-50 dark:opacity-100">
                <DotGrid
                    dotSize={1}
                    gap={25}
                    baseColor={"#2a2a3a"}
                    activeColor={"#8855ff"}
                    proximity={80}
                    shockRadius={150}
                    shockStrength={0.2}
                    resistance={250}
                    returnDuration={0.5}
                />
            </div>
            <div className="relative z-10">
                <MobileNav toggleTheme={toggleTheme} />

                <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                    {/* Header Section */}
                    <header className="min-h-screen flex flex-col justify-center text-center">
                        <div className="header-content">
                            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                Sathwik Pentapati
                            </h1>
                            <TypingAnimation
                                roles={["Full Stack", "Front End", "Back End"]}
                                prefix="Software Developer - "
                                className="text-xl sm:text-2xl font-semibold text-blue-500 dark:text-blue-400 mt-4 h-8"
                            />
                            <div className="mt-8 flex justify-center space-x-6">
                                <a href={`mailto:${RESUME_DATA.contact.email}`} className="contact-icon text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-115" aria-label="Email"><IconEmail className="w-7 h-7" /></a>
                                <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-icon text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-115" aria-label="LinkedIn"><IconLinkedIn className="w-7 h-7" /></a>
                                <a href={RESUME_DATA.contact.github} target="_blank" rel="noopener noreferrer" className="contact-icon text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-115" aria-label="GitHub"><IconGitHub className="w-7 h-7" /></a>
                            </div>
                        </div>
                    </header>

                    {/* Sections */}
                    <div className="space-y-24 pb-24">
                        <section id="about" className="mobile-section">
                            <h3 className="animated-card text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">About Me</h3>
                            <p className="animated-card text-gray-600 dark:text-gray-300 text-lg leading-relaxed">I am a passionate Full Stack Developer with experience in building scalable web applications using technologies like React, Node.js, and modern cloud platforms. I thrive in collaborative environments and I am always eager to learn and apply new skills to solve complex problems.</p>
                        </section>
                        
                        <section id="experience" className="mobile-section">
                            <h3 className="animated-card text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Experience</h3>
                            <div className="space-y-8">
                                {RESUME_DATA.experience.map((exp) => (
                                    <div key={exp.company} className="animated-card">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{exp.role}</p>
                                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{exp.company}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{exp.period} | {exp.location}</p>
                                        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                            {exp.points.map((point, i) => <li key={i}>{point}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="projects" className="mobile-section">
                            <h3 className="animated-card text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Projects</h3>
                            <div className="space-y-8">
                                {PROJECTS_DATA.map((project) => (
                                    <ProjectCard key={project.name} project={project} />
                                ))}
                            </div>
                        </section>
                        
                        <section id="skills" className="mobile-section">
                            <h3 className="animated-card text-3xl font-bold mb-8 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Skills</h3>
                            
                            <div className="mb-12 animated-card">
                                <h4 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center sm:text-left">Technical Skills</h4>
                                <div className="space-y-8">
                                    {technicalSkills.map(({ title, skills }) => (
                                        <div key={title}>
                                            <h5 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{title}</h5>
                                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                                {skills.split(', ').map(skill => (
                                                    <div key={skill} className="shiny-button skill-button rounded-full border border-gray-300 dark:border-gray-700 p-px">
                                                        <div className="bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-full px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors">
                                                            {skill}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="animated-card">
                                <h4 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center sm:text-left">Soft Skills</h4>
                                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                    {RESUME_DATA.skills.softSkills.split(', ').map(skill => (
                                        <div key={skill} className="shiny-button skill-button rounded-full border border-gray-300 dark:border-gray-700 p-px">
                                            <div className="bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-full px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors">
                                                {skill}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="mobile-section">
                            <h3 className="animated-card text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Education</h3>
                            <div className="space-y-6">
                            {RESUME_DATA.education.map((edu, index) => (
                                 <div key={index} className="animated-card">
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{edu.degree}</p>
                                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{edu.institution}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period} | {edu.details}</p>
                                </div>
                            ))}
                            </div>
                        </section>
                    </div>
                </main>
                <MobileChatbot />
            </div>
        </div>
    );
};

export default MobileView;