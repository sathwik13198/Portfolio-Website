import React, { useState, useEffect, useRef } from 'react';
import { IconApple, IconWifi, IconBattery, IconControlCenter } from './Icon';

interface MenuBarProps {
    toggleTheme: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ toggleTheme }) => {
  const [time, setTime] = useState(new Date());
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setIsViewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  
  const handleToggleTheme = (e: React.MouseEvent) => {
      e.preventDefault();
      toggleTheme();
      setIsViewMenuOpen(false);
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-7 bg-white/10 dark:bg-black/10 backdrop-blur-xl text-black dark:text-white text-sm flex items-center justify-between px-4 z-50 shadow-sm">
      <div className="flex items-center space-x-4">
        <IconApple />
        <span className="font-bold">Portfolio</span>
        <span>File</span>
        <span>Edit</span>
        <div className="relative" ref={viewMenuRef}>
            <button onClick={() => setIsViewMenuOpen(prev => !prev)}>View</button>
            {isViewMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-md shadow-lg border border-gray-300/20 dark:border-gray-700/20">
                  <button 
                    onMouseDown={handleToggleTheme} 
                    className="w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white rounded-md"
                  >
                    Toggle Dark Mode
                  </button>
              </div>
            )}
        </div>
        <span>Go</span>
        <span>Window</span>
        <span>Help</span>
      </div>
      <div className="flex items-center space-x-3">
        <IconControlCenter />
        <IconBattery />
        <IconWifi />
        <span className="pl-1">{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};

export default MenuBar;