import React from 'react';
import { RESUME_DATA, PROJECTS_DATA } from '../constants';

const ResumeContent: React.FC = () => {
    return (
        <div className="bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-200 h-full overflow-y-auto p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 pb-2 border-b-2 border-gray-200 dark:border-gray-700">{RESUME_DATA.name}</h1>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-4">{RESUME_DATA.title}</h2>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 justify-start text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        <span><a href={`mailto:${RESUME_DATA.contact.email}`} className="hover:underline text-blue-600 dark:text-blue-400">{RESUME_DATA.contact.email}</a></span>
                        <span>{RESUME_DATA.contact.phone}</span>
                        <span><a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">LinkedIn</a></span>
                        <span><a href={RESUME_DATA.contact.github} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">GitHub</a></span>
                        <span><a href={RESUME_DATA.contact.leetcode} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">LeetCode</a></span>
                    </div>
                </header>

                <section className="mb-8">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Professional Experience</h3>
                    {RESUME_DATA.experience.map((exp, index) => (
                        <div key={index} className="mb-6">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{exp.role}</p>
                            <p className="text-md font-medium text-gray-700 dark:text-gray-300">{exp.company}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{exp.period} | {exp.location}</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                {exp.points.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                <section className="mb-8">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Education</h3>
                    {RESUME_DATA.education.map((edu, index) => (
                         <div key={index} className="mb-4">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</p>
                            <p className="text-md font-medium text-gray-700 dark:text-gray-300">{edu.institution}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period} | {edu.details}</p>
                        </div>
                    ))}
                </section>
                
                <section className="mb-8">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Languages</h4>
                            <p className="text-gray-600 dark:text-gray-300">{RESUME_DATA.skills.languages}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Technologies & Frameworks</h4>
                            <p className="text-gray-600 dark:text-gray-300">{RESUME_DATA.skills.technologiesAndFrameworks}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Tools & Platforms</h4>
                            <p className="text-gray-600 dark:text-gray-300">{RESUME_DATA.skills.toolsAndPlatforms}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Testing & Security</h4>
                            <p className="text-gray-600 dark:text-gray-300">{RESUME_DATA.skills.testingAndSecurity}</p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Projects</h3>
                    {PROJECTS_DATA.map((project, index) => (
                        <div key={index} className="mb-6">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</p>
                            <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-2">{project.tech}</p>
                             <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                {project.points.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                <section>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Achievements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        {RESUME_DATA.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default ResumeContent;
