# Omar Abd El Ghany — Neural Portfolio

> AI Engineer · MIU · ECPC Competitor · Building Autonomous Intelligence

A portfolio built to feel like the work it showcases — interactive, intelligent, and alive.

**Live:** [omar-portfolio.vercel.app](https://omar-portfolio.vercel.app)

---

## ✨ Features

- **Neural Portfolio Map** — Interactive SVG neural network visualizing skills → projects → output, with animated data packets, hover activations, and radial burst effects on the output node
- **AI Sandbox** — Live Gemini-powered agent that answers recruiter questions about Omar's background, with real-time status indicator (🟢 online / 🟡 starting up / 🟠 quota reached / 🔴 unavailable)
- **Project Vault** — Deep-dive cards for each project with technical challenge + solution breakdown
- **The Journey** — Timeline of education, internships, and competitions
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
│   ├── projects.js         # Project Vault card renderer
│   ├── chat.js             # AI Sandbox terminal + health polling
│   ├── neuralmap.js        # Interactive neural network SVG visualization
│   └── styles.css          # Custom animation keyframes
├── backend/
│   ├── index.js            # Express server + health endpoint + admin logs viewer
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
├── render.yaml             # Render backend deployment config
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

### Backend → Render

1. Connect your GitHub repo to [render.com](https://render.com)
2. New Web Service → Root directory: `backend`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Instance type: **Free**

Set these environment variables on Render:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key — [get one here](https://aistudio.google.com/app/apikey) |
| `GITHUB_TOKEN` | GitHub personal access token (for repo context) |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL exactly |
| `ADMIN_PASSWORD` | Password for `/admin/logs` — required, no default |

### Connect them

After both are deployed, update `ALLOWED_ORIGIN` on Render to your exact Vercel URL. That's the only connection needed.

---

## 🛠️ Local Development

### Frontend

```bash
# Serve with any static server
npx serve .
# or open index.html directly — note: Live Server causes auto-reload during AI responses
```

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your API keys
npm install
npm run dev
```

The frontend `API_URL` in `src/chat.js` defaults to the Render URL. For local dev, temporarily change it to `http://localhost:3000/api/chat`.

---

## 📊 Conversation Logs

Every AI interaction is logged to `backend/logs/conversations.jsonl` (gitignored).

View them at:
```
https://your-backend.onrender.com/admin/logs?pass=YOUR_ADMIN_PASSWORD
```

Each entry: `{ ts, question, answer, ms, status }`

---

## 🧠 AI Agent

Powered by **Gemini 2.5 Flash Lite** with a custom system prompt from `backend/context/knowledge.txt` — a structured knowledge base covering Omar's skills, projects, experience, and goals.

GitHub repo context is fetched dynamically per query for relevant technical questions (cached 10 min).

**Status indicators — zero quota cost from polling:**
- 🟢 **online** — backend up, Gemini responding
- 🟡 **starting up...** — backend waking from sleep (Render free tier cold start ~30s)
- 🟠 **quota reached** — daily Gemini quota exhausted, resets tomorrow
- 🔴 **unavailable** — backend unreachable after 45s

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla JS (ES Modules), Tailwind CSS CDN, Vanta NET, SVG |
| Backend | Node.js, Express, Google Generative AI SDK, Axios |
| AI | Gemini 2.5 Flash Lite |
| Hosting | Vercel (frontend) + Render (backend) |

---

## 📄 License

MIT — feel free to fork and adapt for your own portfolio.
