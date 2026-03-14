import { defineConfig } from 'vocs'

export default defineConfig({
  basePath: '/docs',
  title: 'Paper Chat',
  description: 'Interactive paper reader with AI-powered Q&A and live simulations',
  rootDir: '.',
  theme: {
    accentColor: '#2d7a7a',
    variables: {
      color: {
        background: {
          light: '#faf9f7',
          dark: '#1a1a1a',
        },
      },
      fontFamily: {
        default: '"IBM Plex Sans", system-ui, sans-serif',
        mono: '"SF Mono", "Fira Code", monospace',
      },
    },
  },
  font: {
    google: 'IBM Plex Sans',
  },
  sidebar: [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/' },
      ],
    },
    {
      text: 'Paper Reader',
      items: [
        { text: 'Reading Views', link: '/reader/views' },
        { text: 'Navigation & Progress', link: '/reader/navigation' },
        { text: 'Text Selection', link: '/reader/selection' },
      ],
    },
    {
      text: 'AI Chat',
      items: [
        { text: 'Conversational Q&A', link: '/chat/overview' },
        { text: 'Agent Tools', link: '/chat/tools' },
        { text: 'Thinking Indicator', link: '/chat/thinking' },
      ],
    },
    {
      text: 'Simulation Engine',
      items: [
        { text: 'Running Simulations', link: '/simulation/running' },
        { text: 'Figure Generation', link: '/simulation/figures' },
      ],
    },
    {
      text: 'Architecture',
      items: [
        { text: 'Frontend', link: '/architecture/frontend' },
        { text: 'Backend', link: '/architecture/backend' },
      ],
    },
  ],
})
