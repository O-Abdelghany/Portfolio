/**
 * status.js — Shared Gemini status state.
 * Updated by real chat requests, read by /health/full.
 * Zero quota cost — no Gemini calls from health polling.
 */

let current = 'online';

export function getGeminiStatus() {
  return current;
}

export function setGeminiStatus(status) {
  current = status;
}
