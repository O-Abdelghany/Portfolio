import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const knowledgeText = readFileSync(join(__dirname, '../context/knowledge.txt'), 'utf-8');

// Lazy-init so dotenv has time to load before we read the API key
let genAI = null;
function getClient() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is not set in environment variables.');
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

/**
 * Send a message to Gemini 1.5 Flash with Omar's knowledge context as system prompt.
 * @param {string} message - The recruiter's message
 * @param {string} [repoSummary=''] - Optional GitHub repo context
 * @returns {Promise<string>} The model's text response
 */
export async function chat(message, repoSummary = '') {
  const systemPrompt = [knowledgeText, repoSummary].filter(Boolean).join('\n\n');

  const model = getClient().getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(message);
  const text = result.response.text();

  if (!text) throw new Error('Empty response from Gemini');
  return text;
}
