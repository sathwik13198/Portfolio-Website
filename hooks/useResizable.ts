import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Size {
  width: number;
  height: number;
}

interface Options {
    minWidth?: number;
    minHeight?: number;
}

export const useResizable = (
  handleRef: React.RefObject<HTMLElement>,
  initialSize: Size,
  options: Options = {}
) => {
  const { minWidth = 400, minHeight = 300 } = options;
  const [size, setSize] = useState<Size>(initialSize);
  const isResizing = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartSize = useRef<Size>({ width: 0, height: 0 });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.stopPropagation(); // Prevent triggering window drag
    isResizing.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartSize.current = size;
  }, [size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    const newWidth = Math.max(minWidth, elementStartSize.current.width + dx);
    const newHeight = Math.max(minHeight, elementStartSize.current.height + dy);

    setSize({ width: newWidth, height: newHeight });
  }, [minWidth, minHeight]);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
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

  return size;
};
