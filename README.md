# Jalaleddin El Firqi — Portfolio

A bilingual (EN/FR) personal portfolio with two routes:

- **`/`** — Chat portfolio (landing). Conversational interface with a dual-orbit tech halo, suggested chips, and browser-native voice mode.
- **`/editorial`** — Editorial portfolio. Long-form layout: experience, projects, skills, awards, education, contact.

Built with **Vite** + **React** + **react-router-dom**. All visible copy lives in [`src/content.jsx`](src/content.jsx) as a single bilingual object.

---

## Run locally

```bash
bun install      # or: npm install / pnpm install
bun run dev      # vite dev server on http://localhost:5173
```

Production build:

```bash
bun run build    # outputs to dist/
bun run preview  # serves the built bundle for a final check
```

---

## Project layout

```
.
├── index.html                  ← single SPA entry
├── package.json · vite.config.js · .gitignore
├── public/
│   ├── logos/                  ← company logos (SIANA, AI-Inside, JESA)
│   └── uploads/                ← any user-uploaded assets
└── src/
    ├── main.jsx · App.jsx      ← router root (chat at /, editorial at /editorial)
    ├── content.jsx             ← bilingual content (EN/FR), default-exported
    ├── pages/
    │   ├── ChatPortfolio.jsx
    │   └── EditorialPortfolio.jsx
    ├── components/Halo.jsx     ← orbits + pixel portrait
    ├── lib/
    │   ├── tweaks.jsx          ← useTweaks hook + panel + form controls
    │   └── chat-backend.js     ← local stub for window.portfolio.ask()
    └── styles/
        ├── global.css
        ├── editorial.css
        └── chat.css
```

Each page imports its CSS with Vite's `?inline` query and renders it inside its own `<style>` tag, so the two pages never clash on `:root` tokens.

---

## Editing content

Everything visible is in [`src/content.jsx`](src/content.jsx) as a single `C = { en: {...}, fr: {...} }` object:

- `experiences[]` — three roles
- `projects[]` — featured + secondary projects (set `feat: true` for the big editorial layout)
- `skills[]` — grouped tags
- `awards[]`, `education[]`, `contact{}`

Tags use **Simple Icons** by label — see `ICON_SLUGS` in [`src/pages/EditorialPortfolio.jsx`](src/pages/EditorialPortfolio.jsx) and `HALO_ICONS` in [`src/components/Halo.jsx`](src/components/Halo.jsx). Add a new tech by mapping its label to a [Simple Icons slug](https://simpleicons.org/).

---

## Chat backend

The Chat page calls `window.portfolio.ask({ messages })`. Locally that's stubbed by [`src/lib/chat-backend.js`](src/lib/chat-backend.js), which returns canned first-person replies seeded from `content.jsx` so the UI works offline with no API key.

**Before deploying**, replace the stub with a fetch to your own proxy:

```js
// in ChatPortfolio.jsx — swap the window.portfolio.ask call for:
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [...] }),
});
const { reply } = await res.json();
```

Easiest hosting paths for the proxy:

- **Cloudflare Workers** — free tier, ~10 lines of code
- **Vercel Edge Functions** — free tier, drop a `/api/chat.js` next to `index.html`
- **Self-hosted on the QtoDash cluster** — small Express service in K8s, exposed via the NGINX ingress

Forward to whichever model provider you settle on, and add per-IP rate-limiting.

---

## Voice mode (Chat page)

Uses the browser-native **Web Speech API** — zero dependencies, works in Chrome / Edge / Safari (latest).

- Click the **mic** in the composer to dictate a question
- Toggle **Voice mode** on to have replies read aloud automatically
- Each assistant message has a small 🔊 button to replay

To swap in a fine-tuned voice later, replace the `speak()` function in [`src/pages/ChatPortfolio.jsx`](src/pages/ChatPortfolio.jsx) with a fetch to your TTS endpoint.

---

## Deploy

Run `bun run build`, then drop `dist/` onto any static host:

- **Netlify** / **Vercel** — drag-and-drop or `vercel deploy`
- **GitHub Pages** — push the repo, point Pages at the build output
- **Self-hosted** — `dist/` is plain static files; serve via NGINX/Caddy/whatever

Any host serving an SPA needs a fallback rewrite of unknown paths to `/index.html` so `/editorial` resolves on direct hits / refresh.

---

## Things still on the todo list

- Real photos (robot, dashboards, contributor map) replacing the hatched placeholders
- A real CV PDF wired to the "Download CV" button
- Open Graph + Twitter card meta for link previews
- Fine-tuned voice endpoint + analytics

— Designed & built by Jalaleddin El Firqi · 2026.
