import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chatRouter from './routes/chat.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app        = express();
const PORT       = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/api/chat', chatRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Admin logs viewer ─────────────────────────────────────────────────────────
app.get('/admin/logs', (req, res) => {
  if (!ADMIN_PASS || req.query.pass !== ADMIN_PASS) {
    return res.status(401).send('<h2>401 Unauthorized</h2><p>Set ADMIN_PASSWORD env var and add ?pass=YOUR_PASSWORD to the URL.</p>');
  }

  const logFile = join(__dirname, 'logs/conversations.jsonl');
  if (!existsSync(logFile)) {
    return res.send(adminHTML([], 0));
  }

  const lines = readFileSync(logFile, 'utf-8').trim().split('\n').filter(Boolean);
  const entries = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean).reverse();
  res.send(adminHTML(entries, lines.length));
});

function adminHTML(entries, total) {
  const rows = entries.map(e => {
    const statusColor = e.status === 'ok' ? '#22c55e' : e.status === 'quota' ? '#facc15' : '#ef4444';
    const date = new Date(e.ts).toLocaleString();
    return `
      <div style="background:#0f0f1a;border:1px solid #1e1e3a;border-radius:12px;padding:20px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
          <span style="color:#94a3b8;font-size:13px;font-family:monospace;">${date}</span>
          <div style="display:flex;gap:8px;align-items:center;">
            <span style="background:rgba(124,58,237,0.2);border:1px solid rgba(168,85,247,0.3);color:#c084fc;padding:2px 10px;border-radius:20px;font-size:12px;font-family:monospace;">${e.ms}ms</span>
            <span style="background:${statusColor}22;border:1px solid ${statusColor}55;color:${statusColor};padding:2px 10px;border-radius:20px;font-size:12px;font-family:monospace;">${e.status}</span>
          </div>
        </div>
        <div style="margin-bottom:10px;">
          <div style="color:#a855f7;font-size:11px;font-family:monospace;letter-spacing:0.1em;margin-bottom:4px;">QUESTION</div>
          <div style="color:#ffffff;font-size:14px;line-height:1.5;">${escHtml(e.question)}</div>
        </div>
        <div>
          <div style="color:#6b7280;font-size:11px;font-family:monospace;letter-spacing:0.1em;margin-bottom:4px;">ANSWER</div>
          <div style="color:#94a3b8;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escHtml(e.answer)}</div>
        </div>
      </div>`;
  }).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Omar Agent — Conversation Logs</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#080810;color:#fff;font-family:Inter,sans-serif;padding:24px;max-width:900px;margin:0 auto}</style>
  </head><body>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;flex-wrap:wrap;gap:12px;">
      <div>
        <h1 style="font-size:22px;font-weight:700;color:#a855f7;font-family:monospace;">omar-agent / logs</h1>
        <p style="color:#6b7280;font-size:13px;margin-top:4px;">${total} total conversations</p>
      </div>
      <a href="javascript:location.reload()" style="background:rgba(124,58,237,0.2);border:1px solid rgba(168,85,247,0.4);color:#c084fc;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-family:monospace;">↻ Refresh</a>
    </div>
    ${entries.length === 0 ? '<p style="color:#6b7280;text-align:center;padding:60px 0;">No conversations yet.</p>' : rows}
  </body></html>`;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
