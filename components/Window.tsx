
import React, { useRef } from 'react';
import type { WindowProps } from '../types';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';

const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPosition,
  initialSize,
  zIndex,
  onClose,
  onMinimize,
  onFocus,
  isActive,
  isMinimized,
  isClosing
}) => {
  const handleRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Use the new useResizable hook to manage window size
  const size = useResizable(resizeHandleRef, initialSize, { minWidth: 400, minHeight: 300 });
  
  // The useDraggable hook now receives the dynamic size to correctly clamp the window position
  const position = useDraggable(handleRef, initialPosition, size);

  if (isMinimized) return null;

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
          <button onClick={onMinimize} className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600" aria-label="Minimize"></button>
          <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600" aria-label="Maximize"></button>
        </div>
        <span className="text-gray-800 dark:text-gray-200">{title}</span>
        <div className="w-12"></div> {/* Spacer */}
      </div>
      <div className="flex-grow overflow-hidden rounded-b-lg">
        {children}
      </div>
      {/* Resizing handle */}
      <div
        ref={resizeHandleRef}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        aria-label="Resize window"
      />
    </div>
  );
};

export default Window;
