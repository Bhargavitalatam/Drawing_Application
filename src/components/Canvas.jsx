import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({
  canvasRef,
  tool,
  color,
  brushSize,
  brushOpacity,
  currentImage,
  onDrawingComplete
}) => {
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const startCoordsRef = useRef({ x: 0, y: 0 });
  const lastCoordsRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);

  // Initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();

      // Read current canvas contents to redraw after resize
      let tempImage = null;
      try {
        tempImage = canvas.toDataURL();
      } catch (e) {
        console.warn("Could not save canvas state for resize", e);
      }

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const context = canvas.getContext('2d');
      context.scale(dpr, dpr);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      contextRef.current = context;

      // Restore drawing content if it existed
      if (tempImage) {
        const img = new Image();
        img.src = tempImage;
        img.onload = () => {
          context.drawImage(img, 0, 0, rect.width, rect.height);
        };
      }
    };

    // Initial sizing
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync canvas contents when the history image state updates (Undo/Redo/Load)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    const context = contextRef.current;
    const rect = canvas.getBoundingClientRect();

    if (!currentImage) {
      // Clear canvas if history state is empty
      context.clearRect(0, 0, rect.width, rect.height);
      return;
    }

    const img = new Image();
    img.src = currentImage;
    img.onload = () => {
      context.clearRect(0, 0, rect.width, rect.height);
      context.drawImage(img, 0, 0, rect.width, rect.height);
    };
  }, [currentImage]);

  // Translate client event coordinates relative to the canvas bounding rect
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    // Prevent default scrolling on touch events
    if (e.cancelable) e.preventDefault();

    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const context = contextRef.current;

    // Apply active brush style parameters
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.globalAlpha = brushOpacity / 100;

    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
    } else {
      context.globalCompositeOperation = 'source-over';
    }

    setIsDrawing(true);
    startCoordsRef.current = coords;
    lastCoordsRef.current = coords;

    if (['line', 'rectangle', 'circle'].includes(tool)) {
      // Capture a snapshot of the raw backing store pixels for previews
      snapshotRef.current = context.getImageData(0, 0, canvas.width, canvas.height);
    } else {
      // Begin freehand pen or eraser line
      context.beginPath();
      context.moveTo(coords.x, coords.y);
      context.lineTo(coords.x, coords.y);
      context.stroke();
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    if (tool === 'pen' || tool === 'eraser') {
      context.beginPath();
      context.moveTo(lastCoordsRef.current.x, lastCoordsRef.current.y);
      context.lineTo(coords.x, coords.y);
      context.stroke();
      lastCoordsRef.current = coords;
    } else if (['line', 'rectangle', 'circle'].includes(tool) && snapshotRef.current) {
      // Restore the snapshot of backing pixels to clear the previous preview shape
      context.putImageData(snapshotRef.current, 0, 0);

      const start = startCoordsRef.current;
      context.beginPath();

      if (tool === 'line') {
        context.moveTo(start.x, start.y);
        context.lineTo(coords.x, coords.y);
      } else if (tool === 'rectangle') {
        const width = coords.x - start.x;
        const height = coords.y - start.y;
        context.rect(start.x, start.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(coords.x - start.x, 2) + Math.pow(coords.y - start.y, 2)
        );
        context.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      }

      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Draw final static shape if in shape mode
    if (['line', 'rectangle', 'circle'].includes(tool) && snapshotRef.current) {
      // Put final coordinates
      snapshotRef.current = null;
    } else {
      context.closePath();
    }

    // Capture the finished canvas state and notify parent App
    try {
      const dataUrl = canvas.toDataURL();
      onDrawingComplete(dataUrl);
    } catch (e) {
      console.error("Failed to export drawing completion", e);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      data-testid="drawing-canvas"
      data-test-id="drawing-canvas"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className="bg-white block rounded-xl shadow-xl shadow-black/45 border border-slate-800/20 max-w-full max-h-full cursor-crosshair transition-shadow duration-300"
    />
  );
};

export default Canvas;
