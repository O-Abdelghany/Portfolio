# Design Document

## Overview

Omar's portfolio is a single-page application (SPA) with a dark "Neural Noir" aesthetic. It is split into two deployable units:

- **Frontend** — a static SPA (HTML + Tailwind CSS + vanilla JS or a lightweight framework)
- **Backend API** — a small Node.js (Express) or Python (FastAPI) server that proxies Gemini and GitHub API calls

The two units communicate over a single REST endpoint. The frontend is fully static and can be hosted on GitHub Pages, Vercel, or Netlify. The backend can be deployed on Railway, Render, or any free-tier Node/Python host.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (SPA)                    │
│  Nav | Hero | AI Sandbox | Project Vault | Journey  │
│                  Contact Section                    │
└──────────────────────┬──────────────────────────────┘
                       │ POST /api/chat
                       ▼
┌─────────────────────────────────────────────────────┐
│               Backend API (Node/FastAPI)             │
│                                                     │
│  1. Inject Knowledge_Context as system prompt       │
│  2. Call Gemini 1.5 Flash API                       │
│  3. Call GitHub REST API for Deep_Link citations    │
│  4. Return structured response to frontend          │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
           ▼                      ▼
  Google Gemini API        GitHub REST API
  (Gemini 1.5 Flash)    (github.com/O-Abdelghany)
```

---

## Frontend Design

### Technology Stack

- **HTML5** — semantic markup
- **Tailwind CSS** (CDN or build step) — all styling
- **Vanilla JavaScript** (ES modules) — interactivity, scroll behavior, canvas animation, fetch calls
- No heavy framework required; the site is content-light and interaction-light

### File Structure

```
/
├── index.html
├── tailwind.config.js        # custom Neural Noir color tokens
├── src/
│   ├── main.js               # entry point, section init
│   ├── animation.js          # Neural Network canvas animation
│   ├── chat.js               # AI Sandbox terminal logic
│   ├── projects.js           # Project Vault card data + render
│   └── nav.js                # scroll spy + smooth scroll
└── public/
    └── assets/               # any icons or images
```

### Color Tokens (Tailwind config)

```js
colors: {
  'noir-bg':      '#080810',
  'noir-surface': '#0f0f1a',
  'noir-border':  '#1e1e3a',
  'accent':       '#7c3aed',
  'accent-glow':  '#a855f7',
  'text-primary': '#ffffff',
  'text-muted':   '#94a3b8',
}
```

### Typography

| Context | Font |
|---|---|
| Terminal_UI, code snippets | `font-mono` (JetBrains Mono or system monospace) |
| All other text | `font-sans` (Inter or system sans-serif) |

---

## Section-by-Section Design

### 1. Nav Bar

- Fixed `position: fixed; top: 0; z-index: 50`
- Background `noir-bg` with `border-b border-noir-border`
- Five anchor links; active link gets `text-accent-glow` class
- Scroll spy: `IntersectionObserver` on each section root element, threshold 0.5
- Smooth scroll via `scrollIntoView({ behavior: 'smooth' })`

### 2. Hero Section

- Full-viewport height (`min-h-screen`)
- `<canvas id="neural-bg">` absolutely positioned behind content, rendered via `animation.js`
  - Nodes: ~60 points randomly placed, connected when distance < 150px
  - Animation loop via `requestAnimationFrame`; paused when `prefers-reduced-motion` is set
- Headline and sub-headline fade in via CSS `@keyframes fadeInUp` (800ms, `animation-fill-mode: both`)
- Two CTA buttons: "Explore My Work" → `#project-vault`, "Ask My AI Agent" → `#ai-sandbox`

### 3. AI Sandbox

#### Terminal UI Layout

```
┌─────────────────────────────────────────────────────┐
│  ● ● ●   omar-agent ~ recruiter-session             │  ← header bar
├─────────────────────────────────────────────────────┤
│                                                     │
│  [agent] Connected to omar-agent v1.0...            │  ← message log
│                                                     │
│                    [user] What is Omar's stack? ▶   │
│                                                     │
│  [agent] Omar specializes in...                     │
│          → github.com/O-Abdelghany/repo/file.py     │
│                                                     │
├─────────────────────────────────────────────────────┤
│  > _______________________________________ [Send]   │  ← input row
└─────────────────────────────────────────────────────┘
```

#### Frontend Logic (`chat.js`)

1. On submit: append user bubble, show typing indicator, `POST /api/chat` with `{ message }`
2. On response: remove indicator, append agent bubble with parsed markdown (links rendered as `<a>` tags)
3. Auto-scroll message log to bottom after each message
4. Enter key submits; Shift+Enter inserts newline

#### Response Rendering

- Agent responses may contain markdown links `[label](url)` — render as styled `<a target="_blank">` tags
- Deep_Links rendered inline within the response text

### 4. Project Vault

#### Data Shape (placeholder, swappable)

```js
const projects = [
  {
    title: "Project Alpha",
    challenge: "Describe the technical challenge here.",
    solution: "Describe the solution and technologies used.",
    githubUrl: "https://github.com/O-Abdelghany/repo-name"
  },
  // ... two more
]
```

- Cards rendered from this array; Omar swaps data without touching layout code
- Hover effect: `transform: translateY(-4px)` + `box-shadow: 0 0 24px #7c3aed40`
- Staggered entrance: `IntersectionObserver` adds `animate-fade-up` class with `animation-delay` increments of 150ms per card

### 5. Journey Section

- Vertical timeline on mobile, horizontal on `lg:` breakpoint
- Each milestone: marker dot (accent color), date label, title, description
- Milestone data hardcoded in HTML or a JS array
- Key entries:
  - MIU enrollment — 3rd-year CS student
  - ECPC Regional — 50th Place, framed as "Algorithmic Optimization & Competitive Resilience"
  - (Omar can add more entries)
- Entrance animation: `IntersectionObserver` alternates `fade-in-left` / `fade-in-right`

### 6. Contact Section

- Form fields: Name, Email, Message — all required
- Client-side validation: inline error messages on empty submit
- Form submission: `fetch` to a form backend (Formspree free tier recommended) or `mailto:` fallback
- Confirmation message replaces form on success
- Icon buttons: GitHub (`github.com/O-Abdelghany`) and LinkedIn (`linkedin.com/in/omarabdelghany/`) using SVG icons

---

## Backend API Design

### Technology Choice

Node.js + Express is recommended for simplicity. Python + FastAPI is an equally valid alternative. The design below uses Node.js.

### File Structure

```
/backend
├── index.js              # Express app entry point
├── routes/
│   └── chat.js           # POST /api/chat handler
├── services/
│   ├── gemini.js         # Gemini API client wrapper
│   └── github.js         # GitHub REST API client wrapper
├── context/
│   └── knowledge.txt     # Omar's CV + personal background (system prompt)
├── .env                  # GEMINI_API_KEY, GITHUB_TOKEN, ALLOWED_ORIGIN
└── package.json
```

### API Contract

#### `POST /api/chat`

**Request**
```json
{
  "message": "Does Omar know LangChain?"
}
```

**Response (200)**
```json
{
  "reply": "Yes! Omar has hands-on experience with LangChain...\n\n→ [rag-pipeline/chain.py](https://github.com/O-Abdelghany/rag-pipeline/blob/main/chain.py)",
  "citations": [
    {
      "label": "rag-pipeline/chain.py",
      "url": "https://github.com/O-Abdelghany/rag-pipeline/blob/main/chain.py"
    }
  ]
}
```

**Response (502 — Gemini error)**
```json
{
  "error": "The AI agent is temporarily unavailable. Please try again shortly."
}
```

### Gemini Integration (`services/gemini.js`)

```
System prompt = Knowledge_Context (knowledge.txt contents)
               + GitHub repo summary (fetched fresh or from cache)

User turn     = recruiter's message

Model         = gemini-1.5-flash (free tier)
```

The system prompt instructs the model to:
- Confirm skills Omar has with project names and Deep_Links
- For skills Omar lacks: respond with "Not yet, but he knows [top 3 related]" + project names, no elaboration unless asked
- Always cite GitHub links when referencing code

### GitHub Integration (`services/github.js`)

- On server startup (and cached for 10 minutes): fetch `GET /users/O-Abdelghany/repos` to build a repo index
- When constructing a response: search the repo index for repos relevant to the skill mentioned
- For matched repos: fetch `GET /repos/O-Abdelghany/{repo}/git/trees/HEAD?recursive=1` to find relevant file paths
- Construct Deep_Links as `https://github.com/O-Abdelghany/{repo}/blob/main/{path}`
- On GitHub API error or rate limit: use cached data; if no cache, omit citations gracefully

### Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GITHUB_TOKEN` | GitHub personal access token (read-only, public repos) |
| `ALLOWED_ORIGIN` | Frontend origin for CORS (e.g. `https://omar-portfolio.vercel.app`) |
| `PORT` | Server port (default 3000) |

### CORS

```js
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
```

---

## Deployment

| Unit | Recommended Host | Notes |
|---|---|---|
| Frontend | Vercel / Netlify / GitHub Pages | Static files, free tier |
| Backend | Render / Railway | Free tier Node.js web service |

The frontend's `chat.js` reads the backend URL from a build-time env var (`VITE_API_URL` or a `window.ENV` injection) so the same codebase works in dev and prod.

---

## Correctness Properties

### Property 1 — Skill-present response always includes a Deep_Link
For any recruiter message that names a skill present in the Knowledge_Context, the RAG_Agent response SHALL contain at least one URL matching the pattern `https://github.com/O-Abdelghany/`.

### Property 2 — Skill-absent response never elaborates unprompted
For any recruiter message that names a skill absent from the Knowledge_Context, the RAG_Agent first response SHALL contain the phrase "Not yet" and SHALL NOT contain more than three related skill names without a follow-up question.

### Property 3 — Backend API round-trip integrity
For any valid `{ message }` request body, `POST /api/chat` SHALL return a JSON object containing a non-empty `reply` string within 10 seconds under normal network conditions.

### Property 4 — Form validation completeness
For any contact form submission where one or more required fields are empty, THE Contact_Section SHALL display a visible inline error for every empty field before any network request is made.

### Property 5 — Animation safety under reduced-motion
WHEN `prefers-reduced-motion: reduce` is active, THE Portfolio_Site SHALL render all sections without CSS keyframe animations and the Neural_Network_Animation canvas SHALL be static or hidden.
