import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/api/chat', chatRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Cache Gemini status for 60s to avoid burning quota on health polls
let geminiCache = { status: 'unknown', ts: 0 };

app.get('/health/full', async (_req, res) => {
  const now = Date.now();
  if (now - geminiCache.ts < 60000 && geminiCache.status !== 'unknown') {
    return res.status(geminiCache.status === 'quota' ? 429 : 200).json({ status: geminiCache.status });
  }
  try {
    const { chat } = await import('./services/gemini.js');
    await chat('hi');
    geminiCache = { status: 'online', ts: now };
    res.json({ status: 'online' });
  } catch (err) {
    const isQuota = err?.status === 429
      || err?.message?.includes('429')
      || err?.message?.includes('RESOURCE_EXHAUSTED')
      || err?.message?.includes('quota');
    geminiCache = { status: isQuota ? 'quota' : 'offline', ts: now };
    res.status(isQuota ? 429 : 502).json({ status: geminiCache.status });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
