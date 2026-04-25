import { Router } from 'express';
import * as geminiService from '../services/gemini.js';
import * as githubService from '../services/github.js';

const router = Router();

// POST /api/chat
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message is required and must be a non-empty string.' });
  }

  try {
    const repoSummary = await githubService.getRepoSummary(message);
    const reply = await geminiService.chat(message.trim(), repoSummary);
    return res.json({ reply, citations: [] });
  } catch (err) {
    console.error('Chat error:', err);
    // Detect quota exhaustion (Gemini returns 429 or RESOURCE_EXHAUSTED)
    const isQuota = err?.status === 429
      || err?.message?.includes('429')
      || err?.message?.includes('RESOURCE_EXHAUSTED')
      || err?.message?.includes('quota');
    return res.status(isQuota ? 429 : 502).json({
      error: isQuota
        ? 'Daily quota reached. The agent will be back tomorrow.'
        : 'The AI agent is temporarily unavailable. Please try again shortly.',
      code: isQuota ? 'QUOTA_EXCEEDED' : 'UNAVAILABLE',
    });
  }
});

export default router;
