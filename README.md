# Omar Abd El Ghany - Neural Portfolio

> AI Engineer · MIU · ECPC Competitor · Building Autonomous Intelligence

A portfolio built to feel like the work it showcases — interactive, intelligent, and alive.

**Live:** [omar-portfolio.vercel.app](https://omar-portfolio.vercel.app)

---

## ✨ Features

- **Neural Portfolio Map** — Interactive SVG neural network visualizing skills → projects → output, with animated data packets, hover activations, and radial burst effects on the output node
- **AI Sandbox** — Live Gemini-powered agent that answers recruiter questions about Omar's background, with real-time status indicator (🟢 online / 🟡 starting up / 🟠 quota reached / 🔴 unavailable)
- **Project Vault** — 9 projects with expandable cards, technical challenge + solution breakdown, and bold highlights
- **The Journey** — Animated timeline of education, internships, and competitions with milestone flash effects
- **Vanta NET Background** — Animated neural network canvas that reacts to mouse movement
- **Conversation Logging** — Every AI interaction is logged server-side with question, answer, response time, and status

---

## 🏗️ Architecture

```
Portfolio/
├── index.html              # Single-page frontend (vanilla JS + Tailwind CDN)
├── src/
│   ├── main.js             # Entry point — initialises all modules
│   ├── nav.js              # Scroll spy + smooth scroll
│   ├── projects.js         # Project Vault card renderer (featured + expandable)
│   ├── chat.js             # AI Sandbox terminal + smart health polling
│   ├── neuralmap.js        # Interactive neural network SVG visualization
│   └── styles.css          # Custom animation keyframes
├── backend/
│   ├── index.js            # Express server + health endpoint + admin logs viewer
│   ├── Dockerfile          # Docker config for HF Spaces deployment
│   ├── routes/
│   │   └── chat.js         # POST /api/chat — Gemini + GitHub context
│   ├── services/
│   │   ├── gemini.js       # Gemini API wrapper with knowledge context
│   │   ├── github.js       # GitHub repo fetcher with 10-min cache
│   │   ├── logger.js       # Append-only conversation logger (.jsonl)
│   │   └── status.js       # Shared Gemini status state (no quota polling)
│   └── context/
│       └── knowledge.txt   # Omar's knowledge base for the AI agent
├── vercel.json             # Vercel static deployment config
└── tailwind.config.js      # Tailwind theme tokens
```

---

## 🚀 Deployment

### Frontend → Vercel

1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Root directory: `/` (default)
3. Framework preset: **Other** (static)
4. No build command needed
5. Deploy → get your URL e.g. `https://omar-portfolio.vercel.app`

### Backend → Hugging Face Spaces (Docker)

1. Create a new Space at [huggingface.co/spaces](https://huggingface.co/spaces)
2. Select **Docker** SDK → **Blank** template → **Public**
3. Clone the Space repo and push your `backend/` folder contents
4. Go to **Settings → Variables and Secrets** and add:

| Variable/Secret | Type | Description |
|---|---|---|
| `GEMINI_API_KEY` | Secret | Google Gemini API key — [get one here](https://aistudio.google.com/app/apikey) |
| `GITHUB_TOKEN` | Secret | GitHub personal access token (for repo context) |
| `ADMIN_PASSWORD` | Secret | Password for `/admin/logs` — required, no default |
| `ALLOWED_ORIGIN` | Variable | Your Vercel frontend URL exactly |

5. HF builds the Docker container automatically (~2-3 min)
6. Your API URL: `https://your-username-your-space-name.hf.space`

### Connect them

Update `ALLOWED_ORIGIN` on HF Spaces to your Vercel URL. Update `API_URL` in `src/chat.js` to your HF Space URL.

> **Why HF Spaces?** Free tier sleeps after **48 hours** of inactivity vs Render's 15 minutes — much better for a portfolio.

---

## 🛠️ Local Development

### Frontend

```bash
# Serve with any static server
npx serve .
# Note: VS Code Live Server causes auto-reload during AI responses — use npx serve instead
```

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your API keys
npm install
npm run dev
```

Update `API_URL` in `src/chat.js` to `http://localhost:3000/api/chat` for local dev.

---

## 📊 Conversation Logs

Every AI interaction is logged to `backend/logs/conversations.jsonl` (gitignored).

View them at:
```
https://your-space.hf.space/admin/logs?pass=YOUR_ADMIN_PASSWORD
```

Each entry: `{ ts, question, answer, ms, status }`

---

## 🧠 AI Agent

Powered by **Gemini 2.5 Flash Lite** with a custom system prompt from `backend/context/knowledge.txt` — a structured knowledge base covering Omar's skills, projects, experience, and goals including the 3 Samsung capstones.

GitHub repo context is fetched dynamically per query for relevant technical questions (cached 10 min).

**Status indicators — zero quota cost from polling:**
- 🟢 **online** — backend up, Gemini responding
- 🟡 **starting up...** — backend waking from sleep (HF Spaces cold start ~10s)
- 🟠 **quota reached** — daily Gemini quota exhausted, resets tomorrow
- 🔴 **unavailable** — backend unreachable after 45s

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla JS (ES Modules), Tailwind CSS CDN, Vanta NET, SVG |
| Backend | Node.js, Express, Google Generative AI SDK, Axios |
| AI | Gemini 2.5 Flash Lite |
| Hosting | Vercel (frontend) + Hugging Face Spaces Docker (backend) |

---

## 📄 License

feel free to fork and adapt for your own portfolio.
