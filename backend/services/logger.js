/**
 * logger.js — Append-only conversation log to conversations.jsonl
 */
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_DIR  = join(__dirname, '../logs');
const LOG_FILE = join(LOG_DIR, 'conversations.jsonl');

// Ensure logs directory exists
if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

/**
 * @param {object} entry
 * @param {string} entry.question
 * @param {string} entry.answer
 * @param {number} entry.ms        - response time in ms
 * @param {'ok'|'quota'|'error'} entry.status
 */
export function logConversation({ question, answer, ms, status }) {
  const record = {
    ts:       new Date().toISOString(),
    question: question.slice(0, 500),   // cap at 500 chars
    answer:   answer.slice(0, 2000),    // cap at 2000 chars
    ms,
    status,
  };
  try {
    appendFileSync(LOG_FILE, JSON.stringify(record) + '\n', 'utf-8');
  } catch (e) {
    console.error('Logger write failed:', e.message);
  }
}
