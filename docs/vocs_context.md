# Vocs Documentation Framework

Vocs is a minimal static documentation generator built on React and Vite, designed for creating fast, modern documentation sites with minimal configuration. It provides a seamless developer experience with hot module replacement during development, static site generation for production, and built-in support for MDX, syntax highlighting, and full-text search.

The framework follows a convention-over-configuration approach where Markdown/MDX files in a `docs/pages/` directory automatically become routes. Vocs handles all the complex build tooling, theming, navigation, and search functionality out of the box while remaining highly customizable through a TypeScript configuration file. It's optimized for technical documentation with features like code snippets with syntax highlighting, TypeScript hover information via Twoslash, responsive navigation, and SEO-friendly static HTML generation.

## Installing and Scaffolding

Creating a new Vocs project with CLI scaffolding

```bash
# Using npm
npm init vocs

# Using pnpm
pnpm create vocs

# Using yarn
yarn create vocs

# Using bun
bun create vocs
```

## Manual Installation

Adding Vocs to an existing project

```bash
# Install the package
npm i vocs

# Add scripts to package.json
{
  "scripts": {
    "docs:dev": "vocs dev",
    "docs:build": "vocs build",
    "docs:preview": "vocs preview"
  }
}

# Create directory structure
mkdir -p docs/pages
echo "# Hello World\n\nWelcome to my docs." > docs/pages/index.mdx

# Run development server
npm run docs:dev
```

## Configuration File Setup

Defining global metadata with vocs.config.ts

```typescript
// vocs.config.ts
import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'My Documentation',
  description: 'Comprehensive guide to my project',
  baseUrl: 'https://docs.example.com',
  basePath: '/docs',
  rootDir: 'docs',
  iconUrl: '/icon.svg',
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg'
  },
  editLink: {
    pattern: 'https://github.com/user/repo/edit/main/docs/pages/:path',
    text: 'Edit on GitHub'
  },
  sidebar: [
    {
      text: 'Getting Started',
      link: '/getting-started'
    },
    {
      text: 'API Reference',
      collapsed: false,
      items: [
        { text: 'Config', link: '/api/config' },
        { text: 'Components', link: '/api/components' }
      ]
    }
  ],
  topNav: [
    { text: 'Guide', link: '/guide' },
    { text: 'API', link: '/api' },
    {
      text: 'v1.0.0',
      items: [
        { text: 'Changelog', link: 'https://github.com/user/repo/releases' },
        { text: 'Contributing', link: '/contributing' }
      ]
    }
  ],
  socials: [
    { icon: 'github', link: 'https://github.com/user/repo' },
    { icon: 'discord', link: 'https://discord.gg/example' },
    { icon: 'x', link: 'https://twitter.com/example' }
  ]
})
```

## Development Server

Starting local development environment

```bash
# Basic dev server (default port 5173)
vocs dev

# With custom port
vocs dev --port 3000

# Expose to network
vocs dev --host

# Clean cache before starting
vocs dev --clean
```

```typescript
// Programmatic usage
import { createDevServer } from 'vocs'

const server = await createDevServer({
  port: 5173,
  host: true,
  clean: false
})

await server.listen()
server.printUrls()
```

## Production Build

Building static site for deployment

```bash
# Basic build
vocs build

# Custom output directory
vocs build --outDir dist

# Without search index
vocs build --searchIndex false

# Clean cache before build
vocs build --clean

# Custom log level
vocs build --logLevel warn
```

```typescript
// Programmatic build with hooks
import { build } from 'vocs'

await build({
  outDir: 'dist',
  publicDir: 'public',
  searchIndex: true,
  clean: false,
  logLevel: 'info',
  hooks: {
    onBundleStart() {
      console.log('Starting bundle...')
    },
    onBundleEnd({ error }) {
      if (error) throw error
      console.log('Bundle complete')
    },
    onPrerenderStart() {
      console.log('Prerendering pages...')
    },
    onPrerenderEnd({ error }) {
      if (error) throw error
      console.log('Prerender complete')
    }
  }
})
```

## Preview Built Site

Serving production build locally

```bash
# Preview on default port 4173
vocs preview
```

```typescript
// Programmatic preview
import { preview } from 'vocs'

const server = await preview({ outDir: 'dist' })
console.log(`Preview server running on port ${server.port}`)
```

## Markdown Page with Frontmatter

Creating pages with metadata

```markdown
---
title: Getting Started Guide
description: Learn how to get started with our platform
authors:
  - [jxom](https://x.com/jxom)
  - [awkweb](https://x.com/awkweb)
date: 2024-01-15
layout: docs
outline: [2, 3]
---

# Getting Started Guide

This guide will walk you through the basics.

## Installation

Follow these steps to install...
```

## Code Blocks with Syntax Highlighting

Displaying code with titles, line highlighting, and diffs

````markdown
```typescript [src/config.ts]
import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'My Docs', // [!code focus]
  theme: {
    accentColor: '#ff0000' // [!code ++]
    accentColor: '#00ff00' // [!code --]
  }
})
```

```bash [Terminal]
npm install vocs
npm run docs:dev
```
````

## Callout Components

Adding styled callouts for notes and warnings

```markdown
:::note
This is a note callout with [links](https://example.com) and **formatting**.
:::

:::info
Important information for users to know.
:::

:::warning
Be careful when doing this operation!
:::

:::danger
This action cannot be undone!
:::

:::tip
Here's a helpful tip to improve your workflow.
:::

:::success
Operation completed successfully!
:::
```

## Code Groups with Tabs

Showing multiple code examples with tabs

````markdown
:::code-group

```bash [npm]
npm install vocs
```

```bash [pnpm]
pnpm install vocs
```

```bash [yarn]
yarn add vocs
```

```bash [bun]
bun install vocs
```

:::
````

## Step-by-Step Guides

Creating numbered step sequences

```markdown
::::steps

### Step 1: Install Dependencies

First install the required packages.

```bash
npm install vocs
```

### Step 2: Configure

Create your config file.

```typescript
export default defineConfig({ title: 'Docs' })
```

### Step 3: Run

Start the development server.

```bash
npm run docs:dev
```

::::
```

## Custom Components in MDX

Using Vocs components and custom React components

```mdx
---
title: Custom Components Demo
---

import { Button, Callout, Authors, BlogPosts, Sponsors } from 'vocs/components'
import { MyCustomComponent } from '../components/MyCustomComponent'

# Component Demo

<Button href="https://github.com/example">View on GitHub</Button>

<Button variant="accent">Get Started</Button>

<Callout type="tip">
  Use custom components to extend your documentation!
</Callout>

<Authors authors="jxom" date="2024-01-01" />

<BlogPosts />

<MyCustomComponent data={{ foo: 'bar' }} />
```

## Theming with Accent Colors

Customizing site colors and appearance

```typescript
// vocs.config.ts
import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Themed Docs',
  theme: {
    // Simple accent color
    accentColor: '#ff6b6b',

    // Light and dark variants
    accentColor: {
      light: '#e63946',
      dark: '#ff8ba7'
    },

    // Full control over accent colors
    accentColor: {
      backgroundAccent: { light: '#e63946', dark: '#ff8ba7' },
      backgroundAccentHover: { light: '#d62828', dark: '#ff6b9d' },
      backgroundAccentText: { light: 'white', dark: 'black' },
      borderAccent: { light: '#f77f00', dark: '#fcbf49' },
      textAccent: { light: '#e63946', dark: '#ff8ba7' },
      textAccentHover: { light: '#d62828', dark: '#ff6b9d' }
    },

    // Force color scheme
    colorScheme: 'dark'
  }
})
```

## Advanced Theme Variables

Fine-tuning all CSS variables

```typescript
// vocs.config.ts
import { defineConfig } from 'vocs'

export default defineConfig({
  theme: {
    variables: {
      color: {
        background: { light: '#ffffff', dark: '#1a1a1a' },
        backgroundDark: { light: '#f5f5f5', dark: '#0d0d0d' },
        text: { light: '#000000', dark: '#ffffff' },
        textAccent: { light: '#0066cc', dark: '#66b3ff' }
      },
      fontFamily: {
        default: '"Inter", system-ui, sans-serif',
        mono: '"Fira Code", "Courier New", monospace'
      },
      fontSize: {
        root: '16px',
        h1: '2.5rem',
        h2: '2rem',
        code: '0.875rem'
      },
      space: {
        0: '0px',
        4: '4px',
        8: '8px',
        16: '16px',
        24: '24px'
      },
      content: {
        width: '1200px',
        horizontalPadding: '24px',
        verticalPadding: '48px'
      },
      sidebar: {
        width: '280px'
      }
    }
  }
})
```

## Custom Fonts

Configuring Google Fonts

```typescript
// vocs.config.ts
import { defineConfig } from 'vocs'

export default defineConfig({
  font: {
    google: 'Roboto'
  },

  // Or separate fonts for default and monospace
  font: {
    default: { google: 'Inter' },
    mono: { google: 'Fira Code' }
  }
})
```

## Blog Configuration

Setting up blog functionality

```typescript
// vocs.config.ts
import { defineConfig } from 'vocs'

export default defineConfig({
  blogDir: './pages/blog',
  sidebar: [
    { text: 'Blog', link: '/blog' }
  ]
})
```

```markdown
<!-- pages/blog/hello-world.mdx -->
---
title: Hello World
description: My first blog post
authors: [jxom, awkweb]
date: 2024-01-15
---

# Hello World

::authors

This is my first blog post!
```

## Custom Head Tags

Adding custom HTML to document head

```tsx
// vocs.config.tsx
import { defineConfig } from 'vocs'

export default defineConfig({
  // Static head tags
  head: (
    <>
      <script src="https://analytics.example.com/script.js" />
      <meta property="og:image" content="/og-image.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    </>
  ),

  // Per-page head tags
  head: {
    '/docs': <meta name="robots" content="index, follow" />,
    '/private': <meta name="robots" content="noindex" />
  },

  // Dynamic head tags
  head: async ({ path }) => {
    const title = await fetchPageTitle(path)
    return <meta property="og:title" content={title} />
  }
})
```

## Sponsors Display

Showcasing project sponsors

```typescript
// vocs.config.ts
import { defineConfig } from 'vocs'

export default defineConfig({
  sponsors: [
    {
      name: 'Gold Sponsors',
      height: 120,
      items: [
        [
          {
            name: 'Company A',
            link: 'https://company-a.com',
            image: 'https://example.com/company-a-logo.svg'
          },
          {
            name: 'Company B',
            link: 'https://company-b.com',
            image: 'https://example.com/company-b-logo.svg'
          }
        ]
      ]
    },
    {
      name: 'Silver Sponsors',
      height: 80,
      items: [
        [
          { name: 'Company C', link: 'https://c.com', image: '/c.svg' },
          { name: 'Company D', link: 'https://d.com', image: '/d.svg' }
        ]
      ]
    }
  ]
})
```

```markdown
<!-- Display sponsors in any page -->
import { Sponsors } from 'vocs/components'

<Sponsors />
```

## AI Chat Integration

Enabling AI chat functionality

```typescript
// vocs.config.ts
import { defineConfig } from 'vocs'

export default defineConfig({
  // Enable with defaults
  aiCta: true,

  // Disable
  aiCta: false,

  // Custom query
  aiCta: {
    query({ location }) {
      return `Analyze this documentation page: ${location}. Provide a summary and answer questions about it.`
    }
  }
})
```

## Search Configuration

Customizing built-in search

```typescript
// vocs.config.ts
import { defineConfig } from 'vocs'

export default defineConfig({
  search: {
    // MiniSearch options
    fields: ['title', 'text', 'description'],
    storeFields: ['title', 'text', 'description'],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
      prefix: true
    }
  }
})
```

```bash
# Build search index separately
vocs search-index --outDir dist
```

## Banner Configuration

Adding site-wide announcement banner

```typescript
// vocs.config.tsx
import { defineConfig } from 'vocs'

export default defineConfig({
  // Simple markdown banner
  banner: '🎉 Version 2.0 is now available! [Learn more](/changelog)',

  // Banner with custom styling
  banner: {
    dismissable: true,
    backgroundColor: '#ff6b6b',
    textColor: 'white',
    height: '40px',
    content: 'Join our [Discord community](https://discord.gg/example)!'
  },

  // JSX banner
  banner: (
    <div>
      Check out our new <a href="/features">features</a>!
    </div>
  )
})
```

---

Vocs provides a batteries-included solution for building modern documentation sites with minimal configuration. Its main use cases include technical documentation for open-source projects, API references, internal company knowledge bases, and tutorial sites. The framework excels at projects that need fast iteration during development, excellent SEO through static site generation, and professional-looking documentation without custom design work.

Integration patterns typically involve placing Vocs in a monorepo alongside application code, using CI/CD to build and deploy on commits, and customizing themes to match brand identity. The programmatic API allows embedding Vocs builds into larger build pipelines, while the CLI provides quick scaffolding for standalone documentation projects. MDX support enables rich interactive documentation with custom React components, and the TypeScript-first configuration ensures type safety when customizing behavior.
