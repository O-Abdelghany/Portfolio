import { Router } from 'express';
import * as geminiService from '../services/gemini.js';
import * as githubService from '../services/github.js';
import { logConversation } from '../services/logger.js';
import { setGeminiStatus } from '../services/status.js';

const router = Router();

// POST /api/chat
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message is required and must be a non-empty string.' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long. Please keep it under 1000 characters.' });
  }

  const start = Date.now();

  try {
    const repoSummary = await githubService.getRepoSummary(message);
    const reply = await geminiService.chat(message.trim(), repoSummary);
    const ms = Date.now() - start;
    logConversation({ question: message.trim(), answer: reply, ms, status: 'ok' });
    setGeminiStatus('online');
    return res.json({ reply });
  } catch (err) {
    const ms = Date.now() - start;
    const isQuota = err?.status === 429
      || err?.message?.includes('429')
      || err?.message?.includes('RESOURCE_EXHAUSTED')
      || err?.message?.includes('quota');
    const status = isQuota ? 'quota' : 'error';
    const errorMsg = isQuota
      ? 'Daily quota reached. The agent will be back tomorrow.'
      : 'The AI agent is temporarily unavailable. Please try again shortly.';
    logConversation({ question: message.trim(), answer: errorMsg, ms, status });
    setGeminiStatus(isQuota ? 'quota' : 'offline');
    return res.status(isQuota ? 429 : 502).json({
      error: errorMsg,
      code: isQuota ? 'QUOTA_EXCEEDED' : 'UNAVAILABLE',
    });
  }
});

export default router;
