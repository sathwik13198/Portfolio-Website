
import React from 'react';
import type { DockItem } from './types';
import { IconAbout, IconProjects, IconExperience, IconContact, IconTerminal } from './components/Icon';

export const RESUME_DATA = {
  name: "Sathwik Pentapati",
  title: "Software Engineer - Full Stack Developer",
  contact: {
    phone: "+91 9666713198",
    email: "sathwikpentapati@gmail.com",
    linkedin: "https://www.linkedin.com/in/sathwik-pentapati/",
    github: "https://github.com/sathwik13198",
    leetcode: "https://leetcode.com/u/VPTDJzmOny/"
  },
  experience: [
    {
      company: "Indian Space Research Organisation (ISRO)",
      role: "Research and Software Development Intern",
      period: "Dec 2025 - Present",
      location: "Hyderabad, India",
      points: [
        "Developing an Android-based secure communication and monitoring application for mission-critical systems using Kotlin and Jetpack Compose.",
        "Implementing real-time location tracking, MQTT-based messaging, and offline-first architecture to ensure reliability in low-connectivity environments.",
        "Integrating SIP-based voice calling and optimized media handling for low-latency communication across distributed systems.",
        "Working closely with scientists and engineers to translate operational requirements into scalable software modules."
      ]
    },
    {
      company: "Kritno",
      role: "Software Engineer Intern",
      period: "Aug 2025 - Dec 2025",
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
    toolsAndPlatforms: "Git, AWS, Docker, Kubernetes, Postman, AI-assisted coding",
    technologiesAndFrameworks: "React.js, Next.js, Redux, Vue.js, Express.js, Node.js, MongoDB, SQL, Socket.IO, FastAPI",
    testingAndSecurity: "JWT, OAuth, OWASP, Web Performance Optimization",
    operatingSystems: "Windows, Linux",
    softSkills: "Communication, Problem-solving, Teamwork, Adaptability, Leadership"
  },
  achievements: [
    "HACK'NIGHT 2025 Finalist: Reached the finals in a national-level hackathon, showcasing innovative full-stack solutions.",
    "Certifications: Meta Back-End Developer Specialization, Java and Object-Oriented Programming, AWS Cloud Practitioner, IBM Linux.",
    "1st Prize - State-Level Badminton: Demonstrated discipline and competitiveness in state sports events.",
    "NSS Volunteer: Coordinated and led large-scale events and technical workshops."
  ]
};

export const PROJECTS_DATA = [
    {
        name: "CodeGuardian AI",
        tech: "React, TypeScript, Google Gemini API, GitHub REST API, Firebase Firestore, Tailwind CSS",
        points: [
            "Built an AI-driven code analysis platform to automate PR reviews with security and performance insights.",
            "Engineered a \"Chat with Repo\" LLM interface using tool-calling and RAG-style queries."
        ]
    },
    {
        name: "Smart Meds (AI Hospital System)",
        tech: "React, FastAPI, PostgreSQL, JWT Authentication, VADER NLP, OpenAI GPT-4 API",
        points: [
            "Developed an AI-powered hospital management system featuring a GPT-4 medical chatbot, automated appointment scheduling, and real-time ADR monitoring.",
            "Built scalable FastAPI + PostgreSQL backend services optimized for high-traffic medical workflows.",
            "Implemented role-based access control for doctors, patients, and administrators."
        ]
    },
    {
        name: "LeetMate (AI-Powered Coding Helper)",
        tech: "React.js, Chrome Extension APIs, Webpack, Gemini 2.5 Flash API, Prism.js, Manifest V3",
        points: [
            "Developed a Chrome extension that generates AI-powered solutions for LeetCode problems with emoji-rich explanations.",
            "Integrated Gemini 2.5 Flash API to provide real-time, multi-language solutions.",
            "Designed the UI in React, integrated with browser APIs for injection and context handling."
        ]
    },
    {
        name: "CrowdConnect (Startup & Creator Platform)",
        tech: "MongoDB, Express.js, React.js, Node.js, Stripe API",
        points: [
            "Developed a full MERN web app where startups can raise funds and creators can monetize exclusive content.",
            "Integrated Stripe for secure payments, subscription/campaign modules, and built user profiles with dashboard analytics.",
            "Implemented content gating and funding tracking modules."
        ]
    },
    {
        name: "Visual Cryptography System for Images",
        tech: "Python, OpenCV, AES, Cryptography libraries",
        points: [
            "Implemented a visual cryptography scheme to split an image into shares such that stacking them reconstructs the original image.",
            "Supported multiple modes: binary, grayscale, colored image encryption/decryption.",
            "Employed AES + pixel-level operations to enhance security and measured quality using PSNR and SSIM."
        ]
    },
    {
        name: "Integratable Chatbot Engine",
        tech: "Python, Node.js, REST/WebSocket APIs, AI/NLP libraries",
        points: [
            "Developed a modular chatbot system that can be integrated into existing apps/websites.",
            "Handled authentication, session management, fallback responses, and stateful conversation flow.",
            "Provided endpoints and SDK for seamless embedding into frontend applications."
        ]
    },
    {
        name: "Blend Access Helper",
        tech: "TypeScript, JavaScript, Utility Library Architecture",
        points: [
            "Created a helper/utility module to centralize access control and permission logic across multiple services.",
            "Abstracted common patterns to reduce repetition and improve consistency in controlling user capabilities.",
            "Designed as a distributed package for reuse across various enterprise-level projects."
        ]
    },
    {
        name: "Interview Escaler Platform",
        tech: "React, Node.js, PostgreSQL, Socket.IO",
        points: [
            "Built a full-stack platform to help users escalate or scale their interview preparations.",
            "Features included curated questions, mock interview modules, scheduling, and real-time feedback systems.",
            "Implemented backend APIs, responsive UI, and robust data persistence."
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
