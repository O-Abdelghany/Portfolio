/**
 * chat.js — AI Sandbox terminal chat logic with smooth real-time markdown typewriter.
 */

const API_URL = window.ENV?.API_URL || 'https://legendpanda-omar-portfolio-api.hf.space/api/chat';

export function initChat() {
  const log     = document.getElementById('chat-log');
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const prompts = document.querySelectorAll('.suggested-prompt');
  const statusDot  = document.getElementById('agent-status-dot');
  const statusText = statusDot?.nextElementSibling;

  if (!log || !input || !sendBtn) return;

  // ── Backend status with smart cold-start handling ────────────────────────
  let isFirstCheck = true;
  let startupTimer = null;
  const STARTUP_TIMEOUT = 45000; // 45s before showing "unavailable"

  function setStatus(state) {
    if (!statusDot || !statusText) return;
    const states = {
      online:      { dot: 'bg-green-500',  label: 'online',                cls: 'text-text-muted' },
      starting:    { dot: 'bg-yellow-400', label: 'starting up...',        cls: 'text-yellow-400' },
      quota:       { dot: 'bg-orange-400', label: 'quota reached · resets tomorrow', cls: 'text-orange-400' },
      unavailable: { dot: 'bg-red-500',    label: 'unavailable',           cls: 'text-red-400' },
    };
    const s = states[state] || states.unavailable;
    statusDot.className = 'w-2 h-2 rounded-full ' + s.dot + (state === 'starting' ? ' animate-pulse' : '');
    statusText.textContent = s.label;
    statusText.className = 'text-xs ' + s.cls;
  }

  function checkHealth() {
    fetch(API_URL.replace('/api/chat', '/health'))
      .then(r => {
        if (r.ok) {
          // Backend responded — clear startup timer, show online
          if (startupTimer) { clearTimeout(startupTimer); startupTimer = null; }
          setStatus('online');
          isFirstCheck = false;
        } else {
          if (isFirstCheck) setStatus('starting');
          else setStatus('unavailable');
        }
      })
      .catch(() => {
        if (isFirstCheck) setStatus('starting');
        else setStatus('unavailable');
      });
  }

  // Always start with "starting up..." on first load
  setStatus('starting');

  // After 45s with no response, give up and show unavailable
  startupTimer = setTimeout(() => {
    setStatus('unavailable');
    isFirstCheck = false;
  }, STARTUP_TIMEOUT);

  checkHealth();
  setInterval(checkHealth, 10000);

  prompts.forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.textContent.trim();
      input.focus();
      submit();
    });
  });

  sendBtn.addEventListener('click', submit);

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
        if (res.status === 429) setStatus('quota');
        else setStatus('unavailable');
        appendAgentBubble(err.error || 'Something went wrong. Please try again.', true);
      } else {
        const data = await res.json();
        setStatus('online');
        await typewriterBubble(data.reply || 'No response received.');
      }
    } catch {
      removeElement(indicator);
      setStatus('unavailable');
      appendAgentBubble('Connection error — backend may not be running. [Contact Omar directly](#contact)', true);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function appendUserBubble(text) {
    const div = document.createElement('div');
    div.className = 'flex gap-3 justify-end';
    const p = document.createElement('p');
    p.className = 'bg-accent/20 border border-accent/30 text-text-primary text-sm px-4 py-2 rounded-lg rounded-tr-sm max-w-xs sm:max-w-md leading-relaxed';
    p.textContent = text;
    const label = document.createElement('span');
    label.className = 'text-text-muted shrink-0 select-none text-sm';
    label.textContent = 'you$';
    div.appendChild(p);
    div.appendChild(label);
    log.appendChild(div);
    scrollToBottom();
  }

  // Tokenize raw markdown into atoms:
  // - markdown tokens (bold, links, bullets, URLs) = one atom each
  // - everything else = one character per atom
  function tokenize(text) {
    const atoms = [];
    let i = 0;
    while (i < text.length) {
      // Bold **...**
      if (text.startsWith('**', i)) {
        const end = text.indexOf('**', i + 2);
        if (end !== -1) {
          atoms.push(text.slice(i, end + 2));
          i = end + 2;
          continue;
        }
      }
      // Markdown link [...](...)
      if (text[i] === '[') {
        const closeBracket = text.indexOf(']', i);
        if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
          const closeParen = text.indexOf(')', closeBracket + 2);
          if (closeParen !== -1) {
            atoms.push(text.slice(i, closeParen + 1));
            i = closeParen + 1;
            continue;
          }
        }
      }
      // Raw URL https://...
      if (text.startsWith('https://', i) || text.startsWith('http://', i)) {
        const end = text.slice(i).search(/[\s,\)>]/);
        const urlEnd = end === -1 ? text.length : i + end;
        atoms.push(text.slice(i, urlEnd));
        i = urlEnd;
        continue;
      }
      // Plain character
      atoms.push(text[i]);
      i++;
    }
    return atoms;
  }

  // Smooth typewriter: one atom at a time, consistent speed
  async function typewriterBubble(rawText) {
    const div = document.createElement('div');
    div.className = 'flex gap-3';
    const prefix = document.createElement('span');
    prefix.className = 'text-accent-glow shrink-0 select-none text-sm';
    prefix.textContent = 'agent$';
    const p = document.createElement('p');
    p.className = 'text-text-muted text-sm leading-relaxed max-w-xs sm:max-w-lg';
    div.appendChild(prefix);
    div.appendChild(p);
    log.appendChild(div);
    scrollToBottom();

    const DELAY = 17; // ms per atom
    const CURSOR = '<span class="inline-block w-0.5 h-3.5 bg-accent-glow align-middle ml-px animate-blink"></span>';

    const atoms = tokenize(rawText);
    let built = '';

    await new Promise(resolve => {
      let idx = 0;
      function tick() {
        if (idx >= atoms.length) {
          p.innerHTML = parseMarkdown(rawText);
          scrollToBottom();
          return resolve();
        }
        built += atoms[idx];
        idx++;
        p.innerHTML = parseMarkdown(built) + CURSOR;
        scrollToBottom();
        setTimeout(tick, DELAY);
      }
      tick();
    });
  }

  function appendAgentBubble(text, isError) {
    const div = document.createElement('div');
    div.className = 'flex gap-3';
    const prefix = document.createElement('span');
    prefix.className = 'text-accent-glow shrink-0 select-none text-sm';
    prefix.textContent = 'agent$';
    const p = document.createElement('p');
    p.className = (isError ? 'text-red-400' : 'text-text-muted') + ' text-sm leading-relaxed max-w-xs sm:max-w-lg';
    p.innerHTML = parseMarkdown(text);
    div.appendChild(prefix);
    div.appendChild(p);
    log.appendChild(div);
    scrollToBottom();
  }

  function appendTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'flex gap-3 typing-indicator';
    const prefix = document.createElement('span');
    prefix.className = 'text-accent-glow shrink-0 select-none text-sm';
    prefix.textContent = 'agent$';
    const p = document.createElement('p');
    p.className = 'text-text-muted text-sm';
    p.innerHTML = '<span class="inline-block w-1.5 h-4 bg-accent-glow animate-blink align-middle"></span>';
    div.appendChild(prefix);
    div.appendChild(p);
    log.appendChild(div);
    scrollToBottom();
    return div;
  }

  function removeElement(el) { el?.parentNode?.removeChild(el); }
  function scrollToBottom() { log.scrollTop = log.scrollHeight; }

  function parseMarkdown(text) {
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // External markdown links [label](url)
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent-glow underline hover:text-white transition-colors duration-150 font-medium">$1 &#8599;</a>'
    );

    // Internal section links [label](#section)
    html = html.replace(
      /\[([^\]]+)\]\(#([^\s)]+)\)/g,
      '<a href="#$2" onclick="event.preventDefault();document.getElementById(\'$2\')?.scrollIntoView({behavior:\'smooth\'});" class="text-accent underline hover:text-accent-glow transition-colors duration-150 font-medium cursor-pointer">$1 &#8595;</a>'
    );

    // Raw URLs not already in an anchor
    html = html.replace(
      /(?<![="'>])(https?:\/\/[^\s<,\)&"]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-accent-glow underline hover:text-white transition-colors duration-150 break-all">$1 &#8599;</a>'
    );

    // Bold **text**
    html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

    // Italic *text*
    html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em class="italic opacity-80">$1</em>');

    // Bullet lines
    html = html.replace(
      /^[\*\-•]\s+(.+)$/gm,
      '<li class="flex gap-2 items-start my-0.5"><span class="text-accent shrink-0 mt-0.5">&#8250;</span><span>$1</span></li>'
    );

    // Wrap bullet lists
    const lines = html.split('\n');
    const out = [];
    let inList = false;
    for (const line of lines) {
      if (line.trimStart().startsWith('<li')) {
        if (!inList) { out.push('<ul class="space-y-1 my-2 ml-1">'); inList = true; }
        out.push(line);
      } else {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push(line);
      }
    }
    if (inList) out.push('</ul>');

    return out.join('<br/>').replace(/<br\/>\s*<ul/g, '<ul').replace(/<\/ul>\s*<br\/>/g, '</ul>');
  }
}
