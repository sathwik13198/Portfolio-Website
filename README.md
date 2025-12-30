# Sathwik Pentapati | Digital Experience Portfolio

An interactive, high-performance portfolio environment designed to showcase the intersection of engineering and digital aesthetics. Built with a "macOS-meets-Cyberpunk" aesthetic, featuring a 3D generative background, dynamic theme system, and an AI-powered terminal interface.

## 🚀 Core Features

- **macOS Desktop Interface**: Functional dock, draggable/resizable windows, and a global menu bar.
- **AI Terminal Chatbot**: Integrated Google Gemini API (gemini-3-flash-preview) that acts as a technical assistant, answering questions specifically based on the resume data.
- **Dynamic 3D Environment**: Generative 3D core (Three.js/Fiber) that responds to scroll depth, mouse position, and active theme colors.
- **Theming System**: 5 distinct environment presets (Violet, Crimson, Emerald, Amber, Monochrome) with global CSS variable synchronization.
- **Responsive Architecture**: Seamlessly transitions between a desktop "OS" experience and a high-fidelity mobile-optimized scrolling journey.
- **GSAP Animations**: Precision-timed scroll triggers, magnetic UI elements, and complex layout transitions.

## 🛠 Tech Stack

- **Framework**: React.js / Next.js
- **3D Engine**: Three.js & @react-three/fiber / @react-three/drei
- **Animation**: GSAP (GreenSock) & GSAP ScrollTrigger
- **Intelligence**: @google/genai (Gemini API)
- **Styling**: Tailwind CSS & CSS Variables
- **Icons**: Custom SVG icons & Lucide-inspired glyphs

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (LTS recommended).

### 2. Installation
Clone the project and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
API_KEY=your_gemini_api_key_here
```
*Note: You can obtain an API key from [Google AI Studio](https://aistudio.google.com/).*

### 4. Running the Project
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `components/`: Modular UI components (3D Scene, Dock, Windows, Terminal).
- `hooks/`: Custom React hooks for dragging, resizing, and media queries.
- `services/`: API integration services (Gemini, GitHub).
- `constants.ts`: Source of truth for resume data and project details.
- `index.tsx`: Application entry point.

## ⌨️ Terminal Commands

The terminal is not just for show! Open it and try:
- `chat`: Initiates the AI conversation mode.
- `whoami`: Basic system identification.
- `clear`: Purges the terminal buffer.
- `help`: Lists all available system protocols.

---
*Built with precision and passion by Sathwik Pentapati.*