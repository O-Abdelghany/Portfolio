# Implementation Plan: Omar Portfolio

## Overview

Build a two-unit portfolio: a static SPA frontend (HTML + Tailwind CSS + vanilla JS) and a Node.js/Express backend API that proxies Gemini 1.5 Flash and GitHub REST API calls. Tasks are ordered so each step produces runnable, integrated code before moving to the next section.

## Tasks

- [x] 1. Project scaffolding and Tailwind CSS setup
  - [x] 1.1 Create frontend file structure
    - Create `index.html` with semantic HTML5 shell (head, body, five section stubs with IDs: `#home`, `#ai-sandbox`, `#project-vault`, `#journey`, `#contact`)
    - Create `tailwind.config.js` with Neural Noir color tokens: `noir-bg` (#080810), `noir-surface` (#0f0f1a), `noir-border` (#1e1e3a), `accent` (#7c3aed), `accent-glow` (#a855f7), `text-primary` (#ffffff), `text-muted` (#94a3b8)
    - Create `src/main.js`, `src/animation.js`, `src/chat.js`, `src/projects.js`, `src/nav.js` as empty ES module stubs
    - Create `public/assets/` directory placeholder
    - Link Tailwind CSS (CDN or PostCSS build), Inter font, and JetBrains Mono font in `<head>`
    - _Requirements: 7.1, 7.2, 7.6_

  - [x] 1.2 Create backend file structure
    - Create `backend/index.js` — Express app entry point with `PORT` env var
    - Create `backend/routes/chat.js` — stub for `POST /api/chat`
    - Create `backend/services/gemini.js` — stub Gemini client wrapper
    - Create `backend/services/github.js` — stub GitHub client wrapper
    - Create `backend/context/knowledge.txt` — placeholder for Omar's CV and background
    - Create `backend/.env.example` with keys: `GEMINI_API_KEY`, `GITHUB_TOKEN`, `ALLOWED_ORIGIN`, `PORT`
    - Create `backend/package.json` with dependencies: `express`, `cors`, `dotenv`, `@google/generative-ai`, `node-fetch` (or `axios`)
    - _Requirements: 9.1, 9.5, 9.9_

- [x] 2. Nav Bar
  - [x] 2.1 Implement Nav Bar HTML and base styles
    - Add `<nav>` element fixed at top (`position: fixed; top: 0; z-index: 50`) with `bg-noir-bg border-b border-noir-border`
    - Render five anchor links: "Home", "The AI Sandbox", "Project Vault", "The Journey", "Contact" pointing to their section IDs
    - Apply `font-sans` and `text-text-muted` base styles; active link class `text-accent-glow`
    - Add CSS transition 200ms on color for all nav links
    - _Requirements: 1.1, 1.3, 1.5, 7.3_

  - [x] 2.2 Implement scroll spy and smooth scroll in `src/nav.js`
    - Use `IntersectionObserver` (threshold 0.5) on each section root to detect active section
    - Toggle `text-accent-glow` class on the matching nav link when its section enters viewport
    - Implement smooth scroll via `scrollIntoView({ behavior: 'smooth' })` on nav link click
    - Wire `nav.js` init call from `src/main.js`
    - _Requirements: 1.2, 1.4_

  - [ ]* 2.3 Write unit tests for scroll spy logic
    - Test that clicking each nav link triggers smooth scroll to the correct section
    - Test that active class is applied/removed correctly as sections enter/leave viewport
    - _Requirements: 1.2, 1.4_

- [x] 3. Hero Section and Neural Network Animation
  - [x] 3.1 Implement Hero Section HTML and fade-in styles
    - Add `<section id="home">` with `min-h-screen` and `bg-noir-bg`
    - Add headline `<h1>` "Omar Abd El Ghany: Building Autonomous Intelligence." with `text-text-primary`
    - Add sub-headline `<p>` with `text-text-muted`
    - Add `<canvas id="neural-bg">` absolutely positioned behind content
    - Add two CTA buttons: "Explore My Work" (scrolls to `#project-vault`) and "Ask My AI Agent" (scrolls to `#ai-sandbox`)
    - Define `@keyframes fadeInUp` (800ms, `animation-fill-mode: both`) and apply to headline and sub-headline
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7_

  - [x] 3.2 Implement Neural Network canvas animation in `src/animation.js`
    - Generate ~60 nodes with random positions on the canvas
    - Draw connecting edges between nodes closer than 150px with low-opacity lines
    - Animate nodes with slow drift using `requestAnimationFrame`
    - Check `window.matchMedia('(prefers-reduced-motion: reduce)')` — if true, skip animation loop and render a static snapshot only
    - Resize canvas to full viewport on `window.resize`
    - Export `initAnimation()` and call from `src/main.js`
    - _Requirements: 2.3, 8.2, 8.4_

  - [ ]* 3.3 Write property test for reduced-motion animation safety
    - **Property 5: Animation safety under reduced-motion**
    - **Validates: Requirements 8.4**
    - Simulate `prefers-reduced-motion: reduce` and assert `requestAnimationFrame` is never called after init

- [ ] 4. Checkpoint — Verify nav, hero, and animation render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Project Vault
  - [x] 5.1 Implement Project Vault HTML shell and card renderer in `src/projects.js`
    - Add `<section id="project-vault">` with a responsive CSS grid (1 col mobile, 3 col `lg:`)
    - Define the `projects` array with three placeholder entries (title, challenge, solution, githubUrl)
    - Render each entry as a `<article>` card with `bg-noir-surface border border-noir-border` and `text-text-primary` title
    - Add "View Code" `<a target="_blank">` button linking to `githubUrl`
    - Apply hover styles: `transform: translateY(-4px)` + `box-shadow: 0 0 24px #7c3aed40` via Tailwind `hover:` utilities or inline CSS transition
    - Apply CSS transition 300ms on transform and box-shadow
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.3_

  - [x] 5.2 Implement staggered entrance animation for Project Cards
    - Use `IntersectionObserver` on the project vault section
    - When cards enter viewport, add `animate-fade-up` class with `animation-delay` increments of 150ms per card (0ms, 150ms, 300ms)
    - Define `@keyframes fadeUp` in CSS
    - _Requirements: 4.6_

  - [ ]* 5.3 Write unit tests for Project Card rendering
    - Test that exactly three cards are rendered
    - Test that "View Code" links open the correct `githubUrl` in a new tab
    - Test that hover class is applied on mouseenter
    - _Requirements: 4.1, 4.3, 4.4_

- [x] 6. Journey Section
  - [x] 6.1 Implement Journey Section timeline HTML and styles
    - Add `<section id="journey">` with vertical timeline layout on mobile, horizontal on `lg:` breakpoint
    - Hardcode milestone entries as HTML or a JS array rendered to DOM:
      - MIU enrollment — "3rd-year Computer Science student at MIU"
      - ECPC Regional — "50th Place — ECPC Regional: Algorithmic Optimization & Competitive Resilience"
      - (Placeholder slot for additional entries)
    - Style each milestone with a marker dot using `bg-accent` (#7c3aed) and timeline connector lines in `border-accent`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6_

  - [x] 6.2 Implement milestone entrance animations
    - Use `IntersectionObserver` on each milestone element
    - Alternate `fade-in-left` and `fade-in-right` CSS keyframe classes as each entry enters viewport
    - Respect `prefers-reduced-motion`: skip animation classes if reduced motion is preferred
    - _Requirements: 5.5, 8.4_

- [x] 7. Contact Section
  - [x] 7.1 Implement Contact Section HTML and form
    - Add `<section id="contact">` with `bg-noir-surface border border-noir-border` form container
    - Add Omar's name and invitation text
    - Add form with three required fields: Name (`<input>`), Email (`<input type="email">`), Message (`<textarea>`)
    - Add GitHub and LinkedIn icon buttons (SVG icons) linking to `https://github.com/O-Abdelghany` and `https://www.linkedin.com/in/omarabdelghany/` with `target="_blank"`
    - _Requirements: 6.1, 6.2, 6.5, 6.6_

  - [x] 7.2 Implement client-side form validation and Formspree submission
    - On submit, check each required field; if empty, display inline `<span>` error message below the field before any network request
    - On valid submit, `fetch` POST to Formspree endpoint (URL stored in a `data-` attribute or config constant)
    - On success response, replace form with a confirmation message
    - On network error, display a generic error message without hiding the form
    - _Requirements: 6.3, 6.4_

  - [ ]* 7.3 Write property test for form validation completeness
    - **Property 4: Form validation completeness**
    - **Validates: Requirements 6.4**
    - For each combination of empty required fields, assert that an inline error appears for every empty field and no fetch call is made

- [ ] 8. Checkpoint — Verify Project Vault, Journey, and Contact sections render and behave correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Backend API — Express setup and CORS
  - [x] 9.1 Implement Express app entry point (`backend/index.js`)
    - Initialize Express app, load `dotenv`
    - Apply `cors({ origin: process.env.ALLOWED_ORIGIN })` middleware
    - Mount `routes/chat.js` at `/api/chat`
    - Start server on `process.env.PORT || 3000`
    - _Requirements: 9.8_

  - [x] 9.2 Implement `POST /api/chat` route stub (`backend/routes/chat.js`)
    - Accept `{ message }` JSON body
    - Validate that `message` is a non-empty string; return 400 if missing
    - Call `geminiService.chat(message)` (to be implemented next)
    - Return `{ reply, citations }` on success
    - Return `{ error: "..." }` with HTTP 502 on Gemini error
    - _Requirements: 9.1, 9.6_

- [x] 10. Backend API — Knowledge Context and Gemini integration
  - [x] 10.1 Populate `backend/context/knowledge.txt`
    - Write Omar's CV content: name, university (MIU, 3rd-year CS), skills, projects, ECPC result, LinkedIn, GitHub
    - Include explicit instructions for the RAG persona: confirm skills with Deep_Links, respond "Not yet, but he knows [top 3 related]" for absent skills
    - _Requirements: 9.2, 3.7_

  - [x] 10.2 Implement Gemini client wrapper (`backend/services/gemini.js`)
    - Initialize `@google/generative-ai` with `process.env.GEMINI_API_KEY`
    - Load `knowledge.txt` contents at module init
    - Export `chat(message, repoSummary)` function that:
      - Builds system prompt = knowledge.txt + repoSummary
      - Calls `gemini-1.5-flash` model with system prompt and user message
      - Returns the text response string
    - Throw a typed error on API failure so the route can return 502
    - _Requirements: 9.2, 9.3, 3.3, 3.7_

  - [ ]* 10.3 Write property test for backend API round-trip integrity
    - **Property 3: Backend API round-trip integrity**
    - **Validates: Requirements 9.1**
    - For any non-empty `message` string, mock Gemini to return a fixed reply and assert `POST /api/chat` returns `{ reply }` with a non-empty string within the response

- [x] 11. Backend API — GitHub REST API integration
  - [x] 11.1 Implement GitHub client wrapper (`backend/services/github.js`)
    - On module init, fetch `GET /users/O-Abdelghany/repos` using `GITHUB_TOKEN` auth header; store result in an in-memory cache with a 10-minute TTL
    - Export `getRepoSummary(skill)` that searches cached repos by name/description for relevance to `skill`
    - For matched repos, fetch `GET /repos/O-Abdelghany/{repo}/git/trees/HEAD?recursive=1` to find relevant file paths
    - Construct Deep_Links as `https://github.com/O-Abdelghany/{repo}/blob/main/{path}`
    - On GitHub API error or rate-limit (HTTP 403/429), return cached data; if no cache exists, return an empty summary gracefully
    - _Requirements: 9.4, 9.7, 3.13_

  - [x] 11.2 Wire GitHub repo summary into Gemini request (`backend/routes/chat.js`)
    - Before calling `geminiService.chat()`, call `githubService.getRepoSummary(message)` to get a repo context string
    - Pass the repo summary as the second argument to `geminiService.chat(message, repoSummary)`
    - _Requirements: 9.4, 3.4_

  - [ ]* 11.3 Write property test for skill-present Deep_Link inclusion
    - **Property 1: Skill-present response always includes a Deep_Link**
    - **Validates: Requirements 3.4**
    - Mock GitHub service to return a known repo; mock Gemini to echo the repo URL; assert response `reply` contains a URL matching `https://github.com/O-Abdelghany/`

  - [ ]* 11.4 Write property test for skill-absent response format
    - **Property 2: Skill-absent response never elaborates unprompted**
    - **Validates: Requirements 3.5**
    - Mock Gemini to return a "Not yet" response; assert the reply contains "Not yet" and lists no more than three related skill names

- [ ] 12. Checkpoint — Verify backend API responds correctly end-to-end with mocked services
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. AI Sandbox — Terminal UI frontend
  - [x] 13.1 Implement Terminal UI HTML structure in `index.html`
    - Add `<section id="ai-sandbox">` containing a terminal container with `bg-noir-surface border border-noir-border font-mono`
    - Add header bar: three decorative dots (red `#ef4444`, yellow `#eab308`, green `#22c55e`) + title text "omar-agent ~ recruiter-session"
    - Add scrollable message log `<div id="chat-log">` with welcome message: "Connected to omar-agent v1.0. Ask me anything about Omar's technical background."
    - Add input row: `<input id="chat-input">` + `<button id="chat-send">Send</button>` styled to match terminal aesthetic
    - _Requirements: 3.1, 3.2, 3.8, 3.11_

  - [x] 13.2 Implement chat logic in `src/chat.js`
    - On submit (button click or Enter key): append right-aligned user bubble with `text-accent` (#7c3aed), show animated typing indicator (blinking cursor `|` or `...` ellipsis)
    - `POST /api/chat` with `{ message }` to backend URL (read from `window.ENV.API_URL` or a config constant)
    - On response: remove typing indicator, append left-aligned agent bubble with `text-text-muted` (#94a3b8)
    - Parse markdown links `[label](url)` in agent response and render as `<a target="_blank" class="text-accent-glow underline">` tags
    - Auto-scroll `#chat-log` to bottom after each message append
    - Shift+Enter inserts newline in input without submitting
    - On HTTP error or network failure, append fallback message directing recruiter to Contact section
    - Wire `chat.js` init from `src/main.js`
    - _Requirements: 3.3, 3.9, 3.10, 3.11, 3.12_

  - [ ]* 13.3 Write unit tests for chat UI logic
    - Test that user bubble is appended with correct alignment class on submit
    - Test that typing indicator appears then disappears after response
    - Test that markdown links in agent response are rendered as `<a>` tags
    - Test that fallback message is shown on fetch error
    - _Requirements: 3.9, 3.10, 3.12_

- [x] 14. Responsive design and accessibility pass
  - [x] 14.1 Verify and fix responsive layout across breakpoints
    - Test all sections at 320px, 768px, 1280px, and 1920px viewport widths
    - Ensure nav collapses or stacks correctly on mobile
    - Ensure Project Vault grid is 1-col on mobile and 3-col on `lg:`
    - Ensure Journey timeline switches from vertical (mobile) to horizontal (`lg:`)
    - Ensure Terminal UI is usable on small screens (input row doesn't overflow)
    - _Requirements: 7.4_

  - [x] 14.2 Add keyboard accessibility and focus rings
    - Add `focus:ring-2 focus:ring-accent-glow` Tailwind utilities to all interactive elements: nav links, CTA buttons, Project Card "View Code" buttons, chat input, chat send button, contact form fields and submit button, social icon buttons
    - Ensure all `<a>` and `<button>` elements are reachable via Tab key in logical order
    - Add `aria-label` attributes to icon-only buttons (GitHub, LinkedIn SVG icons)
    - _Requirements: 7.5_

  - [ ]* 14.3 Write unit tests for focus ring and ARIA attributes
    - Test that each interactive element has the focus ring class
    - Test that icon buttons have non-empty `aria-label`
    - _Requirements: 7.5_

- [x] 15. Performance optimizations
  - [x] 15.1 Implement lazy loading for below-fold assets
    - Add `loading="lazy"` to any `<img>` elements not in the initial viewport
    - Defer non-critical JS modules using `<script type="module" defer>`
    - _Requirements: 8.3_

  - [x] 15.2 Audit and enforce reduced-motion across all animations
    - Wrap all `@keyframes` animation assignments in a `@media (prefers-reduced-motion: no-preference)` block in CSS
    - In `animation.js`, re-check `prefers-reduced-motion` on `matchMedia` change event and cancel the animation loop if it becomes active mid-session
    - In `nav.js` and `projects.js`, skip adding entrance animation classes when reduced motion is preferred
    - _Requirements: 8.4_

  - [ ]* 15.3 Write property test for reduced-motion completeness
    - **Property 5: Animation safety under reduced-motion (CSS layer)**
    - **Validates: Requirements 8.4**
    - Assert that no CSS animation or transition is applied to any element when `prefers-reduced-motion: reduce` is active (check computed styles)

- [x] 16. Deployment configuration
  - [x] 16.1 Add frontend deployment config
    - Create `vercel.json` (or `netlify.toml`) at project root configuring the frontend as a static site
    - Add a `window.ENV` injection snippet in `index.html` that reads `VITE_API_URL` (or equivalent build-time env var) so `chat.js` can target the correct backend URL in both dev and prod
    - Document required env vars in `README.md`
    - _Requirements: 9.5_

  - [x] 16.2 Add backend deployment config
    - Add a `Procfile` or `render.yaml` in `backend/` for Render/Railway deployment
    - Ensure `backend/.env.example` lists all required variables with descriptions
    - Add a health-check route `GET /health` returning `{ status: "ok" }` for deployment platform uptime checks
    - _Requirements: 9.5, 9.8_

- [x] 17. Final checkpoint — Full integration review
  - Wire all `src/main.js` init calls: `initAnimation()`, `initNav()`, `initProjects()`, `initChat()`
  - Verify the complete page renders without console errors
  - Verify the chat flow works end-to-end against the running backend
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 4, 8, 12, and 17 ensure incremental validation
- Property tests validate the five correctness properties defined in the design document
- Unit tests validate specific examples and edge cases
- The `projects` array in `src/projects.js` uses placeholder data — Omar swaps in real project details without touching layout code
- Backend API keys must never be committed; use `.env` locally and platform secrets in production
