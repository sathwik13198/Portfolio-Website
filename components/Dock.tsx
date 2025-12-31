
import React from 'react';
import type { DockItem, WindowProps } from '../types';
import { DOCK_ITEMS } from '../constants';

interface DockProps {
  onIconClick: (item: DockItem) => void;
  openWindows: WindowProps[];
}

const Dock: React.FC<DockProps> = ({ onIconClick, openWindows }) => {
  // Find minimized windows that aren't part of the standard DOCK_ITEMS
  // In our case, all windows come from DOCK_ITEMS, but we check specifically for minimized state.
  const minimizedWindows = openWindows.filter(w => w.isMinimized);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end h-20 px-4 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-white/10 z-40">
      <div className="flex items-end space-x-2 h-full">
        {DOCK_ITEMS.map((item) => {
          const isOpen = openWindows.some(w => w.id === item.id);
          const isMinimized = openWindows.some(w => w.id === item.id && w.isMinimized);

          return (
            <div key={item.id} className="relative group flex flex-col items-center">
              <div className="absolute bottom-full mb-4 hidden group-hover:block px-2 py-1 bg-gray-800/90 text-white text-xs rounded-md backdrop-blur-sm whitespace-nowrap">
                {item.title}
              </div>
              <button
                onClick={() => onIconClick(item)}
                className={`w-12 h-12 sm:w-14 sm:h-14 transform transition-all duration-150 ease-in-out group-hover:scale-125 group-hover:-translate-y-3 flex items-center justify-center ${isMinimized ? 'opacity-70 grayscale-[0.5]' : ''}`}
                aria-label={item.title}
              >
                {item.icon}
              </button>
              {isOpen && !isMinimized && (
                <div className="w-1 h-1 bg-gray-800 dark:bg-white rounded-full mt-1"></div>
              )}
            </div>
          );
        })}
      </div>

      {minimizedWindows.length > 0 && (
        <>
          <div className="w-px h-10 bg-gray-400/30 dark:bg-gray-600/30 mx-2 self-center"></div>
          <div className="flex items-end space-x-2 h-full">
            {minimizedWindows.map((win) => {
              // Get the icon from DOCK_ITEMS if it exists, otherwise use a generic one
              const dockItem = DOCK_ITEMS.find(item => item.id === win.id);
              if (!dockItem) return null;

              return (
                <div key={win.id} className="relative group flex flex-col items-center">
                   <div className="absolute bottom-full mb-4 hidden group-hover:block px-2 py-1 bg-gray-800/90 text-white text-xs rounded-md backdrop-blur-sm whitespace-nowrap">
                    {win.title} (Minimized)
                  </div>
                  <button
                    onClick={() => onIconClick({ id: win.id, title: win.title, icon: dockItem.icon })}
                    className="w-10 h-10 sm:w-12 sm:h-12 transform transition-all duration-150 ease-in-out group-hover:scale-125 group-hover:-translate-y-3 opacity-80 flex items-center justify-center"
                    aria-label={`Restore ${win.title}`}
                  >
                    <div className="scale-75">
                        {dockItem.icon}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Dock;
