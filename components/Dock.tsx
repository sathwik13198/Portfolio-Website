import React from 'react';
import type { DockItem } from '../types';
import { DOCK_ITEMS } from '../constants';

interface DockProps {
  onIconClick: (item: DockItem) => void;
}

const Dock: React.FC<DockProps> = ({ onIconClick }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end h-24 space-x-2 p-2 bg-white/20 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-white/10 z-40">
      {DOCK_ITEMS.map((item) => (
        <div key={item.id} className="relative group flex flex-col items-center">
            <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-gray-800/90 text-white text-xs rounded-md backdrop-blur-sm">
                {item.title}
            </div>
          <button
            onClick={() => onIconClick(item)}
            className="w-16 h-16 transform transition-all duration-150 ease-in-out group-hover:scale-125 group-hover:-translate-y-3"
            aria-label={item.title}
          >
            <div className="w-full h-full flex items-center justify-center">
              {item.icon}
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dock;
