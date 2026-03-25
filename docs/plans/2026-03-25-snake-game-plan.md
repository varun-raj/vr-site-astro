# Snake Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a terminal-styled snake game easter egg that opens as a modal overlay when the user types `snake` on the keyboard.

**Architecture:** A standalone `SnakeGame.astro` component with all game logic in a `<script>` tag using vanilla JS. The component renders a modal with a CSS grid of monospace characters. It's imported into `Main.astro` and triggered via the existing keyboard command buffer.

**Tech Stack:** Astro component, vanilla TypeScript, CSS grid, localStorage

---

### Task 1: Create SnakeGame.astro modal markup

**Files:**
- Create: `src/components/SnakeGame.astro`

**Step 1: Create the component file with modal HTML**

Create `src/components/SnakeGame.astro` with the modal overlay markup. No script yet — just the HTML structure matching the help modal's double-border TUI style.

```astro
<!-- No frontmatter needed -->

<div id="snake-modal" class="fixed inset-0 z-[300] bg-black/60 backdrop-blur-[2px] hidden items-center justify-center p-6 text-zinc-400 font-mono">
  <div class="w-full max-w-md border-2 border-zinc-100 bg-black p-1 shadow-2xl">
    <div class="border border-zinc-100/30 p-4 space-y-4 relative">
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-100">
        [ snake_v1.0 ]
      </div>

      <div id="snake-grid" class="flex items-center justify-center pt-2 select-none" style="min-height: 200px;">
        <!-- Grid cells rendered by JS -->
      </div>

      <div id="snake-overlay" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div id="snake-overlay-text" class="text-center space-y-2"></div>
      </div>

      <div class="pt-2 border-t border-zinc-100/20 flex justify-between items-center text-[10px] uppercase font-bold">
        <span class="text-zinc-500">Score: <span id="snake-score" class="text-zinc-100">0</span></span>
        <span class="text-zinc-100 animate-pulse">Press [ESC] to Exit</span>
        <span class="text-zinc-500">Best: <span id="snake-highscore" class="text-amber-500">0</span></span>
      </div>
    </div>
  </div>
</div>
```

**Step 2: Verify the file was created correctly**

Run: `cat src/components/SnakeGame.astro | head -5`
Expected: The opening div with `id="snake-modal"`

**Step 3: Commit**

```bash
git add src/components/SnakeGame.astro
git commit -m "feat(snake): add modal markup for snake game component"
```

---

### Task 2: Add snake game logic script

**Files:**
- Modify: `src/components/SnakeGame.astro`

**Step 1: Add the full game script to SnakeGame.astro**

Append a `<script>` tag after the modal HTML in `src/components/SnakeGame.astro`. This script contains all game state, rendering, input handling, and the game loop. Key details:

- **State:** `gameState` enum (`idle`, `playing`, `gameover`), `snake` array of `{x,y}`, `food` `{x,y}`, `direction` and `nextDirection`, `score`, `highScore`, `cols`/`rows`, `gameInterval`
- **Grid sizing:** `calcGridSize()` reads the `#snake-grid` container width/height, uses `cellSize` of 16px (mobile) or 20px (`window.innerWidth >= 768`), clamps to 12-22 range
- **Rendering:** `render()` builds a grid of `<span>` elements. Each cell is a single character: `█` (emerald-500 for body, emerald-400 for head), `●` (amber-500 for food), or `\u00A0` (non-breaking space for empty). The grid container uses `display: grid` with `grid-template-columns: repeat(cols, cellSize)`.
- **Game loop:** `setInterval` at 150ms. Each tick: compute new head from `direction`, check wall/self collision, check food collision (grow + score + new food), move snake (shift tail if not growing), call `render()`.
- **Input:** `keydown` listener on `document`, only active when snake modal is visible. Arrow keys and WASD map to directions. Opposite direction ignored. `Enter` starts/restarts. `Escape` closes modal.
- **Food placement:** Random empty cell (not on snake body).
- **localStorage:** Read `snake-highscore` on init, write on game over if score > highScore.
- **`toggleSnake()` function:** Exposed on `window`. Shows/hides modal, resets game to idle state, calls `calcGridSize()` and `render()` on open.
- **Resize handler:** `window.addEventListener('resize', ...)` recalculates grid when modal is visible.

```typescript
<script>
  type Direction = 'up' | 'down' | 'left' | 'right';
  type GameState = 'idle' | 'playing' | 'gameover';
  type Point = { x: number; y: number };

  let cols = 15;
  let rows = 15;
  let cellSize = 20;
  let snake: Point[] = [];
  let food: Point = { x: 0, y: 0 };
  let direction: Direction = 'right';
  let nextDirection: Direction = 'right';
  let score = 0;
  let highScore = parseInt(localStorage.getItem('snake-highscore') || '0', 10);
  let gameState: GameState = 'idle';
  let gameInterval: ReturnType<typeof setInterval> | null = null;

  const gridEl = document.getElementById('snake-grid')!;
  const overlayEl = document.getElementById('snake-overlay')!;
  const overlayTextEl = document.getElementById('snake-overlay-text')!;
  const scoreEl = document.getElementById('snake-score')!;
  const highScoreEl = document.getElementById('snake-highscore')!;
  const modalEl = document.getElementById('snake-modal')!;

  highScoreEl.textContent = String(highScore);

  function calcGridSize() {
    cellSize = window.innerWidth >= 768 ? 20 : 16;
    const container = gridEl;
    const availW = Math.min(container.clientWidth || 300, 400);
    const availH = Math.min(window.innerHeight * 0.5, 400);
    cols = Math.max(12, Math.min(22, Math.floor(availW / cellSize)));
    rows = Math.max(12, Math.min(22, Math.floor(availH / cellSize)));
  }

  function placeFood() {
    const empty: Point[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!snake.some(s => s.x === x && s.y === y)) {
          empty.push({ x, y });
        }
      }
    }
    if (empty.length > 0) {
      food = empty[Math.floor(Math.random() * empty.length)];
    }
  }

  function resetGame() {
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);
    snake = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreEl.textContent = '0';
    placeFood();
  }

  function showOverlay(lines: string[]) {
    overlayEl.classList.remove('hidden');
    overlayTextEl.innerHTML = lines
      .map(l => `<p class="text-zinc-100 text-xs font-bold uppercase tracking-widest">${l}</p>`)
      .join('');
  }

  function hideOverlay() {
    overlayEl.classList.add('hidden');
    overlayTextEl.innerHTML = '';
  }

  function render() {
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    grid.style.lineHeight = `${cellSize}px`;
    grid.style.gap = '0';

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = document.createElement('span');
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontSize = `${cellSize - 2}px`;

        const isHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
        const isBody = !isHead && snake.some(s => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;

        if (isHead) {
          cell.textContent = '█';
          cell.style.color = '#34d399'; // emerald-400
        } else if (isBody) {
          cell.textContent = '█';
          cell.style.color = '#10b981'; // emerald-500
        } else if (isFood) {
          cell.textContent = '●';
          cell.style.color = '#f59e0b'; // amber-500
        } else {
          cell.textContent = '\u00A0';
        }
        grid.appendChild(cell);
      }
    }

    gridEl.innerHTML = '';
    gridEl.appendChild(grid);
  }

  function tick() {
    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      endGame(); return;
    }

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      endGame(); return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreEl.textContent = String(score);
      placeFood();
    } else {
      snake.pop();
    }

    render();
  }

  function endGame() {
    gameState = 'gameover';
    if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snake-highscore', String(highScore));
      highScoreEl.textContent = String(highScore);
    }
    showOverlay([`Game Over — Score: ${score}`, 'Press [ENTER] to retry']);
  }

  function startGame() {
    gameState = 'playing';
    hideOverlay();
    resetGame();
    render();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(tick, 150);
  }

  function isModalVisible() {
    return !modalEl.classList.contains('hidden');
  }

  function handleSnakeKeys(e: KeyboardEvent) {
    if (!isModalVisible()) return;

    const key = e.key.toLowerCase();

    if (key === 'escape') {
      (window as any).toggleSnake();
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (key === 'enter') {
      if (gameState === 'idle' || gameState === 'gameover') {
        startGame();
      }
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (gameState !== 'playing') return;

    const dirMap: Record<string, Direction> = {
      arrowup: 'up', arrowdown: 'down', arrowleft: 'left', arrowright: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
    };

    const newDir = dirMap[key];
    if (!newDir) return;

    const opposites: Record<Direction, Direction> = {
      up: 'down', down: 'up', left: 'right', right: 'left',
    };

    if (opposites[newDir] !== direction) {
      nextDirection = newDir;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  // Use capture phase so snake keys are caught before the nav handler
  document.addEventListener('keydown', handleSnakeKeys, true);

  (window as any).toggleSnake = function () {
    const isHidden = modalEl.classList.contains('hidden');
    modalEl.classList.toggle('hidden');
    modalEl.classList.toggle('flex');
    document.body.style.overflow = isHidden ? 'hidden' : '';

    if (isHidden) {
      // Opening
      calcGridSize();
      resetGame();
      gameState = 'idle';
      render();
      showOverlay(['Type SNAKE to play', 'Press [ENTER] to start']);
    } else {
      // Closing
      if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
      gameState = 'idle';
    }
  };

  window.addEventListener('resize', () => {
    if (isModalVisible() && gameState === 'idle') {
      calcGridSize();
      resetGame();
      render();
    }
  });
</script>
```

**Step 2: Verify the script compiles with no syntax errors**

Run: `cd /Users/varun/Projects/vr-site-astro && npx astro check 2>&1 | head -20`
Expected: No errors related to SnakeGame

**Step 3: Commit**

```bash
git add src/components/SnakeGame.astro
git commit -m "feat(snake): add game logic with adaptive grid, controls, and localStorage high score"
```

---

### Task 3: Integrate into Main.astro

**Files:**
- Modify: `src/layouts/Main.astro`

**Step 1: Import SnakeGame component**

In `src/layouts/Main.astro`, add the import in the frontmatter block (after the existing imports, line 4):

```astro
import SnakeGame from "../components/SnakeGame.astro";
```

**Step 2: Add SnakeGame component to the body**

Place `<SnakeGame />` right after the closing `</div>` of the `help-modal` div (after line 94):

```astro
    <SnakeGame />
```

**Step 3: Wire up the `snake` command in the key buffer handler**

In the `handleShortcuts` script, add the `snake` command check right after the `man` check (after line 178). The line currently reads:

```typescript
if (keyBuffer === 'man') { toggleHelp(); keyBuffer = ""; return; }
```

Add after it:

```typescript
if (keyBuffer === 'snake') { (window as any).toggleSnake(); keyBuffer = ""; return; }
```

**Step 4: Add ESC handler for snake modal**

In the escape key handler (around line 169), after the help modal check, add:

```typescript
if (!document.getElementById('snake-modal')?.classList.contains('hidden')) { (window as any).toggleSnake(); return; }
```

**Step 5: Update possibleStarts to allow longer commands**

The current `possibleStarts` array on line 201 is `['s', 'm']`. The buffer timeout logic clears at length >= 3 unless the first char is in `possibleStarts`. Since `snake` is 5 chars, update the length check on line 202 from:

```typescript
if (keyBuffer.length >= 3 || (keyBuffer.length === 2 && !possibleStarts.includes(keyBuffer[0]))) {
```

to:

```typescript
if (keyBuffer.length >= 6 || (keyBuffer.length === 2 && !possibleStarts.includes(keyBuffer[0])) || (keyBuffer.length >= 4 && !['snake','snak','sna'].some(p => p.startsWith(keyBuffer) || keyBuffer.startsWith(p)))) {
```

Actually, simpler approach — check `snake` before the length check, same as `man`. The `snake` command is already checked at the top of the timeout callback (step 3). The issue is the buffer gets cleared at length >= 3. Change the condition to:

```typescript
if (keyBuffer.length >= 6 || (keyBuffer.length >= 2 && !possibleStarts.includes(keyBuffer[0]))) {
```

Wait — `possibleStarts` already includes `'s'`, so `keyBuffer.length >= 3` is the issue. Since `man` is 3 chars and `snake` is 5, raise the threshold for `s`/`m` prefixed commands. Simplest: change `>= 3` to `>= 6`:

```typescript
if (keyBuffer.length >= 6 || (keyBuffer.length === 2 && !possibleStarts.includes(keyBuffer[0]))) {
```

This allows commands up to 5 chars for `s`/`m` prefixed commands.

**Step 6: Add snake to the help modal Functions list**

In the help modal HTML (around line 84, after the `ext_skcript / SC` entry), add:

```html
<div class="flex justify-between items-center group/item text-xs">
  <span class="opacity-70 group-hover/item:opacity-100 transition-opacity">snake_game</span>
  <span class="text-zinc-100 font-bold bg-zinc-100/10 px-1.5 rounded">SNAKE</span>
</div>
```

**Step 7: Verify the dev server runs without errors**

Run: `cd /Users/varun/Projects/vr-site-astro && npx astro build 2>&1 | tail -10`
Expected: Build succeeds

**Step 8: Commit**

```bash
git add src/layouts/Main.astro
git commit -m "feat(snake): integrate snake game command into keyboard handler and help modal"
```

---

### Task 4: Manual testing and polish

**Files:**
- Possibly modify: `src/components/SnakeGame.astro`, `src/layouts/Main.astro`

**Step 1: Start the dev server**

Run: `cd /Users/varun/Projects/vr-site-astro && bun dev`

**Step 2: Test the following in the browser**

1. Type `snake` on the keyboard — modal should appear centered (not fullscreen)
2. Press `Enter` — game should start, snake moves right
3. Use arrow keys and WASD — snake changes direction
4. Eat food — score increments by 10
5. Hit a wall or self — game over screen appears with score
6. Press `Enter` — game restarts
7. Press `Escape` — modal closes
8. Type `snake` again — modal reopens in idle state
9. Resize browser window while in idle state — grid should adapt
10. Verify high score persists after closing and reopening
11. Type `man` — help modal should show `snake_game / SNAKE` in functions list
12. Verify other keyboard shortcuts still work when snake modal is closed

**Step 3: Fix any issues found during testing**

Adjust styling, timing, or grid sizing as needed.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(snake): polish after manual testing"
```
