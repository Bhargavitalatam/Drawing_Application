# Antigravity Draw - Premium Interactive Drawing Canvas Sandbox

An interactive, responsive, and browser-based drawing application built using **React 19**, **Vite 8**, **Tailwind CSS v4**, and the HTML5 **Canvas API**.

This project provides a robust, digital sketchpad complete with shape previews, custom opacity, a local storage gallery, micro-alert notifications, and support for high-DPI (Retina) screens.

---

## Key Features

1. **Diverse Drawing Toolkit**
   - **Pen**: Freehand sketching.
   - **Eraser**: Resets pixels to transparent cleanly (uses canvas `destination-out` blending).
   - **Line Tool**: Straight lines with real-time drag preview.
   - **Rectangle Tool**: Hollow box shapes with real-time drag preview.
   - **Circle Tool**: Bounding circle shapes with real-time drag preview.

2. **Custom Brush Styles**
   - Color picker with standard and preset aesthetic swatches.
   - Size slider: Controls line width from `1px` to `50px` with a live visual scale indicator.
   - Opacity slider: Controls transparency (`globalAlpha` from `1%` to `100%`).

3. **Drawing History (Undo/Redo/Clear)**
   - Unlimited history stack (up to memory availability, capped locally for speed).
   - Undo/Redo actions with simple UI buttons or global keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`).
   - Clear Canvas button that resets the canvas (which itself is undoable, preventing accidental drawing loss).

4. **Sketches Gallery (Local Storage)**
   - Save drawings directly to the browser's Local Storage under `canvas_drawings`.
   - Beautiful gallery drawer displaying saved drawings with name, date, and visual thumbnail.
   - Direct Load, Delete, or Export actions inside the gallery view.

5. **PNG Image Export**
   - Download drawings directly to your local system as PNG files.

6. **System-wide Keyboard Shortcuts**
   - `Ctrl+Z` (or `Cmd+Z`): Undo
   - `Ctrl+Y` (or `Cmd+Y`): Redo
   - `Ctrl+S` (or `Cmd+S`): Save Drawing Modal

---

## Technical Stack & Layout

- **Vite 8 + React 19**
- **Tailwind CSS v4** with the `@tailwindcss/vite` compiler plugin.
- **Lucide React** for high-quality SVG vector icons.
- **HTML5 Canvas 2D Context API** with responsive offscreen buffers to prevent drawing loss on screen resizing.

---

## Setup Instructions

### Prerequisites
- Node.js (version 18 or above recommended)
- npm (version 9 or above)

### 1. Installation
Clone the repository, navigate to the folder, and install package dependencies:
```bash
npm install
```

### 2. Run the Development Server
Launch the local dev server using:
```bash
npm run dev
```
Open your browser and navigate to the output URL (usually `http://localhost:5173`).

### 3. Build for Production
Generate the optimized build artifacts in the `dist` directory:
```bash
npm run build
```

### 4. Preview the Build
Run the production bundle locally for evaluation:
```bash
npm run preview
```

---

## Testing & Quality Control

### Data Test IDs
Interactive controls are tagged with unique `data-testid` attributes to support automated end-to-end and integration testing:
- Canvas element: `data-testid="drawing-canvas"`
- Gallery Drawer: `data-testid="gallery-drawer"`, Gallery Container: `data-testid="gallery-container"`
- Gallery Item: `data-testid="gallery-item-0"` (indexed dynamically per card)
- Tool buttons: `data-testid="tool-pen"`, `data-testid="tool-eraser"`, `data-testid="tool-line"`, `data-testid="tool-rectangle"`, `data-testid="tool-circle"`
- Range inputs: `data-testid="brush-size-slider"`, `data-testid="color-picker"`
- System action triggers: `data-testid="undo-button"`, `data-testid="btn-redo"`, `data-testid="clear-canvas-button"`, `data-testid="btn-save"`, `data-testid="export-png-button"`, `data-testid="btn-gallery"`
