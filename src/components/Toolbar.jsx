import React from 'react';
import { 
  PenTool, 
  Eraser, 
  Minus, 
  Square, 
  Circle, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Save, 
  Download, 
  FolderHeart,
  Sliders
} from 'lucide-react';

const PRESET_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#64748b', // Slate
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
];

const Toolbar = ({
  activeTool,
  setActiveTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  brushOpacity,
  setBrushOpacity,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onExport,
  onToggleGallery,
  drawingsCount,
  canUndo,
  canRedo
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 flex flex-wrap gap-6 items-center justify-between shadow-md z-30">
      
      {/* Brand Logo & Gallery Trigger */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-extrabold text-white text-lg tracking-wider">A</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-none text-white">Antigravity Draw</h1>
            <p className="text-[10px] text-slate-400 mt-1">Canvas Playground</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Gallery button */}
        <button
          data-testid="btn-gallery"
          onClick={onToggleGallery}
          className="relative flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-xs font-semibold text-slate-300 hover:text-indigo-200 transition-all duration-300 group"
          title="Open saved sketches gallery"
        >
          <FolderHeart className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Gallery</span>
          {drawingsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[9px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
              {drawingsCount}
            </span>
          )}
        </button>
      </div>

      {/* Main Drawing Tools group */}
      <div className="flex items-center gap-1 bg-slate-950/40 p-1.5 rounded-xl border border-slate-800/80">
        {[
          { id: 'pen', icon: PenTool, label: 'Pen Tool', testId: 'tool-pen' },
          { id: 'eraser', icon: Eraser, label: 'Eraser', testId: 'tool-eraser' },
          { id: 'line', icon: Minus, label: 'Line Shape', testId: 'tool-line' },
          { id: 'rectangle', icon: Square, label: 'Rectangle Shape', testId: 'tool-rectangle' },
          { id: 'circle', icon: Circle, label: 'Circle Shape', testId: 'tool-circle' },
        ].map((tool) => {
          const IconComponent = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              data-testid={tool.testId}
              data-test-id={tool.testId}
              onClick={() => setActiveTool(tool.id)}
              className={`p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center relative group ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={tool.label}
            >
              <IconComponent className="w-4 h-4" />
              {/* Tooltip */}
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-800 z-40">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Styling controls (Color Picker, Sliders) */}
      <div className="flex flex-wrap items-center gap-5">
        
        {/* Colors Selection */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <input
              type="color"
              data-testid="color-picker"
              data-test-id="color-picker"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-9 h-9 rounded-xl border border-slate-700 bg-transparent cursor-pointer overflow-hidden p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
              title="Custom Color Picker"
            />
            {/* Custom Tooltip */}
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-800 z-40">
              Color Picker
            </span>
          </div>

          {/* Palette preset grid */}
          <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 bg-slate-950/20 p-1.5 rounded-xl border border-slate-800">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                  color.toLowerCase() === c.toLowerCase()
                    ? 'border-white scale-125 ring-2 ring-indigo-500/30'
                    : 'border-slate-800 hover:scale-110 hover:border-slate-400'
                }`}
                style={{ backgroundColor: c }}
                title={`Select ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden lg:block" />

        {/* Sliders for Brush Properties */}
        <div className="flex items-center gap-6 bg-slate-950/25 px-4 py-2 border border-slate-800/80 rounded-xl">
          {/* Size */}
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400">Brush Size: {brushSize}px</span>
              <input
                type="range"
                data-testid="brush-size-slider"
                data-test-id="brush-size-slider"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-24 sm:w-28 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
              />
            </div>
            {/* Visual Brush Size Preview */}
            <div className="w-6 h-6 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-md">
              <div 
                className="rounded-full transition-all bg-slate-100" 
                style={{ 
                  width: `${Math.min(brushSize, 20)}px`, 
                  height: `${Math.min(brushSize, 20)}px`,
                  backgroundColor: color,
                  opacity: brushOpacity / 100 
                }} 
              />
            </div>
          </div>

          <div className="w-px h-5 bg-slate-800" />

          {/* Opacity */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400">Opacity: {brushOpacity}%</span>
            <input
              type="range"
              min="1"
              max="100"
              value={brushOpacity}
              onChange={(e) => setBrushOpacity(parseInt(e.target.value))}
              className="w-20 sm:w-24 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons (Undo, Redo, Clear, Save, Export) */}
      <div className="flex items-center gap-2">
        <button
          data-testid="undo-button"
          data-test-id="undo-button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2.5 rounded-xl border border-slate-800 bg-slate-900 transition-colors relative group ${
            canUndo ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700' : 'text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Undo action (Ctrl+Z)"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-800 z-40">
            Undo
          </span>
        </button>

        <button
          data-testid="btn-redo"
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2.5 rounded-xl border border-slate-800 bg-slate-900 transition-colors relative group ${
            canRedo ? 'text-slate-200 hover:bg-slate-800 hover:border-slate-700' : 'text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Redo action (Ctrl+Y)"
        >
          <RotateCw className="w-4 h-4" />
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-800 z-40">
            Redo
          </span>
        </button>

        <button
          data-testid="clear-canvas-button"
          data-test-id="clear-canvas-button"
          onClick={onClear}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-rose-950/40 hover:border-rose-900/60 hover:text-rose-200 text-slate-300 transition-colors relative group"
          title="Clear Entire Canvas"
        >
          <Trash2 className="w-4 h-4" />
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-800 z-40">
            Clear Canvas
          </span>
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1" />

        <button
          data-testid="save-storage-button"
          data-test-id="save-storage-button"
          onClick={onSave}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-950/40 border border-slate-700/50 hover:border-indigo-500/40 text-slate-200 hover:text-indigo-200 font-semibold text-xs flex items-center gap-1.5 transition-all duration-300 relative group"
          title="Save drawing to local storage gallery"
        >
          <Save className="w-4 h-4 text-indigo-400 group-hover:scale-105" />
          <span className="hidden sm:inline">Save</span>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-800 z-40">
            Save Drawing
          </span>
        </button>

        <button
          data-testid="export-png-button"
          data-test-id="export-png-button"
          onClick={onExport}
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all duration-300 shadow-md shadow-indigo-600/10 relative group"
          title="Export Canvas as PNG image"
        >
          <Download className="w-4 h-4 group-hover:translate-y-[1px]" />
          <span className="hidden sm:inline">Export</span>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-800 z-40">
            Export PNG
          </span>
        </button>
      </div>
    </header>
  );
};

export default Toolbar;
