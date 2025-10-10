import React, { useRef, useState } from 'react';
import type { WindowProps } from '../types';
import { useDraggable } from '../hooks/useDraggable';

const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPosition,
  initialSize,
  zIndex,
  onClose,
  onFocus,
  isActive,
  isClosing
}) => {
  const handleRef = useRef<HTMLDivElement>(null);
  const position = useDraggable(handleRef, initialPosition);
  const [size, setSize] = useState(initialSize);

  // Note: Resizing logic is simplified for this MVP.
  
  return (
    <div
      id={id}
      className={`absolute flex flex-col bg-gray-200/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-lg border border-gray-300/50 dark:border-gray-700/50 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
        boxShadow: isActive ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
      }}
      onMouseDown={onFocus}
    >
      <div
        ref={handleRef}
        className={`flex items-center justify-between h-8 px-3 text-sm font-medium rounded-t-lg cursor-grab ${isActive ? 'bg-gray-300/50 dark:bg-gray-700/50' : 'bg-gray-400/30 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'}`}
      >
        <div className="flex items-center space-x-2">
          <button onClick={onClose} className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600" aria-label="Close"></button>
          <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600" aria-label="Minimize"></button>
          <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600" aria-label="Maximize"></button>
        </div>
        <span className="text-gray-800 dark:text-gray-200">{title}</span>
        <div className="w-12"></div> {/* Spacer */}
      </div>
      <div className="flex-grow overflow-hidden rounded-b-lg">
        {children}
      </div>
    </div>
  );
};

export default Window;
