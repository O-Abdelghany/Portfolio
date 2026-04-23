/**
 * animation.js — Neural Network canvas animation for the Hero section.
 */

export function initAnimation() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const NODE_COUNT = 60;
  const MAX_DIST = 150;
  const NODE_SPEED = 0.3;

  let nodes = [];
  let animFrameId = null;
  let running = false;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * NODE_SPEED,
      vy: (Math.random() - 0.5) * NODE_SPEED,
      r: Math.random() * 1.5 + 0.5,
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
      ctx.fill();
    });
  }

  function drawStatic() {
    drawFrame(); // single static snapshot
  }

  function loop() {
    drawFrame();
    animFrameId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    loop();
  }

  function stop() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    running = false;
    animFrameId = null;
  }

  // Init
  resize();
  createNodes();

  if (prefersReduced.matches) {
    drawStatic();
  } else {
    start();
  }

  // Respond to reduced-motion changes mid-session
  prefersReduced.addEventListener('change', (e) => {
    if (e.matches) {
      stop();
      drawStatic();
    } else {
      start();
    }
  });

  // Resize handler
  window.addEventListener('resize', () => {
    resize();
    createNodes();
    if (prefersReduced.matches) drawStatic();
  });
}
