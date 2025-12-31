
import React from 'react';
import type { DockItem } from './types';
import { IconAbout, IconProjects, IconExperience, IconContact, IconTerminal } from './components/Icon';

export const THEME_COLORS = {
    primary: "#8b5cf6",
    secondary: "#c084fc",
    accent: "#4c1d95",
    background: "#050505"
};

export const RESUME_DATA = {
  name: "Sathwik Pentapati",
  title: "Software Engineer - Full Stack Developer",
  contact: {
    phone: "+91 9666713198",
    email: "sathwikpentapati@gmail.com",
    linkedin: "https://www.linkedin.com/in/sathwikpentapati/",
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
      period: "Feb 2024 - May 2025",
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
  skillCategories: [
    {
        title: "Languages",
        items: ["C", "Java", "Python", "HTML5", "JavaScript", "TypeScript"]
    },
    {
        title: "Tools & Platforms",
        items: ["Git", "AWS", "Docker", "Kubernetes", "AI-assisted coding", "Postman"]
    },
    {
        title: "Technologies & Frameworks",
        items: ["CSS", "React.js", "Next.js", "Redux", "Vue.js", "Express.js", "Node.js", "MongoDB", "SQL", "Socket.IO"]
    },
    {
        title: "Testing & Security",
        items: ["JWT", "OAuth", "Secure Coding (OWASP)", "Web Performance Optimization"]
    },
    {
        title: "Operating Systems",
        items: ["Windows", "Linux"]
    },
    {
        title: "Soft Skills",
        items: ["Communication", "Problem-solving", "Teamwork", "Adaptability", "Leadership"]
    }
  ],
  skills: {
    languages: "TypeScript, JavaScript, Python, Java, Go, C++, SQL",
    distributedSystems: "Node.js, Express.js, FastAPI, Redis (Caching), Apache Kafka, GraphQL, MongoDB, PostgreSQL",
    frontend: "React.js, Next.js, Redux, Tailwind CSS, Three.js, GSAP, Web Performance Optimization",
    devOps: "AWS, Docker, Kubernetes, Terraform, GitHub Actions (CI/CD), Prometheus, Grafana",
    aiAndSpecialized: "LangChain, Vector Databases (Pinecone), RAG Architecture, Google Gemini API, System Design, Microservices, JWT/OAuth, OWASP Security",
    softSkills: "Technical Leadership, Problem-solving, Adaptability, System Thinking"
  },
  achievements: [
    "HACK'NIGHT 2025 Finalist: Reached the finals in a national-level hackathon, showcasing innovative full-stack solutions.",
    "Certifications: Meta Back-End Developer Specialization, Java and Object-Oriented Programming, AWS Cloud Practitioner, IBM Linux.",
    "1st Prize - State-Level Badminton: Demonstrated discipline and competitiveness in state sports events."
  ]
};

export const PROJECTS_DATA = [
    {
        id: "cryptography",
        name: "Visual Cryptography System",
        tech: "Python, OpenCV, AES, NumPy",
        points: [
            "Implemented a visual cryptography scheme to split images into secure shares that reconstruct when stacked.",
            "Supported binary, grayscale, and colored image encryption with AES + pixel-level operations.",
            "Optimized performance using NumPy for matrix-based image transformations."
        ]
    },
    {
        id: "leetmate",
        name: "LeetMate AI Extension",
        tech: "React, Chrome APIs, Webpack, Gemini AI",
        points: [
            "Built a Manifest V3 Chrome extension generating code solutions and human-friendly explanations for LeetCode problems.",
            "Engineered context-aware prompt injection for sub-1s latency AI responses.",
            "Designed a floating overlay UI with React for seamless user interaction."
        ]
    },
    {
        id: "chatbot",
        name: "Modular Conversational Engine",
        tech: "Node.js, WebSockets, Python, NLP",
        points: [
            "Developed an integratable chatbot system handling stateful conversations and session management.",
            "Integrated custom NLP fallbacks for domain-specific query handling in offline environments.",
            "Built a lightweight SDK for embedding the engine into React and Vue frontends."
        ]
    },
    {
        id: "access",
        name: "Blend Access Helper",
        tech: "TypeScript, RBAC, Library Design",
        points: [
            "Created a centralized utility module for complex permission logic across distributed microservices.",
            "Reduced role-check boilerplate by 60% through a declarative access control architecture.",
            "Implemented high-performance caching for token-based permission lookups."
        ]
    },
    {
        id: "interview",
        name: "Interview Escaler",
        tech: "Next.js, PostgreSQL, Node.js",
        points: [
            "Built a full-stack platform for scaling mock interview preparations with feedback modules.",
            "Implemented real-time progress tracking and curated question banks for SDE-II level prep.",
            "Engineered a scalable backend capable of handling concurrent video-based mock sessions."
        ]
    },
    {
        id: "crowdconnect",
        name: "CrowdConnect",
        tech: "MERN Stack, Stripe API, Socket.IO",
        points: [
            "Developed a startup & creator platform where creators monetize content through exclusive gating.",
            "Integrated Stripe for multi-tier subscriptions and campaign funding management.",
            "Built real-time dashboard analytics for monitoring funding progress and audience engagement."
        ]
    },
    {
        id: "smartmeds",
        name: "Smart Meds AI Hospital",
        tech: "FastAPI, React, SQL, VADER NLP, LLM",
        points: [
            "Architected a medical platform for appointment scheduling and Adverse Drug Reaction tracking.",
            "Built an AI triage chatbot using NLP sentiment analysis to prioritize urgent medical cases.",
            "Secured medical records using JWT-based role-based access control for doctors and patients."
        ]
    },
    {
        id: "codeguardian",
        name: "CodeGuardian AI",
        tech: "React, TypeScript, Gemini API, Firebase, GitHub API",
        points: [
            "Built an AI-powered GitHub assistant to automate pull-request reviews, repository analysis, and merge-conflict resolution.",
            "Implemented intelligent PR diff analysis with structured review comments, caching results using Firestore to reduce API usage and latency.",
            "Engineered a repository chat experience with dynamic file exploration, syntax-highlighted code responses, and audio summaries for rapid codebase understanding."
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
