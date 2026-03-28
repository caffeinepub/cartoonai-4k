# VideoAI 4K - Cartoon Converter

## Current State
No existing source files. Fresh build.

## Requested Changes (Diff)

### Add
- Video upload area with drag-and-drop
- Embedded video player that always shows the video (original and cartoon preview side by side)
- Cartoon style selector (Anime, Comic Book, Watercolor, Pixar 3D, Classic Cartoon)
- Enhancement controls (sharpness, contrast, saturation, color boost)
- Real-time CSS filter-based cartoon preview applied to the video element
- Convert button that applies the selected style
- Before/after split-view with draggable divider
- Download button for the processed video
- A sample/demo video pre-loaded so the page always has a video present

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: minimal actor (no backend logic needed for browser-based processing)
2. Frontend:
   - Hero section with app branding
   - Upload zone + sample video pre-loaded by default
   - Two video elements side-by-side: original and cartoon-filtered
   - CSS filter combinations per cartoon style (hue-rotate, saturate, contrast, sepia, brightness)
   - Sliders for fine-tuning filters
   - Draggable split-view divider overlay
   - Download button using canvas capture or direct link
