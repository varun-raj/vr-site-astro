# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server
bun run build    # Production build
bun run preview  # Preview production build
bun run get:books    # Fetch RSS/books data
bun run build:books  # Generate book info
```

No test runner or linter is configured.

## Architecture

This is a personal portfolio/blog site built with **Astro 5** (static generation), using a terminal/TUI aesthetic with dark-mode-only design.

### Key technologies
- **Astro 5** with file-based routing and content collections
- **React 19** for interactive islands
- **Tailwind CSS 4** configured via Vite plugin (no tailwind.config.js — all theme config lives in `src/styles/global.css` using `@theme`)
- **MDX** for blog posts with expressive-code syntax highlighting
- **Bun** as the package manager (bun.lock)
- **TypeScript** (strict mode via `astro/tsconfigs/strict`)

### Source structure
- `src/layouts/Main.astro` — Single main layout wrapping all pages. Contains the help modal, toast system, keyboard shortcut handlers, and mobile navigation drawer.
- `src/pages/` — File-based routing. Blog uses `[...slug].astro` for dynamic routes.
- `src/content/` — Content collections. Blog posts are MDX files in `content/blog/`. Other data (books, talks, tools, flights) stored as JSON.
- `src/content.config.ts` — Defines collection schemas (blog has title, description, pubDate, optional updatedDate and cover).
- `src/config/AppConfig.ts` — Site metadata constants (name, URL, description).
- `src/components/` — Organized by domain: `blog/`, `books/`, `home/`, `pressKit/`, `shared/`, `ui/`, `uses/`.
- `src/styles/global.css` — Tailwind 4 theme with custom font scale, color tokens, and utility classes (`hover-glitch`, `geeky-link`, `animate-terminal-cursor`, `mono-label`).
- `src/lib/utils.ts` — Small utility functions (groupBy, groupToArray).

### Styling conventions
- Dark mode only — black background with zinc color palette, emerald accents
- Dark mode uses `@custom-variant dark (&:where(.dark, .dark *))` class strategy
- Custom fonts loaded via `@font-face` from `/public/fonts/`: Inter, JetBrains Mono, Lora
- Terminal-style UI: hex IDs on blog posts, blinking cursors, glitch animations, keyboard-driven navigation
- Blog prose uses `@tailwindcss/typography` with custom overrides

### Content patterns
- Blog posts sorted by `pubDate` descending
- Posts displayed with hex identifiers (e.g., `[0x01]`, `[0x02]`)
- RSS feed generated at `/rss.xml`
- Sitemap auto-generated via `@astrojs/sitemap`
