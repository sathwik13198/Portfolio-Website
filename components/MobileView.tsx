import React, { useState, useEffect } from 'react';
import { RESUME_DATA, PROJECTS_DATA } from '../constants';

interface MobileViewProps {
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


const MobileView: React.FC<MobileViewProps> = ({ toggleTheme }) => {
    return (
        <div className="h-full w-full overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 tech-background">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                {/* Header */}
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">{RESUME_DATA.name}</h1>
                    <TypingAnimation
                        roles={["Full Stack", "Front End", "Back End"]}
                        className="text-lg sm:text-xl font-semibold text-blue-500 dark:text-blue-400 mb-4 h-8 block"
                    />
                    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm text-gray-600 dark:text-gray-300">
                        <a href={`mailto:${RESUME_DATA.contact.email}`} className="hover:underline">Email</a>
                        <span>&bull;</span>
                        <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                        <span>&bull;</span>
                        <a href={RESUME_DATA.contact.github} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                        <span>&bull;</span>
                        <a href={RESUME_DATA.contact.leetcode} target="_blank" rel="noopener noreferrer" className="hover:underline">LeetCode</a>
                    </div>
                </header>

                {/* About Section */}
                <section className="mb-10 p-4 bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">About Me</h3>
                    <p className="text-gray-600 dark:text-gray-300">I am a passionate Full Stack Developer with experience in building scalable web applications using technologies like React, Node.js, and modern cloud platforms. I thrive in collaborative environments and I am always eager to learn and apply new skills to solve complex problems.</p>
                </section>
                
                {/* Experience Section */}
                <section className="mb-10 p-4 bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Experience</h3>
                    {RESUME_DATA.experience.map((exp, index) => (
                        <div key={index} className="mb-6 last:mb-0">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{exp.role}</p>
                            <p className="text-md font-medium text-gray-700 dark:text-gray-300">{exp.company}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{exp.period} | {exp.location}</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                {exp.points.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                {/* Projects Section */}
                <section className="mb-10 p-4 bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Projects</h3>
                    {PROJECTS_DATA.map((project, index) => (
                        <div key={index} className="mb-6 last:mb-0">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</p>
                            <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-2">{project.tech}</p>
                             <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                {project.points.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                
                {/* Skills Section */}
                <section className="mb-10 p-4 bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Skills</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Languages</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{RESUME_DATA.skills.languages}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Technologies & Frameworks</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{RESUME_DATA.skills.technologiesAndFrameworks}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Tools & Platforms</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{RESUME_DATA.skills.toolsAndPlatforms}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Testing & Security</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{RESUME_DATA.skills.testingAndSecurity}</p>
                        </div>
                    </div>
                </section>

                {/* Education Section */}
                <section className="mb-10 p-4 bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-lg">
                    <h3 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Education</h3>
                    {RESUME_DATA.education.map((edu, index) => (
                         <div key={index} className="mb-4 last:mb-0">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</p>
                            <p className="text-md font-medium text-gray-700 dark:text-gray-300">{edu.institution}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period} | {edu.details}</p>
                        </div>
                    ))}
                </section>
                
                {/* Toggle Theme Button for Mobile */}
                <div className="fixed top-4 right-4 z-50">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-500/50 text-white backdrop-blur-sm"
                        aria-label="Toggle dark mode"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileView;