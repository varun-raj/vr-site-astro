# Snake Game Design

**Date:** 2026-03-25
**Command:** `snake` (typed on keyboard, like `man`)

## Summary

A terminal-styled snake game that opens as a centered modal overlay when the user types `snake` on the keyboard. Hidden easter egg that fits the site's TUI aesthetic. Built as a standalone `SnakeGame.astro` component with vanilla JS.

## Modal & Layout

- Centered modal overlay (not fullscreen) — `bg-black/60 backdrop-blur`, same z-index pattern as help modal
- Inner box: `max-w-md`, double border style matching `[ system_help_v1.0 ]` modal
- Title label: `[ snake_v1.0 ]` in the absolute-positioned pill style
- Footer: current score (left), high score (right), `[ESC] to Exit`
- Font: JetBrains Mono throughout

## Adaptive Grid

- Cell size: ~16px mobile, ~20px desktop
- Grid dimensions: `Math.floor(available / cellSize)` for both axes
- Constraints: min 12x12, max 22x22
- Rendered as a CSS grid of monospace characters
- Recalculates on window resize while modal is open

## Rendering

- Snake body: `█` in emerald-500, head in emerald-400
- Food: `●` in amber-500
- Empty cells: space on black background
- All rendered in a monospace grid

## Game Mechanics

- Game loop via `setInterval` at ~150ms tick rate
- Collision detection: walls and self
- Snake grows by 1 per food eaten
- Score: +10 per food
- High score: persisted in `localStorage` (`snake-highscore`)

## Controls

- Arrow keys + WASD for direction
- Enter to start / restart after game over
- ESC to close modal (stops game, resets state)
- Opposite direction input ignored (can't reverse into self)

## Game States

1. **idle** — modal just opened, shows "Press ENTER to start"
2. **playing** — game loop active
3. **gameover** — shows final score, "Press ENTER to retry"

## Integration

- New file: `src/components/SnakeGame.astro`
- Imported into `Main.astro`, placed alongside help modal
- Key buffer command `snake` added to `handleShortcuts` in Main.astro, calls `toggleSnake()`
- Snake modal captures keyboard events when open (prevents nav handler interference)
- `snake` command added to help modal's Functions column for discoverability
- `possibleStarts` array already includes `'s'` — buffer logic naturally waits for multi-char commands
