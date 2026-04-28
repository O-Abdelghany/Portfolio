/**
 * status.js — Shared Gemini status state.
 * Updated by real chat requests only — zero quota cost from health polling.
 */

let current = 'online';

export function setGeminiStatus(status) {
  current = status;
}
