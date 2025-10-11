import React, { useState, useEffect } from 'react';
import DesktopView from './components/DesktopView';
import MobileView from './components/MobileView';
import { useMediaQuery } from './hooks/useMediaQuery';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const savedTheme = window.localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <main className={`w-screen ${isDesktop ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-gray-200 dark:bg-[#0d1117] transition-colors duration-300`}>
      {isDesktop ? (
        <DesktopView toggleTheme={toggleTheme} />
      ) : (
        <MobileView toggleTheme={toggleTheme} />
      )}
    </main>
  );
};

export default App;