/**
 * chat.js — AI Sandbox terminal chat logic.
 */

// Point this at your backend. Change to your deployed URL in production.
const API_URL = window.ENV?.API_URL || 'http://localhost:3000/api/chat';

export function initChat() {
  const log      = document.getElementById('chat-log');
  const input    = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send');
  const prompts  = document.querySelectorAll('.suggested-prompt');

  if (!log || !input || !sendBtn) return;

  // Suggested prompt chips
  prompts.forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.textContent.trim();
      input.focus();
      submit();
    });
  });

  // Send on button click
  sendBtn.addEventListener('click', submit);

  // Send on Enter, newline on Shift+Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });

  async function submit() {
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    sendBtn.disabled = true;

    appendUserBubble(message);
    const indicator = appendTypingIndicator();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      removeElement(indicator);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        appendAgentBubble(err.error || 'Something went wrong. Please try again.', true);
      } else {
        const data = await res.json();
        appendAgentBubble(data.reply || 'No response received.');
      }
    } catch {
      removeElement(indicator);
      appendAgentBubble(
        'Connection error. Please check that the backend is running, or <a href="#contact" class="text-accent-glow underline">contact Omar directly</a>.',
        true
      );
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function appendUserBubble(text) {
    const div = document.createElement('div');
    div.className = 'flex gap-3 justify-end';
    div.innerHTML = `
      <p class="bg-accent/20 border border-accent/30 text-text-primary text-sm px-4 py-2 rounded-lg rounded-tr-sm max-w-xs sm:max-w-md leading-relaxed">${escapeHtml(text)}</p>
      <span class="text-text-muted shrink-0 select-none text-sm">you$</span>
    `;
    log.appendChild(div);
    scrollToBottom();
  }

  function appendAgentBubble(text, isError = false) {
    const div = document.createElement('div');
    div.className = 'flex gap-3';
    const colorClass = isError ? 'text-red-400' : 'text-text-muted';
    div.innerHTML = `
      <span class="text-accent-glow shrink-0 select-none text-sm">agent$</span>
      <p class="${colorClass} text-sm leading-relaxed max-w-xs sm:max-w-lg">${parseMarkdown(text)}</p>
    `;
    log.appendChild(div);
    scrollToBottom();
  }

  function appendTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'flex gap-3 typing-indicator';
    div.innerHTML = `
      <span class="text-accent-glow shrink-0 select-none text-sm">agent$</span>
      <p class="text-text-muted text-sm">
        <span class="inline-block w-1.5 h-4 bg-accent-glow animate-blink align-middle"></span>
      </p>
    `;
    log.appendChild(div);
    scrollToBottom();
    return div;
  }

  function removeElement(el) {
    el?.parentNode?.removeChild(el);
  }

  function scrollToBottom() {
    log.scrollTop = log.scrollHeight;
  }

  // Convert markdown links [label](url) to <a> tags, and escape everything else
  function parseMarkdown(text) {
    const escaped = escapeHtml(text);
    // Restore links after escaping (we need to handle the URL carefully)
    return escaped.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent-glow underline hover:text-white transition-colors duration-150">$1</a>'
    );
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
