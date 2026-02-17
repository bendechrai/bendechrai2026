# CSS Visual Effects Reference

> Advanced CSS-only visual effects for building sci-fi themed interfaces.
> All GPU-composited where noted. Zero JavaScript unless stated.

---

## 1. CSS-Only Glitch Effect

Simulates digital corruption and chromatic aberration. Two pseudo-elements duplicate the text, then `clip-path` + `@keyframes` randomly slice and shift them with offset colors.

Runs on the compositor thread at 60fps. `clip-path` and `transform` are GPU-composited.

**Browser support:** All modern browsers. `clip-path: inset()` baseline since 2023.

```css
.glitch {
  position: relative;
  font-family: 'Share Tech Mono', monospace;
  color: #0ff;
}
.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}
.glitch::before {
  color: #f0f;
  animation: glitch-1 2s infinite linear alternate-reverse;
  clip-path: inset(20% 0 40% 0);
}
.glitch::after {
  color: #0f0;
  animation: glitch-2 3s infinite linear alternate;
  clip-path: inset(60% 0 5% 0);
}

@keyframes glitch-1 {
  0%   { transform: translate(0); clip-path: inset(20% 0 40% 0); }
  20%  { transform: translate(-3px, 2px); clip-path: inset(5% 0 80% 0); }
  40%  { transform: translate(3px, -1px); clip-path: inset(45% 0 15% 0); }
  60%  { transform: translate(-2px, 1px); clip-path: inset(70% 0 5% 0); }
  80%  { transform: translate(2px, -2px); clip-path: inset(10% 0 60% 0); }
  100% { transform: translate(0); clip-path: inset(35% 0 25% 0); }
}

@keyframes glitch-2 {
  0%   { transform: translate(0); clip-path: inset(60% 0 5% 0); }
  25%  { transform: translate(2px, 1px); clip-path: inset(15% 0 55% 0); }
  50%  { transform: translate(-1px, -2px); clip-path: inset(80% 0 2% 0); }
  75%  { transform: translate(3px, -1px); clip-path: inset(25% 0 40% 0); }
  100% { transform: translate(0); clip-path: inset(50% 0 20% 0); }
}
```

**HTML requirement:** `<h1 class="glitch" data-text="SYSTEM ERROR">SYSTEM ERROR</h1>`

**Theme use:** Cyberpunk hero headings, warning alerts, terminal error messages.

---

## 2. Glassmorphism (`backdrop-filter`)

Frosted-glass panels. One line replaces what previously required layered canvas blurs.

**Browser support:** ~97% global. Chrome 76+, Safari 9+, Firefox 103+. Include `-webkit-` prefix.

```css
.glass-panel {
  background: rgba(0, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(1.4) brightness(1.1);
  -webkit-backdrop-filter: blur(12px) saturate(1.4) brightness(1.1);
  border: 1px solid rgba(0, 255, 255, 0.15);
  border-radius: 4px;
  box-shadow:
    0 0 20px rgba(0, 255, 255, 0.1),
    inset 0 0 20px rgba(0, 255, 255, 0.05);
}

/* Graceful fallback */
@supports not (backdrop-filter: blur(1px)) {
  .glass-panel {
    background: rgba(10, 15, 30, 0.92);
  }
}
```

**Performance note:** Limit to 2-3 blur panels per viewport.

**Theme use:** Holographic floating panels, cyberpunk HUD overlays, command palette backdrop.

---

## 3. `clip-path` Animation

Defines clipping regions. Transitions between shapes create reveal/conceal effects. GPU-accelerated, no layout impact.

**Browser support:** Baseline since 2023 for `inset()`, `circle()`, `ellipse()`, `polygon()`.

```css
/* Wipe reveal */
.data-reveal {
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
}
.data-reveal.visible {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

/* Circular radar reveal */
.radar-ping {
  clip-path: circle(0% at 50% 50%);
  animation: radar-expand 2s ease-out forwards;
}
@keyframes radar-expand {
  to { clip-path: circle(75% at 50% 50%); }
}

/* Angular cyberpunk panel shape */
.cyber-panel {
  clip-path: polygon(
    0 0,
    calc(100% - 20px) 0,
    100% 20px,
    100% 100%,
    20px 100%,
    0 calc(100% - 20px)
  );
}
```

**Theme use:** Cyberpunk angled panel shapes, holographic circular reveals, LCARS elbow curves, retro terminal boot reveal.

---

## 4. `mix-blend-mode` Effects

Photoshop blend modes in the browser. Enables duotone imagery, color overlays, text knockouts, holographic iridescence.

**Browser support:** ~97%. Creates a new stacking context.

```css
/* Holographic shimmer overlay */
.holo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 0, 255, 0.3),
    rgba(0, 255, 255, 0.3),
    rgba(255, 255, 0, 0.3)
  );
  mix-blend-mode: screen;
  animation: holo-shift 4s ease infinite alternate;
  pointer-events: none;
}
@keyframes holo-shift {
  from { background-position: 0% 0%; }
  to   { background-position: 100% 100%; }
}

/* Neon glow using screen mode */
.neon-text {
  color: #fff;
  background: #000;
  mix-blend-mode: screen;
}
```

**Important:** Use `isolation: isolate` on parent to prevent blending with unintended layers.

**Theme use:** Holographic shimmer, cyberpunk neon overlays, iridescent surface effects.

---

## 5. Conic & Radial Gradient Effects

Sophisticated geometric art, radar sweeps, data visualizations in pure CSS. `@property` makes gradient angles smoothly animatable.

```css
/* Animated radar sweep */
@property --sweep-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.radar {
  width: 200px; height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    from var(--sweep-angle),
    transparent 0deg,
    rgba(0, 255, 0, 0.4) 30deg,
    transparent 60deg
  );
  animation: sweep 3s linear infinite;
}
@keyframes sweep {
  to { --sweep-angle: 360deg; }
}

/* Concentric holographic rings */
.holo-rings {
  background: repeating-radial-gradient(
    circle at center,
    transparent 0px,
    transparent 8px,
    rgba(0, 255, 255, 0.15) 9px,
    rgba(0, 255, 255, 0.15) 10px
  );
}
```

**Theme use:** Cyberpunk radar displays, LCARS data gauges, holographic ring backgrounds, retro terminal oscilloscope effects.

---

## 6. `@counter-style`

Custom counter representations for ordered lists. Binary, hex, custom symbols — no JavaScript.

**Browser support:** Chrome 91+, Firefox 33+, Safari 17+. Baseline.

```css
/* Binary counter for terminal lists */
@counter-style binary {
  system: numeric;
  symbols: "0" "1";
  prefix: "[";
  suffix: "] ";
}

/* Hex counter for memory addresses */
@counter-style hex-addr {
  system: numeric;
  symbols: "0" "1" "2" "3" "4" "5" "6" "7" "8" "9" "A" "B" "C" "D" "E" "F";
  prefix: "0x";
  suffix: " :: ";
  pad: 4 "0";
}

/* Cyclic status indicators */
@counter-style status-dots {
  system: cyclic;
  symbols: "\25CF" "\25CB" "\25C6";
  suffix: " ";
}

ol.terminal-log { list-style: binary; }
ol.memory-dump  { list-style: hex-addr; }
```

**Theme use:** Retro terminal binary-numbered log entries, cyberpunk hex-prefixed lists.

---

## 7. CSS `mask-image`

Masks with gradient transparency (unlike clip-path which is binary). Supports partial transparency, multiple layers, luminance-based masking.

**Browser support:** Widely supported with `-webkit-` prefix.

```css
/* Scanline mask */
.scanline-mask {
  -webkit-mask-image: repeating-linear-gradient(
    to bottom,
    rgba(0,0,0,1) 0px,
    rgba(0,0,0,1) 2px,
    rgba(0,0,0,0.3) 2px,
    rgba(0,0,0,0.3) 4px
  );
  mask-image: repeating-linear-gradient(
    to bottom,
    rgba(0,0,0,1) 0px,
    rgba(0,0,0,1) 2px,
    rgba(0,0,0,0.3) 2px,
    rgba(0,0,0,0.3) 4px
  );
}

/* Hex grid mask */
.hex-viewport {
  -webkit-mask-image: url('hex-pattern.svg');
  mask-image: url('hex-pattern.svg');
  -webkit-mask-size: 60px 60px;
  mask-size: 60px 60px;
  mask-repeat: repeat;
}
```

**Theme use:** CRT scanline overlays, hexagonal viewport grids, holographic edge-fade effects.

---

## 8. CSS-Only Typewriter Effect

Character-by-character text reveal using `width` animation with `steps()` on monospace text.

**Browser support:** Universal. `steps()` baseline since 2012.

```css
.typewriter {
  font-family: 'VT323', monospace;
  color: #0f0;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #0f0;
  width: 0;
  animation:
    type 3s steps(30, end) 1s forwards,
    blink 0.75s step-end infinite;
}

@keyframes type {
  to { width: 30ch; }
}

@keyframes blink {
  50% { border-color: transparent; }
}
```

**Key insight:** The `ch` unit = width of one character in monospace. `steps(N)` = N discrete jumps, one per character.

**Theme use:** Retro terminal boot sequence, cyberpunk incoming transmissions, holographic text materialization.

---

## 9. CRT Scanline + Flicker Effect

Simulates CRT monitor using `repeating-linear-gradient`, `@keyframes` flicker, and `text-shadow` phosphor glow.

```css
.crt-screen {
  position: relative;
  background: #0a0a0a;
  color: #0f0;
  font-family: 'VT323', monospace;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
  border-radius: 20px; /* CRT curvature */
  overflow: hidden;
}

/* Scanlines */
.crt-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 1px,
    rgba(0, 0, 0, 0.3) 1px,
    rgba(0, 0, 0, 0.3) 2px
  );
  pointer-events: none;
  z-index: 10;
}

/* Rolling refresh line */
.crt-screen::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 255, 0, 0.03) 50%,
    transparent 100%
  );
  background-size: 100% 30%;
  animation: scanroll 6s linear infinite;
  pointer-events: none;
  z-index: 11;
}

@keyframes scanroll {
  from { background-position: 0 -100%; }
  to   { background-position: 0 200%; }
}

/* Subtle flicker */
@keyframes flicker {
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.85; }
  94% { opacity: 1; }
  96% { opacity: 0.92; }
  97% { opacity: 1; }
}
.crt-screen { animation: flicker 4s infinite; }

/* MANDATORY: Accessibility */
@media (prefers-reduced-motion: reduce) {
  .crt-screen,
  .crt-screen::before,
  .crt-screen::after {
    animation: none;
  }
}
```

**Theme use:** Retro terminal (primary effect), cyberpunk secondary displays.

---

## 10. CSS Particle Effects

Floating particles using `box-shadow` hack (single element, many dots) or individual elements with staggered animations. GPU-composited via `transform` and `opacity`.

```css
/* Starfield — single element, many particles via box-shadow */
.starfield {
  width: 2px; height: 2px;
  background: transparent;
  box-shadow:
    120px 50px #fff,
    430px 200px #fff,
    780px 340px #0ff,
    250px 480px #fff,
    600px 120px #0ff,
    340px 390px #fff,
    900px 560px #fff,
    50px 300px #0ff,
    770px 100px #fff,
    150px 560px #fff;
  animation: drift 60s linear infinite;
}

@keyframes drift {
  from { transform: translateY(0); }
  to   { transform: translateY(-100vh); }
}

/* Individual floating particle with depth */
.particle {
  position: absolute;
  width: 3px; height: 3px;
  background: #0ff;
  border-radius: 50%;
  opacity: 0;
  animation: float 8s ease-in-out infinite;
}
.particle:nth-child(odd) {
  filter: blur(1px);
  animation-duration: 12s;
}

@keyframes float {
  0%   { transform: translateY(100vh) scale(0); opacity: 0; }
  20%  { opacity: 0.8; }
  80%  { opacity: 0.6; }
  100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
}
```

**Theme use:** Holographic ambient particles, cyberpunk data motes, retro terminal "digital rain."

---

## 11. CSS Grid Animation

Animate `grid-template-columns` and `grid-template-rows` between states. Panels resize fluidly.

**Browser support:** Animatable `grid-template-*` is baseline in Chrome, Firefox, Safari.

```css
.hud-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
  transition: grid-template-columns 0.6s ease;
}

/* Expand center panel */
.hud-grid.focus-center {
  grid-template-columns: 0.5fr 2fr 0.5fr;
}

/* Collapse to single column */
.hud-grid.alert-mode {
  grid-template-columns: 0fr 1fr 0fr;
}
```

**Theme use:** LCARS panel reconfiguration, cyberpunk HUD mode switching, holographic panel focus/collapse.

---

## 12. Multi-Step `@keyframes` Choreography

Orchestrate complex boot sequences without JavaScript timers.

```css
@keyframes hud-boot {
  0%   { opacity: 0; transform: scale(0.8); filter: brightness(3); }
  15%  { opacity: 1; transform: scale(1.02); filter: brightness(2); }
  20%  { opacity: 0.5; transform: scale(1); filter: brightness(1); }
  25%  { opacity: 1; }
  30%  { clip-path: inset(0 100% 0 0); }
  60%  { clip-path: inset(0 0 0 0); }
  100% { opacity: 1; transform: scale(1); }
}

.hud-element {
  animation: hud-boot 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Staggered children */
.hud-element:nth-child(1) { animation-delay: 0s; }
.hud-element:nth-child(2) { animation-delay: 0.3s; }
.hud-element:nth-child(3) { animation-delay: 0.6s; }
```

**Theme use:** All boot sequences. LCARS bars drawing in. Cyberpunk panels glitching on. Retro terminal lines typing out. Holographic rings drawing and panels materializing.

---

## 13. `accent-color` for Form Controls

Theme native form controls in one line. Browser handles contrast automatically.

**Browser support:** Baseline since 2022. All modern browsers.

```css
:root {
  accent-color: #0ff;
  color-scheme: dark;
}

input[type="checkbox"].warning { accent-color: #f0f; }
input[type="range"].power { accent-color: #0f0; }
progress.download { accent-color: #ff0; }
```

**Theme use:** All themes — instantly themed checkboxes, radios, sliders, progress bars matching the neon palette.

---

## Performance Guidelines

| Technique | GPU Composited? | Performance Notes |
|-----------|:---:|---|
| Glitch Effect | Yes | `clip-path` + `transform` only |
| `backdrop-filter` | Yes | Limit to 2-3 per viewport |
| `clip-path` Animation | Yes | No layout thrashing |
| `mix-blend-mode` | Partially | Creates stacking context |
| Conic/Radial Gradients | Yes | Static = free; animated via `@property` = cheap |
| `mask-image` | Yes | Static = cheap; animated = moderate |
| Typewriter | Yes | `width` + `overflow: hidden` |
| CRT Scanlines | Yes | `repeating-linear-gradient` on pseudo-element |
| Particles | Yes | `transform` + `opacity` only |
| Grid Animation | No (layout) | Causes reflow; use sparingly |
| Multi-step Keyframes | Partially | Depends on animated properties |
