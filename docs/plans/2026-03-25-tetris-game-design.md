# Tetris Game Design

**Date:** 2026-03-25
**Command:** `tris` (typed on keyboard, like `snake` and `man`)

## Summary

A terminal-styled Tetris game that opens as a centered modal overlay when the user types `tris`. Built as a standalone `TetrisGame.astro` component with vanilla JS, following the same pattern as the snake game.

## Modal & Layout

- Same TUI modal pattern as snake: centered overlay, `max-w-md`, double border, `[ tris_v1.0 ]` title label
- Left side: 10-wide game board (standard Tetris width)
- Right side: Next piece preview box, score, lines cleared
- Footer: score left, `[ESC] to Exit` center, best right (localStorage `tris-highscore`)

## Game Board

- Standard 10 columns x 20 rows
- Cells use `█` blocks with piece-specific colors (cyan, yellow, purple, green, red, blue, orange)
- Empty cells: `·` in zinc-800 (subtle dot grid)
- 1px gap between cells, reduced cell height (0.6 ratio)

## Pieces & Mechanics

- 7 standard tetrominoes: I, O, T, S, Z, J, L
- Random bag shuffle (deal all 7, reshuffle when empty)
- Constant drop speed (~800ms interval)
- Line clear: +100 per line, +400 bonus for 4 lines (Tetris)
- High score persisted in localStorage (`tris-highscore`)

## Controls

- Left/Right arrow or A/D — move piece
- Down arrow or S — soft drop
- Up arrow or W — rotate clockwise
- Space — hard drop
- Enter — start / restart
- ESC — close modal

## Game States

1. **idle** — "Press [ENTER] to start"
2. **playing** — game loop active
3. **gameover** — "Game Over — Press [ENTER] to retry"

## Integration

- New file: `src/components/TetrisGame.astro`
- Import into `Main.astro`, add `tris` command to buffer handler
- Add `tris` to help modal Functions list
- Capture-phase keydown listener (same pattern as snake)
