# Kea bird — local experiment

Local study of the bird on https://alexwang.ai/posts/reasoning-as-pathfinding/.

Open `/experiments/kea-bird/index.html` through the Stephen Daily dev server.
Use HTTP rather than opening the HTML as a local file: the renderer fetches JSON and uploads image textures.

## Contents

- `index.html`, `style.css`, `demo.js`: local demo and initialization.
- `kea3d.js`, `kea-body.js`: upstream WebGL2 renderers, downloaded 2026-11-13. Formatting and a vendor lint directive are the only local changes.
- `assets/body.json`: feather geometry metadata.
- `/assets/images/textures/kea-bird/`: the 10 original texture images shared with the React component.

Original script URLs: https://alexwang.ai/js/kea3d.js and https://alexwang.ai/js/kea-body.js.
Assets originate from https://alexwang.ai/images/kea/.

Artwork and renderer attribution remains with the original author. No reuse license was verified; this folder is an isolated local experiment, not an assertion of redistribution rights.

The page uses the original head/neck geometry, spring motion, blinking, and body-feather simulation. It respects reduced motion until explicitly enabled. It is intentionally standalone: upstream timers and global listeners live for the document lifetime; it is not yet a React component with unmount cleanup.
