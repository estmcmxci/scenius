export const paperTheme = {
  colorScheme: 'light' as const,
  radius: 'soft' as const,
  density: 'normal' as const,
  typography: {
    baseSize: 15 as const,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMono: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
    fontSources: [
      {
        family: 'DM Sans',
        src: 'https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K6z9mXg.woff2',
        weight: '100 1000',
        style: 'normal' as const,
        display: 'swap' as const,
      },
    ],
  },
  color: {
    accent: {
      primary: '#2d7a7a',
      level: 2 as const,
    },
  },
};
