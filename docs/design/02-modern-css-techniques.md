# Modern CSS Techniques Reference

> Cutting-edge CSS features (2025-2026) that replace JavaScript and enable the sci-fi
> homepage themes. All techniques listed here are production-ready unless noted.

---

## 1. Container Queries

**What it does:** Style elements based on their parent container's size, not the viewport.

**Browser support:** All major browsers since 2023. Production-ready.

**Code example:**
```css
.mission-panel {
  container: mission-panel / inline-size;
}

@container mission-panel (inline-size > 600px) {
  .mission-card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container mission-panel (inline-size <= 600px) {
  .mission-card {
    display: flex;
    flex-direction: column;
  }
}
```

**Theme use:** Each panel (articles, events, talks) reshuffles its layout based on how much space it has in the current theme's layout, not the viewport. LCARS sidebar being present means content area is narrower; holographic floating panels vary in size.

---

## 2. Scroll-Driven Animations

**What it does:** Links CSS animations to scroll position instead of time. Two timeline types: `scroll()` (scroll container position) and `view()` (element visibility in scrollport).

**Browser support:** Chrome 115+, Edge 115+, Safari 26+. Progressive enhancement.

**Code example:**
```css
/* Progress bar that fills as you scroll */
.progress-bar {
  animation: fill-progress linear;
  animation-timeline: scroll(root);
}

@keyframes fill-progress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

/* Element fades in as it enters viewport */
.card {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(60px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Theme use:** Holographic theme — panels materialize as they scroll into view. Cyberpunk — glitch intensity increases as elements enter viewport. All themes — scroll progress indicator.

---

## 3. `@property` (Custom Property Animation)

**What it does:** Registers CSS custom properties with types (`<color>`, `<angle>`, `<percentage>`, `<length>`, `<number>`). Once typed, the browser can interpolate between values — enabling smooth animation of gradients, individual transform components, and CSS-only counters.

**Browser support:** Baseline since July 2024. All modern browsers. Production-ready.

**Code example:**
```css
@property --sweep-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@property --energy-level {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.reactor-core {
  --sweep-angle: 0deg;
  --energy-level: 20%;
  background: conic-gradient(
    from var(--sweep-angle),
    hsl(180 100% 50%) var(--energy-level),
    hsl(280 100% 20%) 100%
  );
  animation: pulse 3s ease-in-out infinite alternate;
}

@keyframes pulse {
  to {
    --sweep-angle: 120deg;
    --energy-level: 80%;
  }
}
```

**Theme use:** Cyberpunk radar sweeps, holographic ring animations, LCARS data gauges with smoothly animating gradient fills. Previously required JavaScript to animate gradient stops.

---

## 4. Anchor Positioning

**What it does:** Natively positions elements relative to other elements anywhere in the DOM. Supports fallback positions when space runs out.

**Browser support:** Chrome 125+, Edge 125+. Firefox partial. Polyfill from Oddbird available.

**Code example:**
```css
.target-marker {
  anchor-name: --target;
}

.tooltip {
  position: fixed;
  position-anchor: --target;
  position-area: top;
  margin-bottom: 8px;
  position-try-fallbacks: flip-block;
}
```

**Theme use:** Tooltips on LCARS sidebar buttons, cyberpunk HUD info popups, holographic panel contextual overlays. Replaces Popper.js/Floating UI.

---

## 5. View Transitions API

**What it does:** Animates between two DOM states by snapshotting old and new states, then crossfading/custom-animating between them.

**Browser support:** SPA: Chrome 111+, Safari 18+, Firefox 144+. MPA (cross-document): Chrome 126+.

**Code example:**
```css
@view-transition {
  navigation: auto;
}

.panel {
  view-transition-name: main-content;
}

::view-transition-old(main-content) {
  animation: shrink-fade 0.3s ease-out;
}
::view-transition-new(main-content) {
  animation: grow-reveal 0.3s ease-in;
}
```

**Theme use:** Smooth transitions when switching between content sections (articles -> events). LCARS: content area crossfade. Cyberpunk: glitch transition. Holographic: materialize/dematerialize.

---

## 6. `:has()` Selector

**What it does:** The "parent selector." Styles an element based on what it contains or what follows it. Enables conditional styling without JavaScript class toggling.

**Browser support:** Baseline since December 2023. All modern browsers. Most-loved CSS feature in State of CSS 2025.

**Code example:**
```css
/* Style card differently when it has an alert */
.card:has(.alert-badge) {
  border-color: #f00;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
}

/* Lock scrolling when dialog is open */
html:has(dialog[open]) {
  overflow: hidden;
}

/* Theme toggle without JavaScript */
html:has(#theme-toggle:checked) {
  --bg: #0a0a1a;
  --accent: #0ff;
}

/* Quantity query: change layout with 4+ items */
.grid:has(.card:nth-child(4)) {
  grid-template-columns: repeat(2, 1fr);
}
```

**Theme use:** Theme switching via checkbox, auto-layout changes based on content count, dialog scroll-locking, conditional panel styling based on content state.

---

## 7. `@layer` (Cascade Layers)

**What it does:** Explicit, declarative control over the CSS cascade. Named layers with priority order. Eliminates specificity wars.

**Browser support:** All browsers since 2022. Production-ready.

**Code example:**
```css
@layer reset, base, theme, components, overrides;

@layer base {
  body { font-family: 'Orbitron', system-ui; background: #0a0a1a; }
}

@layer theme {
  .btn { background: var(--accent); border: 1px solid var(--accent); }
}

@layer overrides {
  .btn { background: var(--override-bg); } /* Always wins */
}
```

**Theme use:** Base styles in one layer, theme-specific styles in another, component overrides in the highest layer. Clean separation between the four themes without specificity conflicts.

---

## 8. Subgrid

**What it does:** Grid item inherits parent grid's track definitions. Nested elements align with the parent grid.

**Browser support:** ~97% global support. Chrome 117+, Firefox 71+, Safari 16+. Production-ready.

**Code example:**
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1.5rem;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
}
```

**Theme use:** Article cards, event listings, and talk cards align their titles, dates, and descriptions across siblings — regardless of varying content lengths.

---

## 9. `color-mix()`

**What it does:** Mixes two colors at specified ratios in any color space (oklch, oklab, srgb, hsl). Replaces Sass `mix()`/`darken()`/`lighten()` with native runtime CSS.

**Browser support:** Baseline since mid-2023. All modern browsers.

**Code example:**
```css
:root {
  --accent: oklch(0.75 0.18 195);
}

.panel {
  /* Darken */
  background: color-mix(in oklch, var(--accent) 70%, black);

  /* Lighten on hover */
  &:hover {
    background: color-mix(in oklch, var(--accent) 85%, white);
  }
}

/* Generate tint scale from one color */
.scale {
  --100: color-mix(in oklch, var(--accent) 10%, white);
  --300: color-mix(in oklch, var(--accent) 30%, white);
  --500: var(--accent);
  --700: color-mix(in oklch, var(--accent) 70%, black);
  --900: color-mix(in oklch, var(--accent) 90%, black);
}
```

**Theme use:** Generate entire color scales from a single accent color per theme. Hover/focus states derived dynamically. Theme switching only requires changing one or two custom properties.

---

## 10. `@scope`

**What it does:** Scopes CSS rules to a DOM subtree with optional upper and lower bounds ("donut scope"). Adds proximity-based specificity.

**Browser support:** Baseline late 2025. Chrome 118+, Firefox 146+, Safari 17.4+. Production-ready.

**Code example:**
```css
@scope (.lcars-theme) to (.content-area) {
  h2 { font-family: 'Antonio', sans-serif; text-transform: uppercase; }
  .btn { border-radius: 999px; } /* pill shape */
}

@scope (.cyberpunk-theme) to (.content-area) {
  h2 { font-family: 'Orbitron', monospace; }
  .btn { clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }
}
```

**Theme use:** Each theme's structural chrome styles are scoped and don't leak into content areas or nested widgets. Theme styles don't conflict with each other.

---

## 11. Discrete Property Animation (`display: none` Transitions)

**What it does:** `transition-behavior: allow-discrete` + `@starting-style` allow animating elements to/from `display: none`. The holy grail of CSS animation.

**Browser support:** Chrome 117+, Firefox 129+, Safari 17.4+. Production-ready.

**Code example:**
```css
.panel {
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease,
    display 0.4s allow-discrete,
    overlay 0.4s allow-discrete;

  @starting-style {
    opacity: 0;
    transform: scale(0.85);
  }
}

.panel.hidden {
  opacity: 0;
  transform: scale(0.85);
  display: none;
}
```

**Theme use:** Holographic panels that materialize from nothing. Cyberpunk notifications that glitch into existence. LCARS content that snaps in. All without JavaScript animation code.

---

## 12. `text-wrap: balance` and `text-wrap: pretty`

**What it does:** `balance` redistributes text across lines evenly (ideal for headings). `pretty` prevents orphans in paragraphs.

**Browser support:** `balance`: Chrome 114+, Firefox 121+, Safari 17.5+. `pretty`: Chrome 117+, Firefox 121+. Progressive enhancement.

**Code example:**
```css
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }
```

**Theme use:** All themes — headings that wrap evenly, body text without orphaned last words.

---

## 13. Native CSS Nesting

**What it does:** Nested selectors directly in CSS. No Sass/SCSS needed.

**Browser support:** All browsers since 2023. Relaxed syntax (no `&` needed before element selectors) since 2024.

**Code example:**
```css
.star-map {
  background: #0a0a1a;

  .system {
    position: relative;
    cursor: pointer;

    &:hover .label {
      opacity: 1;
    }

    &.hostile {
      border: 2px solid #f00;
    }

    @container star-map (inline-size < 400px) {
      .label { display: none; }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none; }
  }
}
```

**Theme use:** All themes — organized, component-scoped CSS without preprocessors. Theme files are self-contained and readable.

---

## 14. Popover API

**What it does:** HTML `popover` attribute creates native popovers. Top-layer promotion (no `z-index` needed), light-dismiss, focus management, keyboard bindings — all built in.

**Browser support:** Baseline since 2024. Chrome 114+, Firefox 125+, Safari 17+.

**Code example:**
```html
<button popovertarget="info-panel">Ship Status</button>

<div id="info-panel" popover>
  <h3>System Status</h3>
  <ul>
    <li>Hull: 94%</li>
    <li>Shields: 78%</li>
  </ul>
</div>
```

```css
[popover] {
  background: rgba(10, 10, 30, 0.95);
  border: 1px solid var(--accent);

  opacity: 0;
  transform: translateY(-10px);
  transition:
    opacity 0.3s, transform 0.3s,
    display 0.3s allow-discrete,
    overlay 0.3s allow-discrete;

  @starting-style {
    opacity: 0;
    transform: translateY(-10px);
  }
}

[popover]:popover-open {
  opacity: 1;
  transform: translateY(0);
}

[popover]::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
```

**Theme use:** Info panels, help dialogs, command palette overlay. Zero JavaScript for open/close/dismiss behavior.

---

## 15. Emerging (2026+)

### CSS `if()` Function
Inline conditional logic in property values:
```css
.alert {
  color: if(style(--severity: critical): #f00; else: #ff0);
}
```

### CSS `@function` and `@mixin`
Custom reusable value functions and declaration blocks (Sass-like, natively):
```css
@function --fluid-size(--min, --max) {
  result: clamp(var(--min), 2vw + 1rem, var(--max));
}
h1 { font-size: --fluid-size(1.5rem, 3rem); }
```

### `corner-shape` Property
Squircle, bevel, notch, scoop corner shapes:
```css
.panel {
  border-radius: 20px;
  corner-shape: squircle;
}
```

### `field-sizing: content`
Auto-growing form fields:
```css
textarea { field-sizing: content; }
```

---

## Summary: What CSS Replaces

| Old Approach (JS) | New Approach (CSS) |
|---|---|
| ResizeObserver for responsive components | Container Queries |
| GSAP ScrollTrigger / IntersectionObserver | Scroll-Driven Animations |
| JS gradient/transform animation | `@property` typed custom properties |
| Popper.js / Floating UI | Anchor Positioning |
| FLIP libraries, page transition JS | View Transitions API |
| JS class toggling, MutationObserver | `:has()` selector |
| `!important` hacks, specificity management | `@layer` cascade layers |
| JS layout alignment calculations | Subgrid |
| Sass `mix()`, `darken()`, `lighten()` | `color-mix()` |
| BEM, CSS Modules, CSS-in-JS | `@scope` |
| JS class toggling for enter/exit | `display: none` transitions |
| JS text balancing libraries | `text-wrap: balance/pretty` |
| Sass/SCSS/Less preprocessors | Native CSS nesting |
| Custom JS modal/tooltip/dropdown | Popover API |
