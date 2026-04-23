/**
 * projects.js — Project Vault card data and renderer.
 * Swap out the `projects` array with your real data.
 */

const projects = [
  {
    title: 'Agentic RAG Pipeline',
    tag: 'AI / LLM',
    challenge: 'Building a retrieval-augmented generation system that could answer domain-specific questions with cited, verifiable sources — not hallucinations.',
    solution: 'Designed a multi-step agent using LangChain and Gemini 1.5 Flash. Integrated a vector store for semantic retrieval and a GitHub-aware citation layer that deep-links to exact source files.',
    githubUrl: 'https://github.com/O-Abdelghany',
    tags: ['Python', 'LangChain', 'Gemini API', 'RAG'],
  },
  {
    title: 'LLM Optimization Toolkit',
    tag: 'ML Engineering',
    challenge: 'Large language models are expensive to run. The challenge was reducing inference latency and cost without sacrificing output quality for production use cases.',
    solution: 'Implemented quantization, prompt compression, and response caching strategies. Benchmarked multiple open-source models against GPT-4 on domain-specific tasks.',
    githubUrl: 'https://github.com/O-Abdelghany',
    tags: ['Python', 'PyTorch', 'Transformers', 'Benchmarking'],
  },
  {
    title: 'Competitive Programming Archive',
    tag: 'Algorithms',
    challenge: 'ECPC preparation required solving hundreds of algorithmic problems under time pressure — with no room for brute-force approaches.',
    solution: 'Built a personal archive of optimized solutions covering dynamic programming, graph algorithms, and segment trees. Each solution is annotated with time/space complexity analysis.',
    githubUrl: 'https://github.com/O-Abdelghany',
    tags: ['C++', 'Algorithms', 'Data Structures', 'ECPC'],
  },
];

export function initProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Render cards
  grid.innerHTML = projects.map((p, i) => `
    <article
      class="project-card bg-noir-surface border border-noir-border rounded-xl p-6 flex flex-col gap-4 reveal"
      style="animation-delay: ${i * 150}ms"
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
  `).join('');

  // Scroll-reveal with IntersectionObserver
  const cards = grid.querySelectorAll('.project-card');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!prefersReduced.matches) {
            entry.target.classList.add('animate-fade-up');
          }
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
