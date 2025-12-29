
import React, { useState, useCallback, useEffect } from 'react';
import { RESUME_DATA, PROJECTS_DATA } from '../constants';
import type { WindowProps, DockItem } from '../types';
import MenuBar from './MenuBar';
import Dock from './Dock';
import Window from './Window';
import Terminal from './Terminal';
import { SkillIcon, IconEducation } from './SkillIcons';
import DotGrid from './DotGrid';
import ResumeContent from './ResumeContent';

interface DesktopViewProps {
    toggleTheme: () => void;
}

interface TypingAnimationProps {
  roles: string[];
  prefix?: string;
  className?: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
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
      } else {
        setTypingSpeed(isDeleting ? 75 : 150); // Normal typing/deleting speed
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


const ProjectsContent: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100/80 dark:bg-gray-900/80 h-full overflow-y-auto text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      <div className="space-y-6">
        {PROJECTS_DATA.map(project => (
          <div key={project.name} className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{project.name}</h2>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1 mb-2">{project.tech}</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                {project.points.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutContent: React.FC = () => {
    const skills = RESUME_DATA.skills;
    const skillCategories = [
        { title: "Languages", skills: skills.languages.split(', ') },
        { title: "Technologies & Frameworks", skills: skills.technologiesAndFrameworks.split(', ') },
        { title: "Tools & Platforms", skills: skills.toolsAndPlatforms.split(', ') },
    ];
    let skillDelay = 0;

    return (
        <div className="p-6 bg-gray-100/80 dark:bg-gray-900/80 h-full overflow-y-auto text-gray-800 dark:text-gray-200 space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-1">{RESUME_DATA.name}</h1>
                <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-4">{RESUME_DATA.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">I am a passionate Full Stack Developer with experience in building scalable web applications using technologies like React, Node.js, and modern cloud platforms. I thrive in collaborative environments and I am always eager to learn and apply new skills to solve complex problems.</p>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <IconEducation /> <span className="ml-2">Education</span>
                </h2>
                <div className="space-y-4">
                    {RESUME_DATA.education.map((edu, index) => (
                        <div key={index} className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{edu.institution}</h3>
                            <p className="text-md text-gray-700 dark:text-gray-300">{edu.degree}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period} | {edu.details}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {skillCategories.map(category => {
                    return (
                        <div key={category.title} className="mb-6">
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{category.title}</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                {category.skills.map((skill) => {
                                    skillDelay += 0.03;
                                    return (
                                        <div 
                                            key={skill} 
                                            className="skill-item flex flex-col items-center justify-center p-3 bg-white/50 dark:bg-black/20 rounded-lg text-center transition-transform transform hover:scale-110"
                                            style={{ animationDelay: `${skillDelay}s` }}
                                        >
                                            <SkillIcon skill={skill} />
                                            <span className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">{skill}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};


const DesktopView: React.FC<DesktopViewProps> = ({ toggleTheme }) => {
  const [windows, setWindows] = useState<WindowProps[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((item: DockItem) => {
    setWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.id === item.id);
      if (existingWindow) {
        setActiveWindowId(item.id);
        const maxZ = Math.max(...prevWindows.map(win => win.zIndex), 0);
        return prevWindows.map(w => ({
          ...w,
          isClosing: false,
          isMinimized: false,
          zIndex: w.id === item.id ? maxZ + 1 : w.zIndex
        }));
      }

      const newZIndex = prevWindows.length > 0 ? Math.max(...prevWindows.map(w => w.zIndex)) + 1 : 10;
      const newWindow: WindowProps = {
        id: item.id,
        title: item.title,
        children: <div />,
        initialPosition: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
        initialSize: { width: item.id === 'resume' ? 860 : 720, height: item.id === 'resume' ? 640 : 540 },
        zIndex: newZIndex,
        isMinimized: false,
      };
      
      setActiveWindowId(item.id);
      return [...prevWindows, newWindow];
    });
  }, []);

  const closeWindow = (id: string) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, isClosing: true } : w)));

    setTimeout(() => {
        setWindows(currentWindows => {
            const remainingWindows = currentWindows.filter(w => w.id !== id);
            if (activeWindowId === id) {
                if (remainingWindows.length > 0) {
                    const topWindow = remainingWindows.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
                    setActiveWindowId(topWindow.id);
                } else {
                    setActiveWindowId(null);
                }
            }
            return remainingWindows;
        });
    }, 200);
  };

  const minimizeWindow = (id: string) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, isMinimized: true } : w)));
    setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(windows => {
        const maxZIndex = Math.max(...windows.map(w => w.zIndex).filter(z => isFinite(z)), 0);
        return windows.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w);
    });
  };

  const renderWindowContent = (id: string) => {
    switch(id) {
      case 'terminal':
        return <Terminal />;
      case 'about':
        return <AboutContent />;
      case 'projects':
        return <ProjectsContent />;
      case 'experience':
        return <div className="p-4 bg-gray-100/80 dark:bg-gray-900/80 h-full overflow-y-auto text-gray-800 dark:text-gray-200">
            <h1 className="text-2xl font-bold mb-4">Professional Experience</h1>
            {RESUME_DATA.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                    <h2 className="text-xl font-semibold">{exp.company} - <span className="font-normal">{exp.role}</span></h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exp.period} | {exp.location}</p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                        {exp.points.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                </div>
            ))}
        </div>;
      case 'contact':
        return (
          <div className="p-6 bg-gray-100/80 dark:bg-gray-900/80 h-full flex flex-col text-gray-800 dark:text-gray-200">
            <h1 className="text-2xl font-bold mb-4">Contact Me</h1>
            <div className="space-y-3 flex-grow">
              <p><strong>Email:</strong> <a href={`mailto:${RESUME_DATA.contact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{RESUME_DATA.contact.email}</a></p>
              <p><strong>Phone:</strong> {RESUME_DATA.contact.phone}</p>
              <p><strong>LinkedIn:</strong> <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">linkedin.com/in/sathwik-pentapati</a></p>
              <p><strong>GitHub:</strong> <a href={RESUME_DATA.contact.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">github.com/sathwik-pentapati</a></p>
              <p><strong>LeetCode:</strong> <a href={RESUME_DATA.contact.leetcode} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">leetcode.com/sathwik-pentapati</a></p>
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={() => openWindow({ 
                  id: 'resume', 
                  title: 'Sathwik Pentapati - Resume', 
                  icon: <React.Fragment /> 
                })}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="View my resume"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                View Resume
              </button>
            </div>
          </div>
        );
      case 'resume':
        return <ResumeContent />;
      default:
        return null;
    }
  }

  return (
    <div className="w-full h-full">
        <div className="absolute inset-0 z-0">
            <DotGrid
                dotSize={2}
                gap={25}
                baseColor="#2a2a3a"
                activeColor="#8855ff"
                proximity={100}
                shockRadius={200}
                shockStrength={0.2}
                resistance={250}
                returnDuration={0.5}
            />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <h1 
              className="text-8xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-white to-[#c0a8ff]"
              style={{ textShadow: '0 0 35px rgba(136, 85, 255, 0.25)' }}
            >
                Sathwik Pentapati
            </h1>
            <TypingAnimation
                roles={["Full Stack", "Front End", "Back End"]}
                className="text-2xl font-medium text-gray-300 mt-4"
            />
        </div>
      <MenuBar toggleTheme={toggleTheme} />
      <div className="relative w-full h-full">
        {windows.map(win => (
          <Window
            key={win.id}
            {...win}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            isActive={win.id === activeWindowId}
          >
           {renderWindowContent(win.id)}
          </Window>
        ))}
      </div>
      <Dock onIconClick={openWindow} openWindows={windows} />
    </div>
  );
};

export default DesktopView;
