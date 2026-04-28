/**
 * projects.js — Project Vault card data and renderer.
 */

const featuredProjects = [
  {
    title: 'Intelligent HR Agent',
    tag: 'RAG / AI',
    challenge: 'Traditional keyword-based CV screening misses qualified candidates. The challenge was building a system that understands <strong>semantic meaning</strong> — ranking candidates by actual fit, not just keyword matches.',
    solution: 'Engineered a <strong>RAG</strong> pipeline using <strong>ChromaDB</strong> and <strong>all-MiniLM-L6-v2</strong> Sentence Transformers for semantic candidate ranking. Added a fine-tuned <strong>DistilBERT</strong> sentiment module and a <strong>PyPDF/OCR</strong> parsing engine for unstructured resumes.',
    githubUrl: 'https://github.com/O-Abdelghany/intelligent-hr-agent',
    tags: ['Python', 'ChromaDB', 'Hugging Face', 'RAG', 'DistilBERT'],
  },
  {
    title: 'AIdentify — Face Attendance',
    tag: 'Computer Vision',
    challenge: 'Manual attendance logging is slow, error-prone, and easy to game. The challenge was building a <strong>real-time automated system</strong> accurate enough for production use.',
    solution: 'Built a real-time computer vision attendance system using <strong>OpenCV</strong> and <strong>Deep Learning</strong> for face detection. Full-stack architecture with a <strong>FastAPI</strong> backend and <strong>React</strong> frontend for live data visualization and identity logging.',
    githubUrl: 'https://github.com/O-Abdelghany/AIdentify-ERP',
    tags: ['Python', 'OpenCV', 'FastAPI', 'React', 'Deep Learning'],
  },
  {
    title: 'Cardiovascular Health Predictor',
    tag: 'ML / Data Science',
    challenge: 'Heart disease prediction models often overfit or underperform on <strong>imbalanced medical datasets</strong>. The challenge was building a reliable, production-grade pipeline with honest accuracy benchmarks.',
    solution: 'End-to-end ML pipeline with <strong>SMOTE</strong> balancing and <strong>RobustScaler</strong> for outliers. Benchmarked <strong>7 algorithms</strong> — Random Forest, XGBoost, SVM, KNN and more — achieving <strong>94% accuracy</strong> with optimized KNN.',
    githubUrl: 'https://github.com/O-Abdelghany/cardiovascular-health-predictor',
    tags: ['Python', 'Scikit-learn', 'TensorFlow', 'SMOTE', 'XGBoost'],
  },
];

const extraProjects = [
  {
    title: 'Uber Data Analytics',
    tag: 'Data Science',
    challenge: 'Ride-hailing cancellations were costing revenue but the <strong>root causes were buried</strong> in raw trip data with no clear visualization.',
    solution: 'Conducted full <strong>EDA</strong> and statistical analysis on ride data to identify cancellation patterns. Visualized insights via an interactive <strong>Power BI</strong> dashboard with actionable recommendations.',
    githubUrl: 'https://github.com/O-Abdelghany/uber-data-analytics',
    tags: ['Python', 'Pandas', 'Power BI', 'EDA', 'Statistics'],
  },
  {
    title: 'Shortest Path Finder',
    tag: 'Algorithms / C++',
    challenge: 'Comparing the real-world performance of <strong>Bellman-Ford</strong> vs <strong>Dijkstra</strong> across different graph structures and edge weight distributions.',
    solution: 'C++ implementation benchmarking <strong>Bellman-Ford</strong> (Dynamic Programming + Edge Relaxation) against <strong>Dijkstra\'s algorithm</strong>, with detailed complexity analysis and test cases.',
    githubUrl: 'https://github.com/O-Abdelghany/HR-RAG-System',
    tags: ['C++', 'Bellman-Ford', 'Dijkstra', 'Dynamic Programming', 'Graph Theory'],
  },
  {
    title: 'Cycle Detection',
    tag: 'Algorithms / C++',
    challenge: 'Detecting cycles in large graphs efficiently — a critical problem in <strong>dependency resolution</strong> and <strong>deadlock detection</strong>.',
    solution: 'Implemented <strong>Disjoint Set Union (Union-Find)</strong> with path compression and union by rank, combined with adjacency matrices for optimized graph cycle detection.',
    githubUrl: 'https://github.com/O-Abdelghany/HR-RAG-System',
    tags: ['C++', 'Union-Find', 'Graph Theory', 'Data Structures'],
  },
  {
    title: 'Gym Management Web App',
    tag: 'Full-Stack',
    challenge: 'Gym staff needed a <strong>centralized system</strong> to manage memberships, track attendance, and handle payments without spreadsheets.',
    solution: 'Full-stack web application built with <strong>Node.js</strong>, <strong>Express</strong>, and <strong>MongoDB</strong> — featuring member registration, subscription tracking, and an admin dashboard.',
    githubUrl: 'https://github.com/O-Abdelghany/HR-RAG-System',
    tags: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST API'],
  },
  {
    title: 'Hotel Management System',
    tag: 'Java / OOP',
    challenge: 'Designing a <strong>scalable desktop application</strong> that models real-world hotel operations using proper object-oriented principles.',
    solution: 'Java desktop application built with <strong>JavaFX</strong> for the UI, applying <strong>OOP</strong> design patterns — inheritance, polymorphism, encapsulation — across room booking, guest management, and billing modules.',
    githubUrl: 'https://github.com/O-Abdelghany/HR-RAG-System',
    tags: ['Java', 'JavaFX', 'OOP', 'Design Patterns'],
  },
  {
    title: 'University Network Design',
    tag: 'Networking',
    challenge: 'Designing a <strong>scalable, secure network infrastructure</strong> for a multi-building university campus with isolated departments.',
    solution: 'Designed and simulated full network infrastructure using <strong>Cisco Packet Tracer</strong>, implementing <strong>VLANs</strong>, inter-VLAN routing, DHCP, and access control lists for department isolation.',
    githubUrl: 'https://github.com/O-Abdelghany/HR-RAG-System',
    tags: ['Cisco Packet Tracer', 'VLANs', 'Routing', 'Network Design'],
  },
];

function renderCard(p, delay = 0) {
  return `
    <article
      class="project-card bg-noir-surface border border-noir-border rounded-xl p-6 flex flex-col gap-4 reveal"
      style="animation-delay: ${delay}ms"
      data-direction="up"
    >
      <div class="flex items-start justify-between gap-2">
        <span class="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">${p.tag}</span>
      </div>

      <h3 class="text-lg font-bold text-text-primary">${p.title}</h3>

      <div>
        <p class="text-xs font-semibold text-accent-glow uppercase tracking-widest mb-1">Technical Challenge</p>
        <p class="text-text-muted text-sm leading-relaxed">${p.challenge}</p>
      </div>

      <div>
        <p class="text-xs font-semibold text-accent-glow uppercase tracking-widest mb-1">Solution</p>
        <p class="text-text-muted text-sm leading-relaxed">${p.solution}</p>
      </div>

      <div class="flex flex-wrap gap-1.5 mt-auto pt-2">
        ${p.tags.map(t => `<span class="font-mono text-xs text-text-muted border border-noir-border px-2 py-0.5 rounded">${t}</span>`).join('')}
      </div>

      <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer"
         class="mt-2 inline-flex items-center justify-center gap-2 border border-accent text-accent hover:bg-accent hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-glow">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        View Code
      </a>
    </article>
  `;
}

export function initProjects() {
  const grid = document.getElementById('projects-grid');
  const expandBtn = document.getElementById('projects-expand-btn');
  if (!grid) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let expanded = false;

  // Render featured cards
  grid.innerHTML = featuredProjects.map((p, i) => renderCard(p, i * 150)).join('');
  observeCards(grid.querySelectorAll('.project-card'), prefersReduced);

  if (!expandBtn) return;

  expandBtn.addEventListener('click', () => {
    expanded = !expanded;

    if (expanded) {
      // Append extra cards
      const extraHTML = extraProjects.map((p, i) => renderCard(p, i * 100)).join('');
      const wrapper = document.createElement('div');
      wrapper.id = 'extra-projects';
      wrapper.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6';
      wrapper.innerHTML = extraHTML;
      grid.parentElement.insertBefore(wrapper, expandBtn.parentElement);
      observeCards(wrapper.querySelectorAll('.project-card'), prefersReduced);

      expandBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
        Show Less
      `;
    } else {
      const extra = document.getElementById('extra-projects');
      if (extra) extra.remove();
      expandBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        Explore More Projects
      `;
    }
  });
}

function observeCards(cards, prefersReduced) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!prefersReduced.matches) entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('reveal');
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach(card => observer.observe(card));
}
