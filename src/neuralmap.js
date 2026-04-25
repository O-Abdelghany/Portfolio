// Enhanced Neural Map v11

// SVG icon paths (24x24 viewBox, stroke-based)
const ICONS = {
  python:  'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  ai:      'M12 2a2 2 0 012 2v1h3a2 2 0 012 2v3h1a2 2 0 010 4h-1v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3H4a2 2 0 010-4h1V7a2 2 0 012-2h3V4a2 2 0 012-2zm-2 9a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z',
  rag:     'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  cv:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  data:    'M18 20V10M12 20V4M6 20v-6',
  backend: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
};

const PROJ_ICONS = {
  'hr-agent':    'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 0l2 2 4-4',
  'face-detect': 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  'cardio':      'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  'uber':        'M18 20V10M12 20V4M6 20v-6',
  'portfolio':   'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0c-2 3-3 6.5-3 10s1 7 3 10m0-20c2 3 3 6.5 3 10s-1 7-3 10M2 12h20',
};

const INPUT_NODES = [
  { id: 'python',  label: 'Python',       icon: ICONS.python  },
  { id: 'ai',      label: 'Deep Learning',icon: ICONS.ai      },
  { id: 'rag',     label: 'RAG / LLMs',   icon: ICONS.rag     },
  { id: 'cv',      label: 'Comp. Vision', icon: ICONS.cv      },
  { id: 'data',    label: 'Data Science', icon: ICONS.data    },
  { id: 'backend', label: 'Backend',      icon: ICONS.backend },
];

const PROJECT_NODES = [
  { id: 'hr-agent', label: 'HR Agent', neuron: '2.1', tag: 'RAG / AI',
    desc: 'RAG pipeline with ChromaDB & all-MiniLM-L6-v2 for semantic candidate ranking. DistilBERT sentiment analysis + OCR engine.',
    skills: ['python', 'rag', 'ai'], url: 'https://github.com/O-Abdelghany/intelligent-hr-agent' },
  { id: 'face-detect', label: 'Face Attendance', neuron: '2.2', tag: 'Computer Vision',
    desc: 'Real-time face detection attendance system using OpenCV & FastAPI with React dashboard for live data visualization.',
    skills: ['python', 'cv', 'backend'], url: 'https://github.com/O-Abdelghany/AIdentify-ERP' },
  { id: 'cardio', label: 'Cardio Predictor', neuron: '2.3', tag: 'ML / Data Science',
    desc: '94% accuracy KNN model with SMOTE balancing and RobustScaler. Benchmarked 7 algorithms for production-grade pipeline.',
    skills: ['python', 'ai', 'data'], url: 'https://github.com/O-Abdelghany/cardiovascular-health-predictor' },
  { id: 'uber', label: 'Uber Analytics', neuron: '2.4', tag: 'Data Science',
    desc: 'EDA & statistical analysis on ride data. Cancellation root-cause analysis via interactive Power BI dashboard.',
    skills: ['python', 'data'], url: 'https://github.com/O-Abdelghany/uber-data-analytics' },
  { id: 'portfolio', label: 'Portfolio Agent', neuron: '2.5', tag: 'Agentic AI',
    desc: 'Recruiter co-pilot powered by Gemini 1.5 Flash with deep-linked citations and semantic search across projects.',
    skills: ['python', 'rag', 'backend'], url: 'https://github.com/O-Abdelghany/Portfolio.git' },
];

const OUTPUT_URL = 'https://github.com/O-Abdelghany';
const VH = 780;
const INPUT_X = 120, HIDDEN_X = 500, OUTPUT_X = 880;
const NODE_R = 54, INPUT_R = 36, OUTPUT_R = 56;
const Out_Y = VH / 2;
const OUT_Y = VH / 2;

function inputY(i) {
  const spacing = (VH - 220) / (INPUT_NODES.length - 1);
  return 110 + i * spacing;
}

function projectPos(id) {
  const idx = PROJECT_NODES.findIndex(p => p.id === id);
  const spacing = (VH - 220) / (PROJECT_NODES.length - 1);
  return { x: HIDDEN_X, y: 110 + idx * spacing };
}

function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function bezierPath(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const cx1 = x1 + dx * 0.4, cy1 = y1 + dy * 0.1;
  const cx2 = x1 + dx * 0.6, cy2 = y2 - dy * 0.1;
  return `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
}

function getPathLength(path) {
  return path.getTotalLength ? path.getTotalLength() : 0;
}

function getPointAtLength(path, length) {
  return path.getPointAtLength ? path.getPointAtLength(length) : { x: 0, y: 0 };
}

export function initNeuralMap() {
  try { initDesktop(); } catch(e) { /* silent fail — page still works */ }
  try { initMobile();  } catch(e) { /* silent fail — page still works */ }
}

function initDesktop() {
  const svg = document.getElementById('neural-svg');
  const connGroup = document.getElementById('neural-connections');
  const nodeGroup = document.getElementById('neural-nodes');
  const packetGroup = document.getElementById('neural-packets');
  const tooltip = document.getElementById('neural-tooltip');
  if (!svg || !connGroup || !nodeGroup) return;

  const connMap = {}, packets = [];

  // Draw input → project connections
  PROJECT_NODES.forEach(function(proj) {
    const pp = projectPos(proj.id);
    proj.skills.forEach(function(skillId) {
      const iIdx = INPUT_NODES.findIndex(function(n) { return n.id === skillId; });
      if (iIdx === -1) return;
      const iy = inputY(iIdx);
      const path = svgEl('path', {
        d: bezierPath(INPUT_X + INPUT_R, iy, pp.x - NODE_R, pp.y),
        stroke: 'rgba(124,58,237,0.25)', 'stroke-width': '1.8',
        fill: 'none', 'stroke-linecap': 'round',
      });
      path.dataset.proj = proj.id;
      path.dataset.skill = skillId;
      connGroup.appendChild(path);
      connMap[skillId + '-' + proj.id] = path;
    });
  });

  // Project → output connections — drawn in separate top-layer group so nodes don't cover them
  const outConnGroup = document.getElementById('neural-out-connections');
  PROJECT_NODES.forEach(function(proj) {
    const pp = projectPos(proj.id);
    const path = svgEl('path', {
      d: bezierPath(pp.x + NODE_R, pp.y, OUTPUT_X - OUTPUT_R, OUT_Y),
      stroke: 'rgba(124,58,237,0.25)', 'stroke-width': '1.8',
      fill: 'none', 'stroke-linecap': 'round',
    });
    path.dataset.outProj = proj.id;
    if (outConnGroup) outConnGroup.appendChild(path);
    else connGroup.appendChild(path);
  });

  // Labels
  [
    { x: INPUT_X, text: 'Input Layer', sub: '(Core Skills)' },
    { x: HIDDEN_X, text: 'Hidden Layer', sub: '(AI Projects)' },
    { x: OUTPUT_X, text: 'Output Layer', sub: '(Portfolio)' },
  ].forEach(function(lbl) {
    const t1 = svgEl('text', { x: lbl.x, y: 18, 'text-anchor': 'middle', fill: '#ffffff', 'font-size': '13', 'font-weight': '600', 'font-family': 'Space Grotesk,Inter,sans-serif', opacity: '0.9', 'letter-spacing': '0.02em', class: 'layer-label-main' });
    t1.textContent = lbl.text;
    const t2 = svgEl('text', { x: lbl.x, y: 33, 'text-anchor': 'middle', fill: '#6b7280', 'font-size': '9', 'font-family': 'JetBrains Mono,monospace', opacity: '0.8', 'letter-spacing': '0.04em', class: 'layer-label-sub' });
    t2.textContent = lbl.sub;
    nodeGroup.appendChild(t1);
    nodeGroup.appendChild(t2);
  });

  // Input nodes
  INPUT_NODES.forEach(function(node, i) {
    const cy = inputY(i);
    const g = svgEl('g');
    g.style.transition = 'all 0.3s ease';

    const outerRing = svgEl('circle', { cx: INPUT_X, cy: cy, r: INPUT_R + 5, fill: 'none', stroke: 'rgba(124,58,237,0.3)', 'stroke-width': '1', opacity: '0' });
    outerRing.dataset.outerRing = node.id;

    const circle = svgEl('circle', { cx: INPUT_X, cy: cy, r: INPUT_R, fill: 'url(#node-gradient-input)', stroke: 'rgba(124,58,237,0.7)', 'stroke-width': '2.5' });
    circle.dataset.inputId = node.id;

    const innerRing = svgEl('circle', { cx: INPUT_X, cy: cy, r: INPUT_R - 7, fill: 'none', stroke: 'rgba(168,85,247,0.4)', 'stroke-width': '1.5' });

    // SVG icon centered in node
    const scale = 0.75;
    const iconSize = 24 * scale; // = 18
    const iconG = svgEl('g', {
      transform: 'translate(' + (INPUT_X - iconSize / 2) + ',' + (cy - iconSize / 2) + ') scale(' + scale + ')',
    });
    const iconPath = svgEl('path', {
      d: node.icon,
      fill: 'none', stroke: 'rgba(192,132,252,0.9)',
      'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    });
    iconG.appendChild(iconPath);

    // Label below node
    const label = svgEl('text', {
      x: INPUT_X, y: cy + INPUT_R + 15,
      'text-anchor': 'middle', fill: '#94a3b8',
      'font-size': '14', 'font-family': 'Space Grotesk,Inter,sans-serif',
      'font-weight': '500', 'letter-spacing': '0.02em',
    });
    label.dataset.inputLabel = node.id;
    label.textContent = node.label;

    g.appendChild(outerRing);
    g.appendChild(circle);
    g.appendChild(innerRing);
    g.appendChild(iconG);
    g.appendChild(label);
    nodeGroup.appendChild(g);
  });

  // Project nodes
  PROJECT_NODES.forEach(function(proj) {
    const pos = projectPos(proj.id);
    const x = pos.x, y = pos.y;
    const g = svgEl('g');
    g.style.cursor = 'pointer';
    g.dataset.projId = proj.id;

    // ── C: Activation ring — expands outward on hover ──────────────────────
    const activationRing = svgEl('circle', {
      cx: x, cy: y, r: NODE_R + 2,
      fill: 'none', stroke: 'rgba(192,132,252,0)',
      'stroke-width': '2', opacity: '0',
    });
    activationRing.dataset.activationRing = proj.id;

    // ── A: 6 micro-spikes — hidden at rest, appear on hover ────────────────
    const NUM_PROJ_SPIKES = 6;
    const projSpikes = [];
    for (let i = 0; i < NUM_PROJ_SPIKES; i++) {
      const angle = (i / NUM_PROJ_SPIKES) * Math.PI * 2 - Math.PI / 2;
      const spike = svgEl('line', {
        x1: x + Math.cos(angle) * (NODE_R + 2),
        y1: y + Math.sin(angle) * (NODE_R + 2),
        x2: x + Math.cos(angle) * (NODE_R + 2),
        y2: y + Math.sin(angle) * (NODE_R + 2),
        stroke: 'rgba(192,132,252,0)', 'stroke-width': '1.5',
        'stroke-linecap': 'round',
      });
      spike.dataset.projSpike = proj.id + '-' + i;
      g.appendChild(spike);
      projSpikes.push({ el: spike, angle: angle });
    }

    const outerGlow = svgEl('circle', { cx: x, cy: y, r: NODE_R + 10, fill: 'rgba(168,85,247,0.2)', opacity: '0' });
    outerGlow.dataset.outerGlow = proj.id;

    const circle = svgEl('circle', { cx: x, cy: y, r: NODE_R, fill: 'url(#node-gradient-project)', stroke: '#a855f7', 'stroke-width': '2.5' });
    circle.dataset.projCircle = proj.id;

    g.appendChild(activationRing);
    g.appendChild(outerGlow);
    g.appendChild(circle);
    const nameTxt = svgEl('text', {
      x: x, y: y + 10, 'text-anchor': 'middle',
      fill: '#c084fc', 'font-size': '9', 'font-weight': '700',
      'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '0.08em',
    });
    const words = proj.label.split(' ');
    if (words.length <= 2) {
      nameTxt.textContent = proj.label;
    } else {
      const mid = Math.ceil(words.length / 2);
      const sp1 = svgEl('tspan', { x: x, dy: '-5' });
      sp1.textContent = words.slice(0, mid).join(' ');
      const sp2 = svgEl('tspan', { x: x, dy: '11' });
      sp2.textContent = words.slice(mid).join(' ');
      nameTxt.appendChild(sp1);
      nameTxt.appendChild(sp2);
    }

    const numTxt = svgEl('text', { x: x, y: y + 64, 'text-anchor': 'middle', fill: '#6b7280', 'font-size': '11', 'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '0.05em' });
    numTxt.textContent = 'Neuron ' + proj.neuron;

    g.appendChild(activationRing);
    g.appendChild(outerGlow);
    g.appendChild(circle);
    const iconPathStr = PROJ_ICONS[proj.id];
    if (iconPathStr) {
      const iconG = svgEl('g', { transform: 'translate(' + (x - 9) + ',' + (y - 24) + ') scale(0.75)' });
      const ip = svgEl('path', { d: iconPathStr, fill: 'none', stroke: 'rgba(192,132,252,0.85)', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      iconG.appendChild(ip);
      g.appendChild(iconG);
    }
    g.appendChild(nameTxt);
    g.appendChild(numTxt);
    nodeGroup.appendChild(g);

    // Spike + ring animation state
    let spikeAnimFrame = null;
    let spikeT = 0;

    function startActivation() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      spikeT = 0;
      let ringR = NODE_R + 2;

      function animateActivation() {
        spikeT += 0.025;

        // C: Activation ring expands outward and fades
        ringR += 0.4;
        const ringOpacity = Math.max(0, 0.8 - (ringR - NODE_R - 2) / 30);
        activationRing.setAttribute('r', ringR.toFixed(1));
        activationRing.setAttribute('opacity', ringOpacity.toFixed(3));
        activationRing.setAttribute('stroke', 'rgba(192,132,252,' + ringOpacity.toFixed(3) + ')');
        if (ringR > NODE_R + 32) { ringR = NODE_R + 2; } // loop ring

        // A: Micro-spikes grow out and pulse
        projSpikes.forEach(function(s, i) {
          const phase = spikeT + i * (Math.PI / 3);
          const len = 8 + 5 * Math.sin(phase);
          const alpha = (0.5 + 0.4 * Math.sin(phase)).toFixed(3);
          s.el.setAttribute('x2', x + Math.cos(s.angle) * (NODE_R + 2 + len));
          s.el.setAttribute('y2', y + Math.sin(s.angle) * (NODE_R + 2 + len));
          s.el.setAttribute('stroke', 'rgba(192,132,252,' + alpha + ')');
        });

        spikeAnimFrame = requestAnimationFrame(animateActivation);
      }
      spikeAnimFrame = requestAnimationFrame(animateActivation);
    }

    function stopActivation() {
      if (spikeAnimFrame) cancelAnimationFrame(spikeAnimFrame);
      // Reset spikes to invisible
      projSpikes.forEach(function(s) {
        s.el.setAttribute('x2', s.el.getAttribute('x1'));
        s.el.setAttribute('y2', s.el.getAttribute('y1'));
        s.el.setAttribute('stroke', 'rgba(192,132,252,0)');
      });
      activationRing.setAttribute('opacity', '0');
    }

    g.addEventListener('mouseenter', function(e) {
      highlight(proj, true);
      showTip(e, proj);
      startPackets(proj);
      startActivation();
    });
    g.addEventListener('mousemove', moveTip);
    g.addEventListener('mouseleave', function() {
      highlight(proj, false);
      hideTip();
      stopPackets(proj);
      stopActivation();
    });
    g.addEventListener('click', function() { window.open(proj.url, '_blank', 'noopener,noreferrer'); });
  });

  // Output node — pulsing concentric rings design
  const outG = svgEl('g');
  outG.style.cursor = 'pointer';

  // Radial burst spikes (8 spikes radiating outward)
  const NUM_SPIKES = 8;
  const spikes = [];
  for (let i = 0; i < NUM_SPIKES; i++) {
    const angle = (i / NUM_SPIKES) * Math.PI * 2;
    const x1 = OUTPUT_X + Math.cos(angle) * (OUTPUT_R + 4);
    const y1 = OUT_Y   + Math.sin(angle) * (OUTPUT_R + 4);
    const x2 = OUTPUT_X + Math.cos(angle) * (OUTPUT_R + 18);
    const y2 = OUT_Y   + Math.sin(angle) * (OUTPUT_R + 18);
    const spike = svgEl('line', {
      x1: x1, y1: y1, x2: x2, y2: y2,
      stroke: 'rgba(168,85,247,0.5)', 'stroke-width': '1.5',
      'stroke-linecap': 'round',
    });
    outG.appendChild(spike);
    spikes.push(spike);
  }

  // Outer glow halo
  const outGlow = svgEl('circle', {
    cx: OUTPUT_X, cy: OUT_Y, r: OUTPUT_R + 6,
    fill: 'rgba(109,40,217,0.18)', filter: 'url(#glow-output)',
  });

  // Single clean main circle
  const outCircle = svgEl('circle', {
    cx: OUTPUT_X, cy: OUT_Y, r: OUTPUT_R,
    fill: 'url(#node-gradient-output)',
    stroke: '#a855f7', 'stroke-width': '2.5',
  });

  // GitHub icon centered (SVG path, 24x24 scaled and centered)
  const ghScale = 0.9;
  const ghSize  = 24 * ghScale;
  const ghG = svgEl('g', {
    transform: 'translate(' + (OUTPUT_X - ghSize / 2) + ',' + (OUT_Y - ghSize / 2 - 8) + ') scale(' + ghScale + ')',
  });
  const ghPath = svgEl('path', {
    d: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z',
    fill: 'rgba(192,132,252,0.85)',
  });
  ghG.appendChild(ghPath);

  // Label below icon
  const outLabel = svgEl('text', {
    x: OUTPUT_X, y: OUT_Y + 22,
    'text-anchor': 'middle', fill: '#c084fc',
    'font-size': '8', 'font-weight': '700',
    'font-family': 'JetBrains Mono,monospace', 'letter-spacing': '0.1em',
  });
  outLabel.textContent = 'PORTFOLIO';

  outG.appendChild(outGlow);
  outG.appendChild(outCircle);
  outG.appendChild(ghG);
  outG.appendChild(outLabel);
  nodeGroup.appendChild(outG);

  // Idle animation — spikes pulse + glow breathes
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let t = 0;
    (function idlePulse() {
      t += 0.025;
      const glowA = (0.15 + 0.1 * Math.sin(t)).toFixed(3);
      outGlow.setAttribute('fill', 'rgba(109,40,217,' + glowA + ')');
      // Spikes breathe in length
      spikes.forEach(function(spike, i) {
        const phase = t + i * (Math.PI * 2 / NUM_SPIKES);
        const len = 14 + 6 * Math.sin(phase * 0.9);
        const angle = (i / NUM_SPIKES) * Math.PI * 2;
        spike.setAttribute('x2', OUTPUT_X + Math.cos(angle) * (OUTPUT_R + 4 + len));
        spike.setAttribute('y2', OUT_Y   + Math.sin(angle) * (OUTPUT_R + 4 + len));
        const a = (0.35 + 0.25 * Math.sin(phase * 0.9)).toFixed(3);
        spike.setAttribute('stroke', 'rgba(168,85,247,' + a + ')');
      });
      requestAnimationFrame(idlePulse);
    })();
  }

  // Hover
  outG.addEventListener('mouseenter', function() {
    outCircle.setAttribute('stroke', '#c084fc');
    outCircle.setAttribute('stroke-width', '3.5');
    outCircle.setAttribute('filter', 'url(#glow-strong)');
    ghPath.setAttribute('fill', 'rgba(255,255,255,0.95)');
    spikes.forEach(function(s) { s.setAttribute('stroke', 'rgba(192,132,252,0.9)'); s.setAttribute('stroke-width', '2'); });
    const allOutLines = svg.querySelectorAll('[data-out-proj]');
    allOutLines.forEach(function(line) {
      line.setAttribute('stroke', 'rgba(168,85,247,0.85)');
      line.setAttribute('stroke-width', '3');
      const d = line.getAttribute('d') || '';
      const pts = d.match(/[\d.]+/g);
      const dy = pts && pts.length >= 4 ? Math.abs(parseFloat(pts[1]) - parseFloat(pts[pts.length - 1])) : 99;
      if (dy > 10) line.setAttribute('filter', 'url(#glow-soft)');
    });
    PROJECT_NODES.forEach(function(proj) {
      const c = svg.querySelector('[data-proj-circle="' + proj.id + '"]');
      if (c) { c.setAttribute('stroke', '#a855f7'); c.setAttribute('stroke-width', '3'); }
    });
    startOutputPackets();
  });

  outG.addEventListener('mouseleave', function() {
    outCircle.setAttribute('stroke', '#a855f7');
    outCircle.setAttribute('stroke-width', '2.5');
    outCircle.removeAttribute('filter');
    ghPath.setAttribute('fill', 'rgba(192,132,252,0.85)');
    spikes.forEach(function(s) { s.setAttribute('stroke', 'rgba(168,85,247,0.5)'); s.setAttribute('stroke-width', '1.5'); });
    const allOutLines = svg.querySelectorAll('[data-out-proj]');
    allOutLines.forEach(function(line) {
      line.setAttribute('stroke', 'rgba(124,58,237,0.18)');
      line.setAttribute('stroke-width', '1.5');
      line.removeAttribute('filter');
    });
    PROJECT_NODES.forEach(function(proj) {
      const c = svg.querySelector('[data-proj-circle="' + proj.id + '"]');
      if (c) { c.setAttribute('stroke', 'rgba(124,58,237,0.6)'); c.setAttribute('stroke-width', '2.5'); }
    });
    stopOutputPackets();
  });

  // Click — ripple burst then open GitHub
  outG.addEventListener('click', function() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Create 3 ripple rings that expand and fade
      [0, 150, 300].forEach(function(delay) {
        setTimeout(function() {
          const ripple = svgEl('circle', {
            cx: OUTPUT_X, cy: OUT_Y, r: OUTPUT_R,
            fill: 'none', stroke: 'rgba(168,85,247,0.8)', 'stroke-width': '3',
          });
          nodeGroup.appendChild(ripple);
          let r = OUTPUT_R, opacity = 0.8;
          (function expand() {
            r += 3; opacity -= 0.025;
            if (opacity <= 0) { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); return; }
            ripple.setAttribute('r', r);
            ripple.setAttribute('stroke', 'rgba(168,85,247,' + opacity.toFixed(3) + ')');
            requestAnimationFrame(expand);
          })();
        }, delay);
      });
    }
    setTimeout(function() { window.open(OUTPUT_URL, '_blank', 'noopener,noreferrer'); }, 400);
  });

  // Output hover packets — all project nodes fire toward output simultaneously
  const outputPackets = [];

  function startOutputPackets() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    PROJECT_NODES.forEach(function(proj, i) {
      const line = svg.querySelector('[data-out-proj="' + proj.id + '"]');
      if (!line) return;
      const len = getPathLength(line);
      if (len === 0) return;

      // All packets start at the same position — fully synced
      let progress = 0;
      const packet = svgEl('circle', { r: '6', fill: 'url(#packet-gradient)', filter: 'url(#glow-packet)', opacity: '0' });
      packet.dataset.outputPacket = proj.id;
      if (packetGroup) packetGroup.appendChild(packet);
      outputPackets.push(packet);
      function animate() {
        if (!packet.parentNode) return;
        progress += 0.005;
        if (progress > 1) progress = 0;
        const pt = getPointAtLength(line, progress * len);
        packet.setAttribute('cx', pt.x);
        packet.setAttribute('cy', pt.y);
        packet.setAttribute('opacity', Math.sin(progress * Math.PI) * 1.0);
        packet._animFrame = requestAnimationFrame(animate);
      }
      packet._animFrame = requestAnimationFrame(animate);
    });
  }

  function stopOutputPackets() {
    outputPackets.forEach(function(p) {
      if (p._animFrame) cancelAnimationFrame(p._animFrame);
      if (p.parentNode) p.parentNode.removeChild(p);
    });
    outputPackets.length = 0;
  }

  // Highlight function
  function highlight(proj, on) {
    const c = svg.querySelector('[data-proj-circle="' + proj.id + '"]');
    const glow = svg.querySelector('[data-outer-glow="' + proj.id + '"]');
    if (c) {
      c.setAttribute('stroke', on ? '#c084fc' : 'rgba(124,58,237,0.6)');
      c.setAttribute('stroke-width', on ? '3.5' : '2.5');
      if (on) c.setAttribute('filter', 'url(#glow-strong)');
      else c.removeAttribute('filter');
    }
    if (glow) glow.setAttribute('opacity', on ? '1' : '0');

    proj.skills.forEach(function(skillId) {
      const line = connMap[skillId + '-' + proj.id];
      if (line) {
        line.setAttribute('stroke', on ? 'rgba(168,85,247,0.9)' : 'rgba(124,58,237,0.45)');
        line.setAttribute('stroke-width', on ? '3' : '1.8');
        if (on) {
          // Skip glow filter on near-horizontal lines — it clips them to invisible
          const d = line.getAttribute('d') || '';
          const pts = d.match(/[0-9.-]+/g);
          const dy = pts && pts.length >= 4 ? Math.abs(parseFloat(pts[1]) - parseFloat(pts[pts.length - 1])) : 99;
          if (dy > 15) line.setAttribute('filter', 'url(#glow-soft)');
        } else {
          line.removeAttribute('filter');
        }
      }
      const ic = svg.querySelector('[data-input-id="' + skillId + '"]');
      const ring = svg.querySelector('[data-outer-ring="' + skillId + '"]');
      if (ic) {
        ic.setAttribute('stroke', on ? '#c084fc' : 'rgba(124,58,237,0.7)');
        ic.setAttribute('stroke-width', on ? '3.5' : '2.5');
        if (on) ic.setAttribute('filter', 'url(#glow-soft)');
        else ic.removeAttribute('filter');
      }
      if (ring) ring.setAttribute('opacity', on ? '1' : '0');
      const il = svg.querySelector('[data-input-label="' + skillId + '"]');
      if (il) il.setAttribute('fill', on ? '#ffffff' : '#94a3b8');
    });

    const outLine = svg.querySelector('[data-out-proj="' + proj.id + '"]');
    if (outLine) {
      outLine.setAttribute('stroke', on ? 'rgba(168,85,247,0.6)' : 'rgba(124,58,237,0.18)');
      outLine.setAttribute('stroke-width', on ? '2.5' : '1.5');
    }
  }

  function startPackets(proj) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const speed = 0.006;
    let cycleComplete = false; // becomes true when input packets finish first pass

    // Input → project packets
    proj.skills.forEach(function(skillId) {
      const line = connMap[skillId + '-' + proj.id];
      if (!line) return;
      const len = getPathLength(line);
      if (len === 0) return;

      const packet = svgEl('circle', { r: '6', fill: 'url(#packet-gradient)', filter: 'url(#glow-packet)', opacity: '0' });
      packet.dataset.packetId = skillId + '-' + proj.id;
      if (packetGroup) packetGroup.appendChild(packet);

      let progress = 0;
      function animate() {
        if (!packet.parentNode) return;
        progress += speed;
        if (progress >= 1) {
          progress = 0;
          cycleComplete = true; // signal output packet to start
        }
        const pt = getPointAtLength(line, progress * len);
        packet.setAttribute('cx', pt.x);
        packet.setAttribute('cy', pt.y);
        packet.setAttribute('opacity', Math.sin(progress * Math.PI) * 1.0);
        packet._animFrame = requestAnimationFrame(animate);
      }
      packet._animFrame = requestAnimationFrame(animate);
      packets.push(packet);
    });

    // Project → output packet — only moves after input packets complete one cycle
    const outLine = svg.querySelector('[data-out-proj="' + proj.id + '"]');
    if (outLine) {
      const len = getPathLength(outLine);
      if (len > 0) {
        const outPacket = svgEl('circle', { r: '6', fill: 'url(#packet-gradient)', filter: 'url(#glow-packet)', opacity: '0' });
        outPacket.dataset.packetId = 'out-' + proj.id;
        if (packetGroup) packetGroup.appendChild(outPacket);

        let progress = 0;
        let started = false;
        function animateOut() {
          if (!outPacket.parentNode) return;
          // Wait for input cycle to complete before starting
          if (!cycleComplete && !started) {
            outPacket._animFrame = requestAnimationFrame(animateOut);
            return;
          }
          started = true;
          progress += speed;
          if (progress >= 1) progress = 0;
          const pt = getPointAtLength(outLine, progress * len);
          outPacket.setAttribute('cx', pt.x);
          outPacket.setAttribute('cy', pt.y);
          outPacket.setAttribute('opacity', Math.sin(progress * Math.PI) * 1.0);
          outPacket._animFrame = requestAnimationFrame(animateOut);
        }
        outPacket._animFrame = requestAnimationFrame(animateOut);
        packets.push(outPacket);
      }
    }
  }

  function stopPackets(proj) {
    const ids = proj.skills.map(function(s) { return s + '-' + proj.id; });
    ids.push('out-' + proj.id);
    packets.forEach(function(p) {
      if (ids.indexOf(p.dataset.packetId) !== -1) {
        if (p._animFrame) cancelAnimationFrame(p._animFrame);
        if (p.parentNode) p.parentNode.removeChild(p);
      }
    });
    // Clean up array
    for (let i = packets.length - 1; i >= 0; i--) {
      if (ids.indexOf(packets[i].dataset.packetId) !== -1) packets.splice(i, 1);
    }
  }

  // Re-color dynamic SVG elements on light/dark mode toggle
  new MutationObserver(function() {
    const isLight = document.body.classList.contains('light-mode');
    connGroup.querySelectorAll('path').forEach(function(p) {
      if (p.dataset.outProj) p.setAttribute('stroke', isLight ? 'rgba(109,40,217,0.35)' : 'rgba(124,58,237,0.18)');
      else p.setAttribute('stroke', isLight ? 'rgba(109,40,217,0.4)' : 'rgba(124,58,237,0.45)');
    });
    svg.querySelectorAll('[data-input-label]').forEach(function(t) {
      t.setAttribute('fill', isLight ? '#5b21b6' : '#94a3b8');
    });
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Tooltip
  const container = document.getElementById('neural-desktop');
  const ttIcon = document.getElementById('tt-icon');
  const ttTitle = document.getElementById('tt-title');
  const ttTag = document.getElementById('tt-tag');
  const ttDesc = document.getElementById('tt-desc');
  const ttSkillsContainer = document.getElementById('tt-skills-container');

  function showTip(e, proj) {
    if (!tooltip) return;
    if (ttIcon) {
      // Use the project's own neuron icon — same as shown inside the node
      const projIconPath = PROJ_ICONS[proj.id];
      ttIcon.innerHTML = projIconPath
        ? '<path d="' + projIconPath + '"/>'
        : '';
    }
    if (ttTitle) ttTitle.textContent = proj.label;
    if (ttTag) ttTag.textContent = proj.tag + ' • Neuron ' + proj.neuron;
    if (ttDesc) ttDesc.textContent = proj.desc;
    if (ttSkillsContainer) {
      ttSkillsContainer.innerHTML = proj.skills.map(function(s) {
        const node = INPUT_NODES.find(function(n) { return n.id === s; });
        return node ? '<span class="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full" style="background: rgba(124,58,237,0.25); border: 1px solid rgba(168,85,247,0.4); color: #c084fc;">' + node.label + '</span>' : '';
      }).join('');
    }
    tooltip.classList.remove('hidden');
    moveTip(e);
  }

  function moveTip(e) {
    if (!tooltip || !container) return;
    const rect = container.getBoundingClientRect();
    let tx = e.clientX - rect.left + 20;
    let ty = e.clientY - rect.top - 30;
    if (tx + 260 > rect.width) tx = e.clientX - rect.left - 280;
    if (ty + 200 > rect.height) ty = e.clientY - rect.top - 210;
    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
  }

  function hideTip() {
    if (tooltip) tooltip.classList.add('hidden');
  }
}

function initMobile() {
  const inputsEl = document.getElementById('mobile-inputs');
  const cardsEl = document.getElementById('mobile-project-cards');
  if (!inputsEl || !cardsEl) return;

  inputsEl.innerHTML = INPUT_NODES.map(function(n) {
    return '<span class="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-2 rounded-full transition-all duration-200 hover:scale-105" style="background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.15)); border: 1px solid rgba(168,85,247,0.4); color: #c084fc; box-shadow: 0 2px 8px rgba(124,58,237,0.2);"><span class="font-semibold">' + n.label + '</span></span>';
  }).join('');

  cardsEl.innerHTML = PROJECT_NODES.map(function(proj) {
    const pills = proj.skills.map(function(s) {
      const node = INPUT_NODES.find(function(n) { return n.id === s; });
      return node ? '<span class="inline-flex items-center font-mono text-xs px-2.5 py-1 rounded-full" style="background: rgba(124,58,237,0.2); border: 1px solid rgba(168,85,247,0.3); color: #c084fc;">' + node.label + '</span>' : '';
    }).join('');

    return '<a href="' + proj.url + '" target="_blank" rel="noopener noreferrer"'
      + ' class="block relative overflow-hidden rounded-xl p-5 transition-all duration-300 group"'
      + ' style="background: linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(30,20,50,0.95) 100%); border: 1px solid rgba(124,58,237,0.4); box-shadow: 0 4px 16px rgba(124,58,237,0.2);">'
      + '<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(circle at top right, rgba(168,85,247,0.15) 0%, transparent 70%);"></div>'
      + '<div class="relative">'
      + '<div class="flex items-center justify-between gap-2 mb-2">'
      + '<span class="font-mono text-xs px-2.5 py-1 rounded-full" style="background: rgba(124,58,237,0.3); border: 1px solid rgba(168,85,247,0.4); color: #c084fc;">' + proj.tag + '</span>'
      + '<svg class="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" style="color: rgba(148,163,184,0.5);" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>'
      + '</div>'
      + '<h3 class="text-base font-bold mb-2 group-hover:text-accent-glow transition-colors duration-200" style="color: #ffffff; font-family: JetBrains Mono,monospace; letter-spacing: 0.04em;">' + proj.label + '</h3>'
      + '<p class="text-sm leading-relaxed mb-3" style="color: #94a3b8;">' + proj.desc + '</p>'
      + '<div class="flex flex-wrap gap-2">' + pills + '</div>'
      + '</div></a>';
  }).join('');
}
