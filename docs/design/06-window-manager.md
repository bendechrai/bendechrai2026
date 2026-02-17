# Window Manager Architecture

> A lightweight, theme-aware window manager that provides draggable and resizable
> panel behavior. Used by the Holographic and Windows 3.1 themes. Other themes
> (LCARS, Cyberpunk, Retro Terminal) use static grid-based layouts and opt out entirely.

---

## Design Principles

1. **Theme declares behavior, manager executes it.** The window manager reads a behavior mode from the active theme and adapts. No theme-specific code in the manager itself.
2. **Same HTML, different physics.** All panels use the same DOM structure. The manager attaches/detaches pointer handlers based on the active theme.
3. **Zero behavior when static.** For themes that don't use windowing, the manager does nothing — no event listeners, no position tracking, no overhead.
4. **Accessible by default.** Keyboard-only window movement (arrow keys when title bar focused), screen-reader-friendly ARIA roles, focus management on z-order changes.

---

## Behavior Modes

Each theme declares a panel behavior via a CSS custom property on `:root`:

```css
[data-theme="lcars"]     { --panel-behavior: static; }
[data-theme="cyberpunk"] { --panel-behavior: static; }
[data-theme="terminal"]  { --panel-behavior: static; }
[data-theme="holo"]      { --panel-behavior: gestural; }
[data-theme="win31"]     { --panel-behavior: rigid; }
```

The manager reads this on theme change and reconfigures:

| Mode | Drag | Resize | Z-order | Minimize | Maximize | Physics |
|------|------|--------|---------|----------|----------|---------|
| `static` | No | No | No | No | No | N/A |
| `gestural` | Anywhere on panel | No | Yes (click to raise) | No | No | Momentum + deceleration |
| `rigid` | Title bar only | All edges + corners | Yes (click to raise) | Yes (to icon) | Yes (fill desktop) | None — instant snap |

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│  ThemeProvider (React context)                    │
│  - activeTheme: string                           │
│  - setTheme(name): void                          │
│  - panelBehavior: 'static' | 'gestural' | 'rigid'│
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│  WindowManager (hook: useWindowManager)           │
│  - Reads panelBehavior from ThemeProvider         │
│  - Manages panel state: { id, x, y, w, h, z }   │
│  - Attaches/detaches pointer event handlers       │
│  - Provides panel props: style, onPointerDown, etc│
│  - On theme change: resets positions OR transitions│
└────────────────────┬─────────────────────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  Panel   │ │  Panel   │ │  Panel   │
    │  (React) │ │  (React) │ │  (React) │
    │          │ │          │ │          │
    │ articles │ │  events  │ │  talks   │
    └──────────┘ └──────────┘ └──────────┘
```

### Panel State

Each panel tracks:

```typescript
interface PanelState {
  id: string;             // e.g. 'articles', 'events', 'talks', 'contact'
  x: number;              // left offset (px), ignored in static mode
  y: number;              // top offset (px), ignored in static mode
  width: number;          // panel width (px), ignored in static mode
  height: number;         // panel height (px), ignored in static mode
  z: number;              // z-index (stacking order)
  minimized: boolean;     // only used in rigid mode
  maximized: boolean;     // only used in rigid mode
  visible: boolean;       // whether the panel is open at all
}
```

In `static` mode, `x/y/width/height` are ignored — CSS grid handles layout.
In `gestural` and `rigid` modes, panels are `position: absolute` and placed by the manager.

### Theme Change Behavior

When the user switches themes:

1. Manager reads the new `panelBehavior`
2. If switching **to static**: panels animate back to grid positions (CSS transition), then manager detaches all listeners
3. If switching **from static to gestural/rigid**: panels get initial positions calculated from their current grid rects (`getBoundingClientRect()`), then manager attaches listeners
4. If switching **between gestural and rigid**: physics change, but positions persist

---

## Gestural Mode (Holographic)

For the holographic theme. Panels feel like they're floating in space.

### Drag

- **Grab anywhere** on the panel to drag (entire panel surface is the handle)
- Cursor changes to `grab` on hover, `grabbing` while dragging
- During drag: panel follows pointer with **no lag** (`transform: translate()`)
- On release: panel continues with **momentum** — velocity from the last ~50ms of movement, decelerating with friction
- Momentum uses `requestAnimationFrame` loop with exponential decay:
  ```
  velocity *= friction;  // friction ≈ 0.92
  position += velocity;
  if (|velocity| < 0.5) stop;
  ```
- Panels **bounce softly** off viewport edges (reverse velocity * 0.3)

### Parallax (bonus, layered on top)

- On `mousemove`, each panel shifts slightly based on its z-order
- Higher z-index panels shift more, lower panels shift less → depth illusion
- Uses CSS custom properties set from JS:
  ```js
  // 10 lines of JS — sets --mx and --my on :root
  document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
    const my = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
    document.documentElement.style.setProperty('--mx', mx.toString());
    document.documentElement.style.setProperty('--my', my.toString());
  });
  ```
- Each panel applies: `translate(calc(var(--mx) * var(--parallax-factor) * 1px), ...)`
- Parallax is **additive** to drag position, not a replacement
- Disabled when `prefers-reduced-motion` is active

### Z-Order

- Click/tap a panel to raise it to the top
- No visual change to panels on raise (no title bar color change — holo panels are all translucent)

---

## Rigid Mode (Windows 3.1)

For the Windows 3.1 theme. Panels behave like real Win 3.1 windows.

### Drag

- **Title bar only** — clicking the panel body does NOT initiate a drag
- During drag: a **dotted rectangle outline** follows the pointer (the panel itself does NOT move)
  ```css
  .drag-outline {
    position: absolute;
    border: 2px dotted #000000;
    background: transparent;
    pointer-events: none;
  }
  ```
- On release: the panel **snaps instantly** to the outline position (no animation, no transition)
- **No momentum.** Release = stop.

### Resize

- All four edges and all four corners are resize handles
- Resize handles are narrow hit zones (4-6px) along the panel border
- Cursor changes: `n-resize`, `s-resize`, `e-resize`, `w-resize`, `ne-resize`, `nw-resize`, `se-resize`, `sw-resize`
- During resize: same dotted rectangle outline as drag
- On release: panel snaps to new size
- **Minimum size**: 200×100px (prevents collapsing to nothing)
- **Maximum size**: viewport bounds

### Minimize

- Clicking the minimize button (`_`) collapses the window to a small icon at the bottom of the desktop
- Minimized icons are arranged left-to-right along the bottom
- Double-clicking a minimized icon restores the window to its previous position and size
- The icon shows the panel's icon + title

### Maximize

- Clicking the maximize button (`□`) expands the window to fill the full desktop area
- The maximize button changes to a "restore" icon (`⧉`) when maximized
- Clicking restore returns the window to its previous position and size
- Double-clicking the title bar also toggles maximize/restore

### Close

- Clicking the close button (`×`) hides the window (`visible: false`)
- The window can be re-opened from the Program Manager

### Z-Order

- Clicking anywhere on a window raises it to front
- The **active** (front) window gets a blue title bar (#000080)
- All **inactive** windows get a gray title bar (#808080)
- Focus follows z-order — the active window receives keyboard input

---

## Shared Pointer Math

Both modes share the same core pointer tracking logic:

```typescript
function usePointerDrag(options: {
  onStart: (e: PointerEvent) => void;
  onMove: (e: PointerEvent, delta: { dx: number; dy: number }) => void;
  onEnd: (e: PointerEvent, velocity: { vx: number; vy: number }) => void;
}) {
  // - Captures pointer on down (setPointerCapture)
  // - Tracks delta from start position
  // - Computes velocity from last N samples (rolling window, ~50ms)
  // - Calls onEnd with velocity (used by gestural mode, ignored by rigid mode)
  // - Works with mouse, touch, and pen (PointerEvent unifies all three)
}
```

This is the only shared code. Everything else diverges:

| Concern | Gestural | Rigid |
|---------|----------|-------|
| What to move during drag | The panel itself | A dotted outline |
| On release | Apply momentum | Snap panel to outline position |
| Resize | Not supported | Full edge + corner resize |
| Minimize/Maximize | Not supported | Full window chrome |
| Title bar | Not rendered | Rendered with buttons |

---

## HTML Structure

The panel HTML is identical across all themes. Theme CSS controls whether title bars, resize handles, etc. are visible:

```html
<!-- One panel — same markup for all themes -->
<section class="panel" data-panel="articles" role="region" aria-label="Articles">
  <!-- Title bar: visible in win31, hidden in others -->
  <header class="panel-titlebar">
    <span class="panel-title">Articles</span>
    <div class="panel-controls">
      <button class="panel-minimize" aria-label="Minimize">_</button>
      <button class="panel-maximize" aria-label="Maximize">□</button>
      <button class="panel-close" aria-label="Close">×</button>
    </div>
  </header>

  <!-- Content area -->
  <div class="panel-content">
    <!-- Section content rendered here -->
  </div>
</section>
```

Theme CSS:
```css
/* Hide window chrome in non-windowed themes */
[data-theme="lcars"] .panel-titlebar,
[data-theme="cyberpunk"] .panel-titlebar,
[data-theme="terminal"] .panel-titlebar { display: none; }

/* Show and style it in Win 3.1 */
[data-theme="win31"] .panel-titlebar { display: flex; /* ... Win 3.1 styles */ }

/* In holographic, hide the chrome but allow grab on entire panel */
[data-theme="holo"] .panel-titlebar { display: none; }
[data-theme="holo"] .panel { cursor: grab; }
```

---

## Theme Transition

When switching themes, panels need to transition between positioned (absolute) and grid-based (static) layouts smoothly:

1. **Read current rects**: Before theme change, snapshot every panel's `getBoundingClientRect()`
2. **Apply new theme**: Set `data-theme` on root
3. **FLIP transition** (First, Last, Invert, Play):
   - "First" = rects from step 1
   - "Last" = read new rects after theme applied
   - "Invert" = apply `transform` to make panels appear at old positions
   - "Play" = animate `transform` to `none` (panels slide to new positions)
4. This gives smooth panel rearrangement on theme switch, regardless of layout mode

Exception: Win 3.1 has `transition: none` everywhere, so panels switching **to** Win 3.1 should snap instantly (skip the FLIP).

---

## Accessibility

### Keyboard

- **Tab** cycles through panels (focus on title bar or panel surface)
- **Arrow keys** (when panel focused): move panel by 10px per press (both modes)
- **Shift + Arrow keys**: resize panel by 10px (rigid mode only)
- **Enter/Space** on minimize/maximize/close buttons: trigger action
- **Escape**: if a panel is being dragged, cancel and return to original position

### ARIA

- Each panel has `role="region"` and `aria-label`
- Title bar buttons have `aria-label` attributes
- Active/focused panel announced: `aria-current="true"` on the raised panel
- Minimized panels: `aria-hidden="true"` on the panel, label persists on the minimized icon

### Reduced Motion

- `prefers-reduced-motion: reduce`:
  - Gestural mode: no momentum, panel stops immediately on release
  - No parallax effect
  - FLIP transitions replaced with instant swap
  - All animations disabled
- Rigid mode is unaffected (already has no animations)

---

## Performance

- All position updates use `transform: translate()` (composited, no layout thrashing)
- Momentum animation uses `requestAnimationFrame` (not setInterval)
- Resize uses `will-change: transform` on the outline element, not the panel
- Panel content uses `contain: layout style` to prevent reflow from bubbling
- Pointer events use `setPointerCapture` (no need for window-level listeners)
- When in static mode: zero listeners attached, zero overhead
