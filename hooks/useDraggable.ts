
import { useState, useCallback, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useDraggable = (
  handleRef: React.RefObject<HTMLElement>,
  initialPosition: Position = { x: 0, y: 0 }
) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const isDragging = useRef(false);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const elementStartPos = useRef<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = position;
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    setPosition({
      x: elementStartPos.current.x + dx,
      y: elementStartPos.current.y + dy
    });
  }, []);

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
