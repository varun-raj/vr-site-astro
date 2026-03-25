# Tetris Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a terminal-styled Tetris game easter egg that opens as a modal overlay when the user types `tris` on the keyboard.

**Architecture:** A standalone `TetrisGame.astro` component with all game logic in a `<script>` tag using vanilla TypeScript. The modal has a two-panel layout: game board (left) and sidebar with next piece preview, score, and lines cleared (right). It's imported into `Main.astro` and triggered via the existing keyboard command buffer.

**Tech Stack:** Astro component, vanilla TypeScript, CSS grid, localStorage

---

### Task 1: Create TetrisGame.astro with full markup and game logic

**Files:**
- Create: `src/components/TetrisGame.astro`

**Step 1: Create the component**

Create `src/components/TetrisGame.astro` with the following complete content. The modal layout uses a flex row: game board grid on the left, sidebar on the right with next piece preview, score, and lines.

```astro
<!-- No frontmatter needed -->

<div id="tetris-modal" class="fixed inset-0 z-[300] bg-black/60 backdrop-blur-[2px] hidden items-center justify-center p-6 text-zinc-400 font-mono">
  <div class="w-full max-w-lg border-2 border-zinc-100 bg-black p-1 shadow-2xl">
    <div class="border border-zinc-100/30 p-4 space-y-4 relative">
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-100">
        [ tris_v1.0 ]
      </div>

      <div class="flex gap-4 pt-2">
        <div id="tetris-grid" class="select-none flex-shrink-0">
          <!-- Board cells rendered by JS -->
        </div>
        <div class="flex flex-col justify-between text-[10px] uppercase font-bold min-w-[80px]">
          <div class="space-y-4">
            <div>
              <div class="text-zinc-500 mb-1">Next</div>
              <div id="tetris-next" class="border border-zinc-100/20 p-1 flex items-center justify-center" style="min-height: 60px; min-width: 60px;">
                <!-- Next piece preview -->
              </div>
            </div>
            <div>
              <div class="text-zinc-500">Score</div>
              <div id="tetris-score" class="text-zinc-100 text-sm">0</div>
            </div>
            <div>
              <div class="text-zinc-500">Lines</div>
              <div id="tetris-lines" class="text-zinc-100 text-sm">0</div>
            </div>
            <div>
              <div class="text-zinc-500">Best</div>
              <div id="tetris-highscore" class="text-amber-500 text-sm">0</div>
            </div>
          </div>
          <div class="text-[9px] text-zinc-600 space-y-1">
            <div>← → Move</div>
            <div>↑ Rotate</div>
            <div>↓ Soft drop</div>
            <div>SPC Hard drop</div>
          </div>
        </div>
      </div>

      <div id="tetris-overlay" class="absolute inset-0 flex items-center justify-center pointer-events-none hidden">
        <div id="tetris-overlay-text" class="text-center space-y-2 bg-black/80 px-6 py-4"></div>
      </div>

      <div class="pt-2 border-t border-zinc-100/20 flex justify-between items-center text-[10px] uppercase font-bold">
        <span class="text-zinc-500">Score: <span id="tetris-score-footer" class="text-zinc-100">0</span></span>
        <span class="text-zinc-100 animate-pulse">Press [ESC] to Exit</span>
        <span class="text-zinc-500">Best: <span id="tetris-highscore-footer" class="text-amber-500">0</span></span>
      </div>
    </div>
  </div>
</div>

<script>
  type GameState = 'idle' | 'playing' | 'gameover';
  type Board = number[][]; // 0 = empty, 1-7 = piece color index

  // Tetromino definitions: each is an array of rotations, each rotation is a 2D array
  // Colors: 1=cyan(I), 2=yellow(O), 3=purple(T), 4=green(S), 5=red(Z), 6=blue(J), 7=orange(L)
  const PIECES: { shape: number[][][]; color: number }[] = [
    { // I
      shape: [
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
        [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
        [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
      ], color: 1
    },
    { // O
      shape: [
        [[1,1],[1,1]],
        [[1,1],[1,1]],
        [[1,1],[1,1]],
        [[1,1],[1,1]],
      ], color: 2
    },
    { // T
      shape: [
        [[0,1,0],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,1],[0,1,0]],
        [[0,1,0],[1,1,0],[0,1,0]],
      ], color: 3
    },
    { // S
      shape: [
        [[0,1,1],[1,1,0],[0,0,0]],
        [[0,1,0],[0,1,1],[0,0,1]],
        [[0,0,0],[0,1,1],[1,1,0]],
        [[1,0,0],[1,1,0],[0,1,0]],
      ], color: 4
    },
    { // Z
      shape: [
        [[1,1,0],[0,1,1],[0,0,0]],
        [[0,0,1],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,0],[0,1,1]],
        [[0,1,0],[1,1,0],[1,0,0]],
      ], color: 5
    },
    { // J
      shape: [
        [[1,0,0],[1,1,1],[0,0,0]],
        [[0,1,1],[0,1,0],[0,1,0]],
        [[0,0,0],[1,1,1],[0,0,1]],
        [[0,1,0],[0,1,0],[1,1,0]],
      ], color: 6
    },
    { // L
      shape: [
        [[0,0,1],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,0],[0,1,1]],
        [[0,0,0],[1,1,1],[1,0,0]],
        [[1,1,0],[0,1,0],[0,1,0]],
      ], color: 7
    },
  ];

  const COLORS: Record<number, string> = {
    0: '#27272a', // zinc-800 (empty dot)
    1: '#06b6d4', // cyan-500
    2: '#eab308', // yellow-500
    3: '#a855f7', // purple-500
    4: '#22c55e', // green-500
    5: '#ef4444', // red-500
    6: '#3b82f6', // blue-500
    7: '#f97316', // orange-500
  };

  const COLS = 10;
  const ROWS = 20;

  let board: Board = [];
  let currentPiece: { shape: number[][][]; color: number } | null = null;
  let currentRotation = 0;
  let currentX = 0;
  let currentY = 0;
  let nextPiece: { shape: number[][][]; color: number } | null = null;
  let bag: number[] = [];
  let score = 0;
  let lines = 0;
  let highScore = parseInt(localStorage.getItem('tris-highscore') || '0', 10);
  let gameState: GameState = 'idle';
  let gameInterval: ReturnType<typeof setInterval> | null = null;

  const gridEl = document.getElementById('tetris-grid')!;
  const nextEl = document.getElementById('tetris-next')!;
  const scoreEl = document.getElementById('tetris-score')!;
  const linesEl = document.getElementById('tetris-lines')!;
  const highScoreEl = document.getElementById('tetris-highscore')!;
  const scoreFooterEl = document.getElementById('tetris-score-footer')!;
  const highScoreFooterEl = document.getElementById('tetris-highscore-footer')!;
  const overlayEl = document.getElementById('tetris-overlay')!;
  const overlayTextEl = document.getElementById('tetris-overlay-text')!;
  const modalEl = document.getElementById('tetris-modal')!;

  highScoreEl.textContent = String(highScore);
  highScoreFooterEl.textContent = String(highScore);

  let cells: HTMLSpanElement[] = [];
  let gridContainer: HTMLDivElement | null = null;
  let cellSize = 16;

  function getCellSize() {
    return window.innerWidth >= 768 ? 18 : 14;
  }

  function buildGrid() {
    cells = [];
    cellSize = getCellSize();
    const cellHeight = Math.round(cellSize * 0.6);
    gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${COLS}, ${cellSize}px)`;
    gridContainer.style.gap = '1px';

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = document.createElement('span');
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellHeight}px`;
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontSize = `${cellHeight}px`;
        cells.push(cell);
        gridContainer.appendChild(cell);
      }
    }

    gridEl.innerHTML = '';
    gridEl.appendChild(gridContainer);
  }

  function shuffleBag(): number[] {
    const arr = [0, 1, 2, 3, 4, 5, 6];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getNextFromBag(): number {
    if (bag.length === 0) bag = shuffleBag();
    return bag.pop()!;
  }

  function createBoard(): Board {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  function getShape() {
    if (!currentPiece) return [];
    return currentPiece.shape[currentRotation];
  }

  function isValid(px: number, py: number, rotation: number): boolean {
    if (!currentPiece) return false;
    const shape = currentPiece.shape[rotation];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const bx = px + x;
          const by = py + y;
          if (bx < 0 || bx >= COLS || by >= ROWS) return false;
          if (by >= 0 && board[by][bx] !== 0) return false;
        }
      }
    }
    return true;
  }

  function lockPiece() {
    const shape = getShape();
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const by = currentY + y;
          const bx = currentX + x;
          if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
            board[by][bx] = currentPiece!.color;
          }
        }
      }
    }
    clearLines();
    spawnPiece();
  }

  function clearLines() {
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(c => c !== 0)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        cleared++;
        y++; // re-check same row
      }
    }
    if (cleared > 0) {
      lines += cleared;
      score += cleared === 4 ? 400 : cleared * 100;
      updateScoreDisplay();
    }
  }

  function spawnPiece() {
    currentPiece = nextPiece || PIECES[getNextFromBag()];
    nextPiece = PIECES[getNextFromBag()];
    currentRotation = 0;
    currentX = Math.floor((COLS - getShape()[0].length) / 2);
    currentY = -1;

    if (!isValid(currentX, currentY, currentRotation)) {
      // Game over
      endGame();
    }

    renderNext();
  }

  function updateScoreDisplay() {
    scoreEl.textContent = String(score);
    scoreFooterEl.textContent = String(score);
    linesEl.textContent = String(lines);
  }

  function renderNext() {
    if (!nextPiece) { nextEl.innerHTML = ''; return; }
    const shape = nextPiece.shape[0];
    const color = COLORS[nextPiece.color];
    const previewSize = Math.round(getCellSize() * 0.6);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${shape[0].length}, ${previewSize}px)`;
    grid.style.gap = '1px';

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        const cell = document.createElement('span');
        cell.style.width = `${previewSize}px`;
        cell.style.height = `${Math.round(previewSize * 0.6)}px`;
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontSize = `${Math.round(previewSize * 0.6)}px`;
        if (shape[y][x]) {
          cell.textContent = '█';
          cell.style.color = color;
        } else {
          cell.textContent = '\u00A0';
        }
        grid.appendChild(cell);
      }
    }

    nextEl.innerHTML = '';
    nextEl.appendChild(grid);
  }

  function render() {
    if (!gridContainer || cells.length !== COLS * ROWS) {
      buildGrid();
    }

    // Build display board: board + current piece ghost
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = cells[y * COLS + x];
        const val = board[y][x];

        if (val !== 0) {
          cell.textContent = '█';
          cell.style.color = COLORS[val];
        } else {
          cell.textContent = '·';
          cell.style.color = COLORS[0];
        }
      }
    }

    // Draw current piece on top
    if (currentPiece && gameState === 'playing') {
      const shape = getShape();
      const color = COLORS[currentPiece.color];
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const by = currentY + y;
            const bx = currentX + x;
            if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
              const cell = cells[by * COLS + bx];
              cell.textContent = '█';
              cell.style.color = color;
            }
          }
        }
      }
    }
  }

  function tick() {
    if (!currentPiece) return;
    if (isValid(currentX, currentY + 1, currentRotation)) {
      currentY++;
    } else {
      lockPiece();
    }
    render();
  }

  function hardDrop() {
    if (!currentPiece) return;
    while (isValid(currentX, currentY + 1, currentRotation)) {
      currentY++;
    }
    lockPiece();
    render();
  }

  function endGame() {
    gameState = 'gameover';
    if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('tris-highscore', String(highScore));
      highScoreEl.textContent = String(highScore);
      highScoreFooterEl.textContent = String(highScore);
    }
    showOverlay([`Game Over — Score: ${score}`, 'Press [ENTER] to retry']);
  }

  function showOverlay(textLines: string[]) {
    overlayEl.classList.remove('hidden');
    overlayTextEl.innerHTML = textLines
      .map(l => `<p class="text-zinc-100 text-xs font-bold uppercase tracking-widest">${l}</p>`)
      .join('');
  }

  function hideOverlay() {
    overlayEl.classList.add('hidden');
    overlayTextEl.innerHTML = '';
  }

  function startGame() {
    gameState = 'playing';
    hideOverlay();
    board = createBoard();
    bag = shuffleBag();
    score = 0;
    lines = 0;
    currentPiece = null;
    nextPiece = null;
    updateScoreDisplay();
    spawnPiece();
    render();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(tick, 800);
  }

  function isModalVisible() {
    return !modalEl.classList.contains('hidden');
  }

  function handleTetrisKeys(e: KeyboardEvent) {
    if (!isModalVisible()) return;

    const key = e.key.toLowerCase();

    if (key === 'escape') {
      (window as any).toggleTetris();
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

    if (gameState !== 'playing' || !currentPiece) return;

    let handled = true;

    if (key === 'arrowleft' || key === 'a') {
      if (isValid(currentX - 1, currentY, currentRotation)) currentX--;
    } else if (key === 'arrowright' || key === 'd') {
      if (isValid(currentX + 1, currentY, currentRotation)) currentX++;
    } else if (key === 'arrowdown' || key === 's') {
      if (isValid(currentX, currentY + 1, currentRotation)) currentY++;
    } else if (key === 'arrowup' || key === 'w') {
      const newRot = (currentRotation + 1) % 4;
      if (isValid(currentX, currentY, newRot)) {
        currentRotation = newRot;
      } else if (isValid(currentX - 1, currentY, newRot)) {
        currentX--; currentRotation = newRot;
      } else if (isValid(currentX + 1, currentY, newRot)) {
        currentX++; currentRotation = newRot;
      }
    } else if (key === ' ') {
      hardDrop();
    } else {
      handled = false;
    }

    if (handled) {
      render();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  document.addEventListener('keydown', handleTetrisKeys, true);

  (window as any).toggleTetris = function () {
    const isHidden = modalEl.classList.contains('hidden');
    modalEl.classList.toggle('hidden');
    modalEl.classList.toggle('flex');
    document.body.style.overflow = isHidden ? 'hidden' : '';

    if (isHidden) {
      board = createBoard();
      bag = shuffleBag();
      currentPiece = null;
      nextPiece = null;
      score = 0;
      lines = 0;
      updateScoreDisplay();
      gameState = 'idle';
      buildGrid();
      render();
      showOverlay(['[ tris_v1.0 ]', 'Press [ENTER] to start']);
    } else {
      if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
      gameState = 'idle';
    }
  };

  window.addEventListener('resize', () => {
    if (isModalVisible() && gameState === 'idle') {
      gridContainer = null;
      buildGrid();
      render();
    }
  });
</script>
```

**Step 2: Verify file created**

Run: `head -5 src/components/TetrisGame.astro`
Expected: The opening comment and div with `id="tetris-modal"`

**Step 3: Commit**

```bash
git add src/components/TetrisGame.astro
git commit -m "feat(tetris): add tetris game component with modal and game logic"
```

---

### Task 2: Integrate into Main.astro

**Files:**
- Modify: `src/layouts/Main.astro`

**Step 1: Import TetrisGame component**

In `src/layouts/Main.astro`, add after the SnakeGame import (line 5):

```astro
import TetrisGame from "../components/TetrisGame.astro";
```

**Step 2: Add TetrisGame component after SnakeGame**

After `<SnakeGame />` (line 100), add:

```astro
    <TetrisGame />
```

**Step 3: Add ESC handler for tetris modal**

In the escape key handler section (after the snake-modal ESC check, around line 176), add:

```typescript
if (!document.getElementById('tetris-modal')?.classList.contains('hidden')) { (window as any).toggleTetris(); return; }
```

**Step 4: Add `tris` command to key buffer**

After the `snake` command check (line 186), add:

```typescript
if (keyBuffer === 'tris') { (window as any).toggleTetris(); keyBuffer = ""; return; }
```

**Step 5: Add `possibleStarts` entry for 't'**

Update the `possibleStarts` array (line 209) from:

```typescript
const possibleStarts = ['s', 'm'];
```

to:

```typescript
const possibleStarts = ['s', 'm', 't'];
```

**Step 6: Add tetris to help modal Functions list**

After the `snake_game / SNAKE` entry (around line 89), add:

```html
<div class="flex justify-between items-center group/item text-xs">
  <span class="opacity-70 group-hover/item:opacity-100 transition-opacity">tetris_game</span>
  <span class="text-zinc-100 font-bold bg-zinc-100/10 px-1.5 rounded">TRIS</span>
</div>
```

**Step 7: Commit**

```bash
git add src/layouts/Main.astro
git commit -m "feat(tetris): integrate tetris game command into keyboard handler and help modal"
```

---

### Task 3: Build verification and testing

**Files:**
- Possibly modify: `src/components/TetrisGame.astro`, `src/layouts/Main.astro`

**Step 1: Run the build**

Run: `npx astro build 2>&1 | tail -10` (requires Node 22+)

If Node version is too low, verify syntax by reading the files and checking for obvious issues.

**Step 2: Manual testing checklist (in browser with `bun dev`)**

1. Type `tris` — modal appears centered, board shows dot grid, overlay says "Press [ENTER] to start"
2. Press Enter — piece spawns at top, starts falling
3. Arrow keys / WASD — move and rotate piece
4. Space — hard drop
5. Complete a line — it clears, score updates (+100 per line, +400 for 4)
6. Stack to top — game over screen shows
7. Enter — restarts
8. ESC — closes modal
9. Type `tris` again — fresh idle state
10. Check next piece preview updates correctly
11. High score persists after close/reopen
12. Type `man` — help modal shows `tetris_game / TRIS`
13. Other shortcuts still work when tetris modal is closed

**Step 3: Fix any issues and commit**

```bash
git add src/components/TetrisGame.astro src/layouts/Main.astro
git commit -m "fix(tetris): polish after manual testing"
```
