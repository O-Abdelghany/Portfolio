/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        'noir-bg':      '#080810',
        'noir-surface': '#0f0f1a',
        'noir-border':  '#1e1e3a',
        'accent':       '#7c3aed',
        'accent-glow':  '#a855f7',
        'text-primary': '#ffffff',
        'text-muted':   '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
