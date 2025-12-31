# Sathwik Pentapati | Digital Experience Portfolio

An interactive, high-performance portfolio environment mimicking a high-end macOS-inspired desktop. This project leverages **Next.js 15**, **Three.js**, and **Google Gemini AI** to create a unique professional showcase.

---

## 💻 Local Machine Setup Guide

Follow these steps to get the project running on your local development environment.

### 1. System Prerequisites
- **Node.js**: Version `20.x` or higher (LTS recommended).
- **npm**: Version `10.x` or higher.
- **Git**: Installed and configured.
- **Hardware**: Dedicated GPU recommended for smooth 3D rendering (WebGL 2.0 support).

### 2. Obtain an API Key
The Terminal component uses an AI Assistant powered by Google Gemini.
1. Visit the [Google AI Studio](https://aistudio.google.com/).
2. Create a new API Key.
3. Keep this key safe; you will need it for the environment configuration.

### 3. Installation Steps

```bash
# Clone the repository
git clone https://github.com/sathwik13198/macos-portfolio.git

# Enter the project directory
cd macos-portfolio

# Install all dependencies
npm install
```

### 4. Environment Configuration
Create a file named `.env.local` in the root of the project:

```env
# Google Gemini API Key
API_KEY=your_actual_api_key_here
```

*Note: Do not commit this file to version control.*

### 5. Launch the Application

```bash
# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠 Project Structure & Logic

- **`App.tsx`**: Core logic for theme switching and device-responsive view selection.
- **`/components/Scene3D.tsx`**: The Three.js engine. Contains the "ScreenBot" model logic and interactive lighting.
- **`/components/DesktopView.tsx`**: The macOS-style windowing system. Handles z-index stacking, dragging, and minimizing.
- **`/components/ContentOverlay.tsx`**: The scroll-driven landing page experience (used for mobile or as a fallback).
- **`/components/Terminal.tsx`**: A functional CLI that acts as the primary interface for the Gemini AI.
- **`/services/geminiService.ts`**: Handles the prompt engineering and API communication with Google's LLM.

---

## ⌨️ Terminal Guide (Local Commands)

The terminal is not just for show—it is a functional interface. Try these commands:
- `chat`: Toggle the AI persona. Ask about Sathwik's experience at ISRO or Kritno.
- `help`: Lists all available system-level commands.
- `whoami`: Returns the guest user context.
- `date`: Pulls local system time.
- `clear`: Flushes the terminal buffer.
- `exit`: Returns to standard shell from AI chat mode.

---

## 🔧 Local Troubleshooting

### "Multiple instances of Three.js" Warning
If you see this in the browser console during local dev, ensure your `package.json` dependencies match exactly. The project uses `0.173.0` to maintain compatibility with the latest `@react-three/drei` features.

### "API Key Missing"
Ensure your `.env.local` file is in the root directory (not inside `src` or `app`). If you are running in a non-Next.js environment, the key must be passed via `process.env`.

### 3D Performance Lag
- Ensure **Hardware Acceleration** is enabled in your browser settings.
- If testing on a laptop, ensure the browser is using the Discrete GPU rather than the Integrated one.

---

## 🚢 Production Build
To prepare the site for a production environment:

```bash
# Generate optimized build
npm run build

# Preview the production build locally
npm run start
```

---

*Built with passion by Sathwik Pentapati.*