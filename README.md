# Omar Abdelghany — Portfolio

> "Building Autonomous Intelligence."

A high-performance, dark-themed portfolio with an AI agent powered by Gemini 1.5 Flash and real-time GitHub integration.

## Stack

- **Frontend**: HTML5 + Tailwind CSS (CDN) + Vanilla JS (ES Modules)
- **Backend**: Node.js + Express
- **AI**: Google Gemini 1.5 Flash (free tier)
- **Data**: GitHub REST API (real-time repo access)

## Local Development

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in your keys in .env
node index.js
```

### 2. Frontend

Open `index.html` with a local server (e.g. VS Code Live Server on port 5500).

The frontend calls `http://localhost:3000/api/chat` by default.

## Environment Variables

### `backend/.env`

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key (free at aistudio.google.com) |
| `GITHUB_TOKEN` | GitHub personal access token (read-only, public repos) |
| `ALLOWED_ORIGIN` | Frontend origin for CORS (e.g. `http://localhost:5500`) |
| `PORT` | Server port (default: 3000) |

## Deployment

- **Frontend**: Deploy root folder to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (static)
- **Backend**: Deploy `backend/` folder to [Render](https://render.com) (free tier Node.js web service)

After deploying the backend, update `ALLOWED_ORIGIN` to your frontend URL and update `API_URL` in `src/chat.js`.

## Customization

- **Projects**: Edit the `projects` array in `src/projects.js`
- **AI Knowledge**: Edit `backend/context/knowledge.txt` with your real CV and background
- **Contact form**: Replace `YOUR_FORMSPREE_ID` in `src/main.js` with your [Formspree](https://formspree.io) endpoint
- **GitHub token**: Add to `.env` for higher API rate limits (optional for public repos)
