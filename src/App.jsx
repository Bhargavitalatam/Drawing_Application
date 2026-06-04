import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import Gallery from './components/Gallery';
import Toast from './components/Toast';
import { Save, X } from 'lucide-react';

function App() {
  // Brush and tool state
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#3b82f6'); // Default to modern blue
  const [brushSize, setBrushSize] = useState(8);
  const [brushOpacity, setBrushOpacity] = useState(100);

  // Canvas history state for Undo/Redo
  const [history, setHistory] = useState([null]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Gallery drawer and database state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [drawings, setDrawings] = useState(() => {
    const saved = localStorage.getItem('savedDrawings');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal and toast states
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [newSketchName, setNewSketchName] = useState('');
  const [toast, setToast] = useState(null);

  // Shared ref for canvas node
  const canvasRef = useRef(null);

  // Helper to trigger micro-toast messages
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Canvas completion handler (triggered when user finishes a stroke or shape)
  const handleDrawingComplete = (dataUrl) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, dataUrl]);
    setHistoryIndex(nextHistory.length);
  };

  // Action callbacks
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      showToast('Undo performed', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      showToast('Redo performed', 'info');
    }
  };

  const handleClear = () => {
    // If the canvas is already empty, do nothing
    if (history[historyIndex] === null) {
      showToast('Canvas is already clear', 'info');
      return;
    }
    // Push a null state onto the history stack to make the clear operation undoable
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, null]);
    setHistoryIndex(nextHistory.length);
    showToast('Canvas cleared (you can Undo this)', 'info');
  };

  const handleSaveClick = () => {
    // Check if the current canvas has any content to save
    if (history[historyIndex] === null && (!canvasRef.current || canvasRef.current.getContext('2d').getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data.every(val => val === 0))) {
      showToast('Cannot save an empty sketch', 'error');
      return;
    }
    setNewSketchName('');
    setSaveModalOpen(true);
  };

  const handleSaveConfirm = (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const sketchName = newSketchName.trim() || `Sketch #${drawings.length + 1}`;

      const newDrawing = {
        id: Date.now().toString(),
        name: sketchName,
        thumbnailDataUrl: dataUrl,
        timestamp: new Date().toISOString()
      };

      const updatedDrawings = [newDrawing, ...drawings];
      setDrawings(updatedDrawings);
      localStorage.setItem('savedDrawings', JSON.stringify(updatedDrawings));
      
      setSaveModalOpen(false);
      setNewSketchName('');
      showToast(`Saved "${sketchName}" successfully!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save drawing', 'error');
    }
  };

  const handleExport = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      
      // Check if canvas is completely empty/transparent
      const ctx = canvasRef.current.getContext('2d');
      const buffer = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const isEmpty = buffer.data.every(pixel => pixel === 0);

      if (isEmpty && history[historyIndex] === null) {
        showToast('Cannot export an empty canvas', 'error');
        return;
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `sketch-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Drawing exported as PNG!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Export failed', 'error');
    }
  };

  const handleExportSavedDrawing = (dataUrl, name) => {
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported "${name}" as PNG!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export saved sketch', 'error');
    }
  };

  const handleLoadDrawing = (drawing) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, drawing.thumbnailDataUrl]);
    setHistoryIndex(nextHistory.length);
    setGalleryOpen(false);
    showToast(`Loaded sketch "${drawing.name}"`, 'success');
  };

  const handleDeleteDrawing = (id) => {
    const updatedDrawings = drawings.filter(d => d.id !== id);
    setDrawings(updatedDrawings);
    localStorage.setItem('savedDrawings', JSON.stringify(updatedDrawings));
    showToast('Sketch deleted from gallery', 'info');
  };

  // Keyboard Shortcuts (Ctrl+Z: Undo, Ctrl+Y: Redo, Ctrl+S: Save)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (historyIndex > 0) {
          setHistoryIndex((prev) => prev - 1);
          showToast('Undo performed', 'info');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          setHistoryIndex((prev) => prev + 1);
          showToast('Redo performed', 'info');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, drawings.length]);

  // Expose window.getCanvasDataURL for automated test suite verification
  useEffect(() => {
    window.getCanvasDataURL = () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL('image/png');
      }
      return '';
    };
    return () => {
      delete window.getCanvasDataURL;
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Toolbar controls */}
      <Toolbar
        activeTool={tool}
        setActiveTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        brushOpacity={brushOpacity}
        setBrushOpacity={setBrushOpacity}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSaveClick}
        onExport={handleExport}
        onToggleGallery={() => setGalleryOpen(!galleryOpen)}
        drawingsCount={drawings.length}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* Main Canvas Drawing Workspace */}
      <main className="flex-grow flex items-center justify-center p-6 sm:p-8 checkerboard-bg relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center relative max-w-6xl max-h-[75vh]">
          <Canvas
            canvasRef={canvasRef}
            tool={tool}
            color={color}
            brushSize={brushSize}
            brushOpacity={brushOpacity}
            currentImage={history[historyIndex]}
            onDrawingComplete={handleDrawingComplete}
          />
        </div>
      </main>

      {/* Gallery drawer sidebar */}
      <Gallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        drawings={drawings}
        onLoadDrawing={handleLoadDrawing}
        onDeleteDrawing={handleDeleteDrawing}
        onExportDrawing={handleExportSavedDrawing}
      />

      {/* Premium Save Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-slide-in flex flex-col gap-4 text-slate-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Save className="w-5 h-5" />
                </div>
                <h3 className="text-md font-bold text-white">Save Masterpiece</h3>
              </div>
              <button 
                onClick={() => setSaveModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfirm} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sketch-name" className="text-xs font-semibold text-slate-400">
                  Sketch Name
                </label>
                <input
                  id="sketch-name"
                  type="text"
                  placeholder={`Sketch #${drawings.length + 1}`}
                  value={newSketchName}
                  onChange={(e) => setNewSketchName(e.target.value)}
                  maxLength={30}
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3.5 mt-2">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/15 transition-all"
                >
                  Save Sketch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Micro Toast Alerts */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
