# Omar Abd El Ghany — Neural Portfolio

> AI Engineer · MIU · ECPC Competitor · Building Autonomous Intelligence

A portfolio built to feel like the work it showcases — interactive, intelligent, and alive.

---

## ✨ Features

- **Neural Portfolio Map** — Interactive SVG neural network visualizing skills → projects → output, with animated data packets, hover activations, and radial burst effects
- **AI Sandbox** — Live Gemini-powered agent that answers recruiter questions about Omar's background, with real-time status monitoring (online / quota / offline)
- **Project Vault** — Deep-dive cards for each project with technical challenge + solution breakdown
- **The Journey** — Timeline of education, internships, and competitions
- **Vanta NET Background** — Animated neural network canvas that reacts to mouse movement

---

## 🏗️ Architecture

```
Portfolio/
├── index.html              # Single-page frontend
├── src/
│   ├── main.js             # Entry point — initialises all modules
│   ├── nav.js              # Scroll spy + smooth scroll
│   ├── projects.js         # Project Vault card renderer
│   ├── chat.js             # AI Sandbox terminal logic + health polling
│   ├── neuralmap.js        # Interactive neural network SVG visualization
│   └── styles.css          # Custom animation keyframes
├── backend/
│   ├── index.js            # Express server + health + admin logs
│   ├── routes/
│   │   └── chat.js         # POST /api/chat — Gemini + GitHub context
│   ├── services/
│   │   ├── gemini.js       # Gemini API wrapper with knowledge context
│   │   ├── github.js       # GitHub repo fetcher with 10-min cache
│   │   └── logger.js       # Append-only conversation logger
│   └── context/
│       └── knowledge.txt   # Omar's knowledge base for the AI agent
├── vercel.json             # Vercel static deployment config
└── tailwind.config.js      # Tailwind theme config
```

---

## 🚀 Deployment

### Frontend → Vercel

```bash
# Connect your GitHub repo to Vercel
# Set root directory to: / (project root)
# Framework preset: Other (static)
```

### Backend → Render

```bash
# Connect your GitHub repo to Render
# Root directory: backend
# Build command: npm install
# Start command: npm start
```

Set these environment variables on Render:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `GITHUB_TOKEN` | GitHub personal access token |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL |
| `ADMIN_PASSWORD` | Password for `/admin/logs` endpoint |

---

## 🛠️ Local Development

### Frontend

```bash
# Serve with any static server, e.g.:
npx serve .
# or open index.html directly in browser
```

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your API keys in .env
npm install
npm run dev
```

Update `API_URL` in `src/chat.js` if your backend runs on a different port.

---

## 📊 Conversation Logs

Every AI interaction is logged to `backend/logs/conversations.jsonl`.

View them at:
```
https://your-backend.onrender.com/admin/logs?pass=YOUR_ADMIN_PASSWORD
```

Each entry contains: timestamp, question, answer, response time (ms), status (ok / quota / error).

---

## 🧠 AI Agent

The agent uses **Gemini 2.5 Flash Lite** with a custom system prompt built from `backend/context/knowledge.txt` — a structured knowledge base covering Omar's skills, projects, experience, and goals.

GitHub repo context is fetched dynamically and injected per query for relevant technical questions.

**Status indicators:**
- 🟢 **online** — backend up, Gemini responding
- 🟡 **quota limit** — daily Gemini quota exhausted
- 🔴 **offline** — backend unreachable

---

## 📦 Tech Stack

**Frontend:** Vanilla JS (ES Modules) · Tailwind CSS CDN · Vanta NET · SVG animations

**Backend:** Node.js · Express · Google Generative AI SDK · Axios · dotenv

---

## 📄 License

MIT — feel free to fork and adapt for your own portfolio.
