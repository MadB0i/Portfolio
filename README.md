# Portfolio

**[→ View the live site](https://madb0i.github.io/Portfolio/)**

Personal portfolio for Rupjyoti Talukdar ([@MadB0i](https://github.com/MadB0i)) — an independent developer building security and systems tooling. Amber Noir theme, 3D futuristic depth, cinematic motion throughout.

## What's on it

- **Preloader** — a 0→100 verification count with curtain-wipe reveal into the hero. Shows once per session, skippable, and respects `prefers-reduced-motion`.
- **Hero** — masked-line title reveal, hero status panel with interactive line-art cat, live GitHub stats, and a WebGL particle scene.
- **Flagship projects** — expandable spotlight cards for Kavach, RepoProof, Pehredar, C.U.R.E, TokenGuard, and Mission Khaki, with 3D tilt, status pills, and stack chips.
- **Plus** — interactive terminal, skills bento grid, journey timeline, marquee strip, contact section with copy-email, and a floating glass nav.
- **Motion** — Lenis smooth scroll, GSAP scroll reveals, section open-FX (dossier unlock, declassify, timeline draw, decrypt), and a cat page-eat transition. Everything degrades gracefully under reduced motion and on touch.

## Stack

Vite + Tailwind CSS v4 + Three.js + GSAP (ScrollTrigger) + Lenis. No framework — vanilla JS modules.

## Structure

```
index.html                  — page structure and sections
src/main.js                 — all interaction (preloader, reveals, tilt, terminal)
src/style.css               — Tailwind theme tokens + custom effects
src/data/site.js            — all copy/content (edit text here, layout untouched)
src/diagrams.js             — procedural project banner art
src/three/                  — WebGL hero scene + contact globe
.github/workflows/deploy.yml — auto-deploy to GitHub Pages on push to main
```

## Running locally

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Deploy

Pushes to `main` auto-build and deploy via the Pages workflow. No manual step needed.

## License

MIT
