
import React from 'react';
import type { DockItem } from './types';
import { IconAbout, IconProjects, IconExperience, IconContact, IconTerminal } from './components/Icon';

export const RESUME_DATA = {
  name: "Sathwik Pentapati",
  title: "Software Engineer - Full Stack Developer",
  contact: {
    phone: "+91 9666713198",
    email: "sathwikpentapati@gmail.com",
    linkedin: "https://www.linkedin.com/in/sathwikpentapati/",
    github: "https://github.com/sathwik13198/",
    leetcode: "https://leetcode.com/u/VPTDJzmOny/"
  },
  experience: [
    {
      company: "Kritno",
      role: "Software Engineer Intern",
      period: "Aug 2025 - Present",
      location: "Remote",
      points: [
        "Contributing to the development of an accessibility SaaS platform, improving inclusivity for users with diverse needs.",
        "Worked with React.js, Node.js, Docker, and PostgreSQL to build and optimize scalable microservices.",
        "Integrated authentication, API endpoints, and accessibility features, ensuring WCAG compliance.",
        "Collaborated with cross-functional teams in an agile setup, improving sprint delivery efficiency."
      ]
    },
    {
      company: "Falak Fest",
      role: "Technical Committee Member",
      period: "2024",
      location: "Bengaluru, India",
      points: [
        "Built and maintained the Falak fest website, managing registration for 500+ users with secure payment gateway integration.",
        "Collaborated in a team of 5 developers, reducing user-reported issues by 20% during the event.",
        "Ensured 99.9% uptime during high-traffic periods with quick resolution of bugs."
      ]
    }
  ],
  education: [
    {
      institution: "Manipal Institute of Technology (MIT) Bengaluru",
      degree: "B.Tech in Computer Science",
      period: "Aug 2023 - May 2027",
      details: "CGPA: 8.9"
    },
    {
      institution: "Narayana Junior College",
      degree: "Class XII (Intermediate)",
      period: "2021 - 2023",
      details: "Percentage: 97.9"
    },
    {
      institution: "Narayana Group of Schools",
      degree: "Class X (SSC)",
      period: "2020 - 2021",
      details: "Percentage: 96.00"
    }
  ],
  skills: {
    languages: "C, Java, Python, HTML5, JavaScript, TypeScript",
    toolsAndPlatforms: "Git, AWS, Docker, Kubernetes, AI-assisted coding, Postman",
    technologiesAndFrameworks: "CSS, React.js, Next.js, Redux, Vue.js, Express.js, Node.js, MongoDB, SQL, Socket.IO",
    testingAndSecurity: "JWT, OAuth, Secure Coding (OWASP), Web Performance Optimization",
    operatingSystems: "Windows, Linux",
    softSkills: "Communication, Problem-solving, Teamwork, Adaptability, Leadership"
  },
  achievements: [
    "HACK'NIGHT 2025 Finalist: Reached the finals in a national-level hackathon, showcasing innovative full-stack solutions.",
    "Certifications: Meta Back-End Developer Specialization, Java and Object-Oriented Programming, IBM Linux.",
    "1st Prize - State-Level Badminton: Demonstrated discipline and competitiveness in state sports events.",
    "NSS Volunteer: Coordinated and led large-scale events and technical workshops, improving team collaboration and participation."
  ]
};

export const PROJECTS_DATA = [
    {
        name: "Visual Cryptography System for Images",
        tech: "Python, OpenCV, cryptography libraries (AES etc.)",
        points: [
            "Implemented a visual cryptography scheme to split an image into shares such that stacking them reconstructs the original image.",
            "Supported multiple modes: binary, grayscale, colored image encryption / decryption.",
            "Employed AES + pixel-level operations to enhance security.",
            "Measured output quality using metrics like PSNR, SSIM, and compared decrypted vs original."
        ]
    },
    {
        name: "LeetMate (AI-Powered Coding Helper / Extension)",
        tech: "React.js, Chrome Extension APIs, Webpack (Manifest V3), AI / LLM APIs",
        points: [
            "Built a Chrome extension that, given a LeetCode problem, generates code solutions + explanations in multiple languages.",
            "Designed the UI in React, integrated with browser APIs for injection and context handling.",
            "Used AI / LLM (e.g. Gemini 2.5 Flash) to produce human-friendly explanations (with style, emojis, varied tone).",
            "Ensured performance & minimal overhead in the browser environment."
        ]
    },
    {
        name: "Integratable Chatbot / Conversational Engine",
        tech: "Python / Node.js, REST / WebSocket APIs, optional AI / NLP libraries",
        points: [
            "Developed a modular chatbot system that can be integrated into existing apps / websites.",
            "Handled authentication, session management, fallback responses & stateful conversation.",
            "Optionally integrated external AI / LLM backends or custom logic for domain-specific responses.",
            "Provided endpoints / SDK for embedding the chatbot into frontends."
        ]
    },
    {
        name: "Blend Access Helper",
        tech: "TypeScript / JavaScript, utility / helper library architecture",
        points: [
            "Created a helper / utility module to centralize access control / permission logic across services.",
            "Abstracted common patterns, reduced repetition, improved consistency in controlling user roles / capabilities.",
            "Distributed / packaged for reuse across multiple projects."
        ]
    },
    {
        name: "Interview Escaler / Interview Helper Platform",
        tech: "Full-stack (React / Node / DB stack)",
        points: [
            "Built a platform or tool to help users escalate or scale interview preparations.",
            "Features may include curated questions, mock interview, scheduling, feedback modules.",
            "Implemented backend APIs, frontend UI, and data persistence."
        ]
    },
    {
        name: "CrowdConnect (Startup & Creator Platform)",
        tech: "MongoDB, Express.js, React.js, Node.js, Stripe API",
        points: [
            "Developed a full MERN web app where startups can raise funds and creators can monetize exclusive content.",
            "Integrated Stripe for secure payments, subscription / campaign modules.",
            "Built features like user profiles, content gating, funding tracking, dashboard analytics."
        ]
    },
    {
        name: "Smart Meds (AI Hospital / Healthcare System)",
        tech: "React, FastAPI, SQL (PostgreSQL / MySQL), JWT Auth, NLP / Sentiment (VADER or similar), LLM / Chatbot integration",
        points: [
            "Developed a hospital / medical system platform with features like appointments, patient management, ADR (adverse drug reaction) tracking.",
            "Integrated AI / LLM chatbot for user queries, medical help, triaging.",
            "Implemented real-time ADR monitoring using sentiment / NLP techniques.",
            "Secure authentication & role-based access control (doctors, patients, admin)."
        ]
    }
];


export const DOCK_ITEMS: DockItem[] = [
  { id: 'about', title: 'About Me', icon: React.createElement(IconAbout) },
  { id: 'projects', title: 'Projects', icon: React.createElement(IconProjects) },
  { id: 'experience', title: 'Experience', icon: React.createElement(IconExperience) },
  { id: 'terminal', title: 'Terminal', icon: React.createElement(IconTerminal) },
  { id: 'contact', title: 'Contact', icon: React.createElement(IconContact) },
];