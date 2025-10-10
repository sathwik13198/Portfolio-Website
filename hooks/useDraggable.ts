import { useState, useCallback, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Size {
    width: number;
    height: number;
}

export const useDraggable = (
  handleRef: React.RefObject<HTMLElement>,
  initialPosition: Position = { x: 0, y: 0 },
  size: Size
) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const isDragging = useRef(false);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const elementStartPos = useRef<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return; // Only allow left-click drag
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = position;
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    const menuBarHeight = 28; // Corresponds to h-7 in MenuBar.tsx

    let newX = elementStartPos.current.x + dx;
    let newY = elementStartPos.current.y + dy;

    // Clamp X position within viewport
    newX = Math.max(0, newX);
    newX = Math.min(window.innerWidth - size.width, newX);

    // Clamp Y position within viewport (below menu bar)
    newY = Math.max(menuBarHeight, newY);
    newY = Math.min(window.innerHeight - size.height, newY);

    setPosition({ x: newX, y: newY });
  }, [size.width, size.height]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const handleElement = handleRef.current;
    if (handleElement) {
      handleElement.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        handleElement.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleRef, handleMouseDown, handleMouseMove, handleMouseUp]);

  return position;
};