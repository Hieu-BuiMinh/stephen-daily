# KeaBird

React integration of Alex Wang's kea artwork and WebGL2 renderers.
Original source and asset attribution: `public/experiments/kea-bird/README.md`.

The original renderers are adapted into local modules with a shared lifecycle scope. Unmount removes event listeners, animation frames, timers, IntersectionObservers, canvases, and WebGL contexts. Asynchronous loads check disposal before uploading textures. The original standalone demo remains unchanged.

The 500px square shrinks to fit its parent. Clicking the image or pressing Enter/Space ruffles the feathers. Reduced-motion preferences retain the still painting. A scalloped postage-stamp frame keeps the original #f5f3ee paper in both themes; both WebGL renderers use the same fixed paper color.
