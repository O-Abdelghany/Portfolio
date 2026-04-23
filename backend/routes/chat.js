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
    // Fetch relevant GitHub repo context for the message
    const repoSummary = await githubService.getRepoSummary(message);

    const reply = await geminiService.chat(message.trim(), repoSummary);
    return res.json({ reply, citations: [] });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(502).json({
      error: 'The AI agent is temporarily unavailable. Please try again shortly.',
    });
  }
});

export default router;
