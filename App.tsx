import React, { useState, useCallback, useEffect } from 'react';
import { RESUME_DATA, PROJECTS_DATA } from './constants';
import type { WindowProps, DockItem } from './types';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import Window from './components/Window';
import Terminal from './components/Terminal';
import { SkillIcon, IconEducation } from './components/SkillIcons';
import DotGrid from './components/DotGrid';

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


const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowProps[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const openWindow = useCallback((item: DockItem) => {
    setWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.id === item.id);
      if (existingWindow) {
        setActiveWindowId(item.id);
        return prevWindows.map(w => ({
          ...w,
          isClosing: false,
          zIndex: w.id === item.id ? Math.max(...prevWindows.map(win => win.zIndex)) + 1 : w.zIndex
        }));
      }

      const newZIndex = prevWindows.length > 0 ? Math.max(...prevWindows.map(w => w.zIndex)) + 1 : 10;
      const newWindow: WindowProps = {
        id: item.id,
        title: item.title,
        children: <div />,
        initialPosition: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
        initialSize: { width: 720, height: 540 },
        zIndex: newZIndex,
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
        return <div className="p-4 bg-gray-100/80 dark:bg-gray-900/80 h-full overflow-y-auto text-gray-800 dark:text-gray-200">
            <h1 className="text-2xl font-bold mb-4">Contact Me</h1>
            <p className="mb-2"><strong>Email:</strong> <a href={`mailto:${RESUME_DATA.contact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{RESUME_DATA.contact.email}</a></p>
            <p className="mb-2"><strong>Phone:</strong> {RESUME_DATA.contact.phone}</p>
            <p className="mb-2"><strong>LinkedIn:</strong> <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">linkedin.com/in/sathwik-pentapati</a></p>
            <p className="mb-2"><strong>GitHub:</strong> <a href={RESUME_DATA.contact.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">github.com/sathwik-pentapati</a></p>
            <p><strong>LeetCode:</strong> <a href={RESUME_DATA.contact.leetcode} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">leetcode.com/sathwik-pentapati</a></p>
        </div>;
      default:
        return null;
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0d1117]">
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 
              className="text-8xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-white to-[#c0a8ff]"
              style={{ textShadow: '0 0 35px rgba(136, 85, 255, 0.25)' }}
            >
                Sathwik Pentapati
            </h1>
        </div>
      <MenuBar toggleTheme={toggleTheme} />
      <div className="relative w-full h-full">
        {windows.map(win => (
          <Window
            key={win.id}
            {...win}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            isActive={win.id === activeWindowId}
          >
           {renderWindowContent(win.id)}
          </Window>
        ))}
      </div>
      <Dock onIconClick={openWindow} />
    </div>
  );
};

export default App;