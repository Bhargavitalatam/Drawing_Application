import React from 'react';
import { X, Trash2, FolderOpen, Download, Calendar } from 'lucide-react';

const Gallery = ({ isOpen, onClose, drawings, onLoadDrawing, onDeleteDrawing, onExportDrawing }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        data-testid="gallery-drawer"
        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl z-50 flex flex-col transition-transform animate-slide-in-right"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold tracking-tight">Saved Sketches</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div data-testid="gallery-container" className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {drawings.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 gap-3">
              <FolderOpen className="w-12 h-12 opacity-30 stroke-[1.5]" />
              <p className="text-sm font-medium">No saved drawings yet</p>
              <p className="text-xs max-w-[200px]">Draw something and click the Save button to start your gallery!</p>
            </div>
          ) : (
            drawings.map((drawing, index) => (
              <div 
                key={drawing.id} 
                data-testid={`gallery-item-${index}`}
                onClick={() => onLoadDrawing(drawing)}
                className="group relative bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
              >
                {/* Thumbnail Preview container */}
                <div className="aspect-[4/3] bg-slate-950 flex items-center justify-center relative overflow-hidden border-b border-slate-900">
                  {drawing.thumbnailDataUrl ? (
                    <img 
                      src={drawing.thumbnailDataUrl} 
                      alt={drawing.name} 
                      className="w-full h-full object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-800 bg-slate-950">
                      Empty Canvas
                    </div>
                  )}

                  {/* Actions overlay on hover */}
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      data-testid="gallery-load-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadDrawing(drawing);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      Load Project
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportDrawing(drawing.thumbnailDataUrl, drawing.name);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-[40ms]"
                      title="Download PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      data-testid="gallery-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDrawing(drawing.id);
                      }}
                      className="p-2 bg-rose-950 hover:bg-rose-800 border border-rose-800/30 text-rose-300 hover:text-rose-100 rounded-lg shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-[80ms]"
                      title="Delete sketch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-3 bg-slate-900/60 flex justify-between items-center">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-xs font-bold text-slate-200 truncate">{drawing.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{new Date(drawing.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Gallery;
