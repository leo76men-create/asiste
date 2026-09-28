# Asiste — asistente digital de cumpleaños

Un rincón digital personal para descansar, distraerse, escuchar música, ver algo, jugar o volver cuando se necesite.

## Run & Operate

- `pnpm --filter @workspace/asiste run dev` — run the website through its managed workflow
- `pnpm --filter @workspace/asiste run typecheck` — check the frontend
- `pnpm --filter @workspace/asiste run build` — production build when `PORT` and `BASE_PATH` are set by the workflow

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite, TypeScript, Tailwind CSS
- Static content loaded from `artifacts/asiste/public/data/*.json`

## Where things live

- `artifacts/asiste/src/App.tsx` — SPA, flows, local analysis and storage
- `artifacts/asiste/src/index.css` — visual tokens, responsive layout and animation
- `artifacts/asiste/public/data/` — editable personal content
- `artifacts/asiste/ARQUITECTURA.md` — screen map and privacy/storage decisions
- `artifacts/asiste/README.md` — customization and testing guide

## Architecture decisions

- No backend or authentication: personal text stays in the browser.
- The birthday letter is shown once per browser/device and marks `carta_vista` only after entering.
- The organizer is opt-in and is the only user content that persists beyond the current page.

## Product

- Birthday intro and letter, with `?reset=1` and `?carta=1` test modes.
- Six-option home screen, local free-text branching, rest, quiet breathing screen, distraction timing, music, entertainment, public dog/cat APIs, trivia, nerd facts, memory game and weighted surprise.
- Optional local organizer and discreet WhatsApp/phone contact.

## User preferences

- Keep personal details in `public/data/config.json`; do not hardcode them across the UI.

## Gotchas

- Missing handwriting/font/signature/audio assets are intentional fallbacks; upload real files under `public/assets/` before sharing.
- External video entries should remain verified URLs or clearly marked search placeholders.

## Pointers

- See `artifacts/asiste/README.md` for the Spanish customization guide.
