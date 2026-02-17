# SVG Techniques Reference

> Advanced SVG techniques for building sci-fi UI themes.
> All techniques work without JavaScript unless noted. SVG + CSS only.

---

## 1. SMIL Animations (`<animate>`, `<animateTransform>`, `<animateMotion>`)

SVG's native declarative animation system. Animates SVG geometry attributes (circle radius, path `d`, rectangle position) that CSS cannot touch. Works even inside `<img>` tags.

**Browser support:** All modern browsers (~97%). Google reversed its deprecation decision.

```xml
<!-- Pulsing status indicator -->
<svg width="60" height="60" viewBox="0 0 60 60">
  <circle cx="30" cy="30" r="8" fill="#ff9900">
    <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

<!-- Data packet moving along a circuit path -->
<svg width="400" height="100" viewBox="0 0 400 100">
  <path id="route" d="M10,50 H150 Q170,50 170,30 Q170,10 190,10 H390"
        fill="none" stroke="#00ffcc" stroke-width="1" opacity="0.3"/>
  <circle r="4" fill="#00ffcc">
    <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
      <mpath href="#route"/>
    </animateMotion>
  </circle>
</svg>

<!-- Rotating element -->
<svg viewBox="0 0 100 100">
  <g>
    <animateTransform attributeName="transform" type="rotate"
                      values="0 50 50;360 50 50" dur="10s" repeatCount="indefinite"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="#0ff" stroke-width="1"/>
    <circle cx="50" cy="10" r="3" fill="#0ff"/>
  </g>
</svg>
```

**Theme applications:**
| Theme | Use |
|-------|-----|
| LCARS | Pulsing status indicators, scanner sweep rotations |
| Cyberpunk | Neon pulse on stroke opacity, glitch-like attribute oscillations |
| Retro Terminal | Blinking cursor elements, scrolling scan-line bars |
| Holographic | Rotating ring elements, flickering opacity cycles |

---

## 2. `feTurbulence` + `feDisplacementMap` (Distortion)

`feTurbulence` generates procedural Perlin noise. `feDisplacementMap` uses it to spatially displace content. Creates organic warping, liquid ripples, static, heat haze.

**Browser support:** All modern browsers. SVG filters ~97% support.

```xml
<svg width="0" height="0">
  <!-- Holographic shimmer / glitch distortion -->
  <filter id="holo-distort">
    <feTurbulence type="turbulence" baseFrequency="0.015 0.08"
                  numOctaves="3" seed="2" result="noise">
      <animate attributeName="baseFrequency"
               values="0.015 0.08;0.02 0.09;0.015 0.08"
               dur="4s" repeatCount="indefinite"/>
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" in2="noise"
                       scale="12" xChannelSelector="R" yChannelSelector="G"/>
  </filter>

  <!-- Static noise overlay -->
  <filter id="static-noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.9"
                  numOctaves="4" seed="1" result="noise"/>
    <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
    <feBlend in="SourceGraphic" in2="gray" mode="overlay"/>
  </filter>
</svg>

<!-- Apply to any HTML element -->
<div style="filter: url(#holo-distort);">SYSTEM ONLINE</div>
```

### Key Attributes Reference

| Attribute | Purpose | Typical Values |
|-----------|---------|---------------|
| `baseFrequency` | Noise density (higher = finer) | `0.01-1.0` (two values for x/y) |
| `numOctaves` | Smoothness layers | `1` (rough) to `4` (smooth). More = more CPU |
| `type` | `turbulence` (bold swirls) or `fractalNoise` (soft clouds) | - |
| `scale` | Displacement magnitude | `5-20` for subtle, `20-50` for dramatic |
| `seed` | Specific noise pattern | Any integer |

### Texture Presets

| Effect | `type` | `baseFrequency` | `numOctaves` |
|--------|--------|-----------------|--------------|
| Film grain / CRT static | `fractalNoise` | `0.6-0.8` | `3` |
| Clouds / smoke | `fractalNoise` | `0.01-0.03` | `4-5` |
| Brushed metal | `turbulence` | `0.02 0.5` | `3-4` |
| Marble / organic | `turbulence` | `0.01` | `5` |
| Digital noise | `fractalNoise` | `0.9-1.0` | `1` |

**Performance note:** Keep filter regions small. Avoid animating `feTurbulence` on large areas. `numOctaves` of 3-4 max.

**Theme applications:**
| Theme | Use |
|-------|-----|
| LCARS | Subtle warp-field distortion on background |
| Cyberpunk | Glitch/corruption on text and images, CRT screen warp |
| Retro Terminal | Screen interference, static noise overlay |
| Holographic | Projection shimmer, unstable hologram flickering |

---

## 3. `<clipPath>` Complex Shapes

SVG clipPaths support arbitrary complexity: curves, compound shapes, text cutouts. Use `clipPathUnits="objectBoundingBox"` with 0-1 coordinates for responsive shapes.

**Browser support:** Universal.

```xml
<svg width="0" height="0">
  <defs>
    <!-- LCARS rounded panel -->
    <clipPath id="lcars-panel" clipPathUnits="objectBoundingBox">
      <path d="M0.15,0 H1 V1 H0 V0.25 Q0,0 0.15,0 Z"/>
    </clipPath>

    <!-- Hexagonal clip -->
    <clipPath id="hex-clip" clipPathUnits="objectBoundingBox">
      <polygon points="0.5,0 1,0.25 1,0.75 0.5,1 0,0.75 0,0.25"/>
    </clipPath>

    <!-- Angled cyberpunk panel -->
    <clipPath id="cyber-clip" clipPathUnits="objectBoundingBox">
      <polygon points="0.05,0 1,0 0.95,1 0,1"/>
    </clipPath>
  </defs>
</svg>

<style>
  .lcars-content { clip-path: url(#lcars-panel); }
  .avatar-hex    { clip-path: url(#hex-clip); }
  .cyber-card    { clip-path: url(#cyber-clip); }
</style>
```

**Theme applications:**
| Theme | Use |
|-------|-----|
| LCARS | Rounded-rectangle panels with asymmetric corners, elbow cutouts |
| Cyberpunk | Hexagonal frames, angular/chevron containers, shattered-glass regions |
| Retro Terminal | CRT barrel-distortion curve on outer container |
| Holographic | Diamond and polygon frames |

---

## 4. `<pattern>` Fills

Infinitely tiling SVG patterns. Resolution-independent. No image files.

**Browser support:** Universal. Core SVG feature.

```xml
<svg width="0" height="0">
  <defs>
    <!-- Scanline pattern -->
    <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="4" y2="0"
            stroke="#00ff88" stroke-width="0.5" opacity="0.15"/>
    </pattern>

    <!-- Dot matrix -->
    <pattern id="dot-matrix" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="1" fill="#00ffcc" opacity="0.3"/>
    </pattern>

    <!-- Circuit-board traces -->
    <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0,20 H15 V10 H25 V20 H40"
            fill="none" stroke="#ff00ff" stroke-width="0.5" opacity="0.2"/>
      <path d="M20,0 V8 H30 V32 H20 V40"
            fill="none" stroke="#ff00ff" stroke-width="0.5" opacity="0.15"/>
      <circle cx="15" cy="10" r="1.5" fill="#ff00ff" opacity="0.3"/>
      <circle cx="30" cy="32" r="1.5" fill="#ff00ff" opacity="0.3"/>
    </pattern>
  </defs>
</svg>

<!-- Full-screen overlay usage -->
<svg style="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;">
  <rect width="100%" height="100%" fill="url(#scanlines)"/>
</svg>
```

**Theme applications:**
| Theme | Use |
|-------|-----|
| LCARS | Horizontal scan-lines over panels, dot-matrix backgrounds |
| Cyberpunk | Circuit-board traces, neon grid underlays |
| Retro Terminal | Phosphor dot grids, horizontal raster lines |
| Holographic | Interference line patterns, moire effects |

---

## 5. `stroke-dasharray` + `stroke-dashoffset` Line Drawing

Set `stroke-dasharray` to total path length, animate `stroke-dashoffset` from that value to 0. Path appears to "draw itself." CSS-only.

**Browser support:** Universal.

```xml
<svg viewBox="0 0 400 200" width="400" height="200">
  <!-- Panel border that draws itself -->
  <path class="draw-line"
        d="M50,10 H350 Q390,10 390,50 V190 H10 V50 Q10,10 50,10 Z"
        fill="none" stroke="#ff9900" stroke-width="3"/>

  <!-- Circuit line -->
  <path class="draw-circuit"
        d="M10,100 H100 V50 H200 V150 H300 V100 H390"
        fill="none" stroke="#00ffcc" stroke-width="1.5"/>
</svg>

<style>
  .draw-line {
    stroke-dasharray: 1200;
    stroke-dashoffset: 1200;
    animation: draw 2s ease-out forwards;
  }
  .draw-circuit {
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
    animation: draw 1.5s ease-in-out 0.5s forwards;
  }

  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }
</style>
```

**Tip:** To get the exact path length, use `pathElement.getTotalLength()` in browser devtools, then hardcode the value.

**Theme applications:**
| Theme | Use |
|-------|-----|
| LCARS | Panel borders drawing in on page load |
| Cyberpunk | Circuit paths lighting up, schematics revealing |
| Retro Terminal | Boot-sequence wireframe rendering |
| Holographic | Blueprint wireframes projecting, rotating ring reveals |

---

## 6. Inline SVG + CSS Animations

Inline SVG elements are first-class DOM citizens. CSS can animate `fill`, `stroke`, `opacity`, `transform`, and other presentation properties.

**Note:** CSS cannot animate SVG geometry attributes (`d`, `r`, `cx`). Use SMIL for those.

```html
<svg class="lcars-panel" viewBox="0 0 300 60" width="300" height="60">
  <rect class="bg" x="0" y="0" width="300" height="60" rx="30" fill="#cc6699"/>
  <rect class="accent" x="260" y="0" width="40" height="60" fill="#ff9900"/>
  <text class="label" x="20" y="38" fill="#000" font-family="monospace">WARP CORE</text>
  <circle class="status" cx="240" cy="30" r="6" fill="#00ff00"/>
</svg>

<style>
  .status {
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; fill: #00ff00; }
    50%      { opacity: 0.3; fill: #88ff88; }
  }

  .bg { transition: fill 0.3s ease; }
  .lcars-panel:hover .bg { fill: #dd77aa; }
</style>
```

---

## 7. `feColorMatrix` Color Manipulation

5x4 matrix transformation on every pixel's RGBA channels. Saturation, hue rotation, channel swapping, tinting, inversion.

**Browser support:** All modern browsers.

```xml
<svg width="0" height="0">
  <!-- Cyberpunk cyan tint -->
  <filter id="cyber-tint">
    <feColorMatrix type="matrix"
      values="0.2 0.2 0.2 0 0
              0.5 0.5 0.5 0 0.1
              0.8 0.8 0.8 0 0.1
              0   0   0   1 0"/>
  </filter>

  <!-- Green phosphor (retro terminal) -->
  <filter id="phosphor-green">
    <feColorMatrix type="matrix"
      values="0.1 0.1 0.1 0 0
              0.6 0.6 0.6 0 0.05
              0.1 0.1 0.1 0 0
              0   0   0   1 0"/>
  </filter>

  <!-- LCARS warm amber -->
  <filter id="lcars-amber">
    <feColorMatrix type="matrix"
      values="0.8 0.3 0.1 0 0.1
              0.5 0.3 0.1 0 0.05
              0.1 0.1 0.1 0 0
              0   0   0   1 0"/>
  </filter>

  <!-- Holographic hue rotation (animated) -->
  <filter id="holo-shift">
    <feColorMatrix type="hueRotate" values="0">
      <animate attributeName="values" values="0;360" dur="6s" repeatCount="indefinite"/>
    </feColorMatrix>
  </filter>
</svg>

<style>
  .terminal-img { filter: url(#phosphor-green); }
  .cyber-img    { filter: url(#cyber-tint); }
  .holo-img     { filter: url(#holo-shift); }
</style>
```

### Matrix Layout
```
| R' |   | r1 r2 r3 r4 r5 |   | R |
| G' | = | g1 g2 g3 g4 g5 | x | G |
| B' |   | b1 b2 b3 b4 b5 |   | B |
| A' |   | a1 a2 a3 a4 a5 |   | A |
                                | 1 |
```
5th column = constant offsets.

**Theme applications:**
| Theme | Use |
|-------|-----|
| LCARS | Warm amber/gold tinting of images |
| Cyberpunk | High-contrast cyan/magenta duotone |
| Retro Terminal | Green or amber phosphor monochrome |
| Holographic | Animated hueRotate for iridescent shifting |

---

## 8. `feMorphology` Text Effects

Thickens (`dilate`) or thins (`erode`) elements. Creates clean outer outlines without stroke's letter-thinning problem.

```xml
<svg viewBox="0 0 500 80" width="500" height="80">
  <defs>
    <filter id="neon-outline">
      <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dilated"/>
      <feFlood flood-color="#00ffcc" flood-opacity="1" result="color"/>
      <feComposite in="color" in2="dilated" operator="in" result="outline"/>
      <feMerge>
        <feMergeNode in="outline"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="degraded">
      <feMorphology in="SourceGraphic" operator="erode" radius="0.5"/>
    </filter>
  </defs>

  <text x="20" y="55" font-size="48" font-family="monospace" font-weight="bold"
        fill="#0a0a2e" filter="url(#neon-outline)">
    NEURAL LINK
  </text>
</svg>
```

**Theme applications:**
| Theme | Use |
|-------|-----|
| LCARS | Bold outlined section headers |
| Cyberpunk | Neon-glow text outlines |
| Retro Terminal | Eroded/degraded worn-CRT text |
| Holographic | Translucent text with bright projection edges |

---

## 9. SVG `<mask>` (Luminance-Based)

Unlike clipPath (binary), mask uses luminance: white = visible, black = hidden, gray = semi-transparent. Enables soft-edge effects.

```xml
<svg width="0" height="0">
  <defs>
    <!-- Holographic edge fade -->
    <mask id="holo-fade" maskContentUnits="objectBoundingBox">
      <linearGradient id="fade-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="white"/>
        <stop offset="70%" stop-color="white"/>
        <stop offset="100%" stop-color="black"/>
      </linearGradient>
      <rect width="1" height="1" fill="url(#fade-grad)"/>
    </mask>

    <!-- Scanline reveal mask -->
    <mask id="scanline-mask">
      <pattern id="scan-pat" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="2" fill="white"/>
        <rect y="2" width="4" height="2" fill="#666"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#scan-pat)"/>
    </mask>

    <!-- Noise texture mask -->
    <mask id="noise-mask">
      <filter id="mask-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="4"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#mask-noise)"/>
    </mask>
  </defs>
</svg>

<style>
  .holo-panel { mask: url(#holo-fade); -webkit-mask: url(#holo-fade); }
  .crt-overlay { mask: url(#scanline-mask); }
</style>
```

---

## 10. Holographic / Iridescent Effects (CSS + SVG)

Combines CSS gradients, blend modes, SVG noise, and `background-attachment: fixed` for holographic foil effects.

```html
<svg width="0" height="0">
  <filter id="holo-noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="1"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
</svg>

<style>
  .holographic {
    position: relative;
    background: linear-gradient(135deg, #0a0a2e, #1a1a3e);
  }

  /* Iridescent layer */
  .holographic::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      #ff00ff33, #00ffff44, #ffff0033,
      #ff00ff33, #00ffff44, #ffff0033
    );
    background-size: 200% 200%;
    animation: holo-shift 8s linear infinite;
    mix-blend-mode: screen;
  }

  /* Noise texture layer */
  .holographic::after {
    content: '';
    position: absolute;
    inset: 0;
    filter: url(#holo-noise);
    opacity: 0.08;
    mix-blend-mode: overlay;
  }

  @keyframes holo-shift {
    0%   { background-position: 0% 0%; }
    100% { background-position: 200% 200%; }
  }
</style>
```

---

## 11. SVG Noise Texture Generation

`feTurbulence` as standalone texture generator. No input image needed.

```xml
<!-- Film grain / CRT static overlay (apply to full viewport) -->
<svg width="100%" height="100%"
     style="position:fixed;inset:0;pointer-events:none;z-index:999;opacity:0.06;">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65"
                  numOctaves="3" stitchTiles="stitch"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)"/>
</svg>

<!-- Metallic surface texture (LCARS panels) -->
<svg width="0" height="0">
  <filter id="metal" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="turbulence" baseFrequency="0.02 0.5"
                  numOctaves="4" seed="7" result="noise"/>
    <feDiffuseLighting in="noise" lighting-color="#ff9944" surfaceScale="2" result="lit">
      <feDistantLight azimuth="45" elevation="55"/>
    </feDiffuseLighting>
    <feComposite in="lit" in2="SourceGraphic" operator="in"/>
  </filter>
</svg>

<!-- Grainy gradient (modern technique) -->
<svg width="0" height="0">
  <filter id="grainy">
    <feTurbulence type="fractalNoise" baseFrequency="0.6"
                  numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
</svg>
<style>
  .grainy-bg {
    background: linear-gradient(135deg, #0a0a2e, #1a1a4e, #2a0a3e);
    position: relative;
  }
  .grainy-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    filter: url(#grainy) brightness(1.5) contrast(2.5);
    opacity: 0.15;
    mix-blend-mode: overlay;
  }
</style>
```

---

## 12. SVG Grid Pattern Backgrounds

Infinitely tiling vector grids for sci-fi backgrounds. Resolution-independent.

```xml
<!-- Blueprint / technical grid -->
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
     style="position:fixed;inset:0;z-index:-1;">
  <defs>
    <!-- Fine grid -->
    <pattern id="small-grid" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1a3a5c" stroke-width="0.5"/>
    </pattern>

    <!-- Major grid -->
    <pattern id="major-grid" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="url(#small-grid)"/>
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#2a5a8c" stroke-width="1"/>
    </pattern>

    <!-- LCARS coordinate grid with dots -->
    <pattern id="lcars-grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="80" y2="0" stroke="#ff990033" stroke-width="0.5"/>
      <line x1="0" y1="0" x2="0" y2="80" stroke="#ff990033" stroke-width="0.5"/>
      <circle cx="0" cy="0" r="2" fill="#ff9900" opacity="0.2"/>
    </pattern>
  </defs>

  <rect width="100%" height="100%" fill="#0a1628"/>
  <rect width="100%" height="100%" fill="url(#major-grid)"/>
</svg>

<!-- Inline data URI for CSS background (no separate SVG file) -->
<style>
  .cyber-grid {
    background:
      radial-gradient(ellipse at 50% 120%, #ff00ff11 0%, transparent 70%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Cpath d='M 50 0 L 0 0 0 50' fill='none' stroke='%2300ffcc' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E");
    background-color: #0a0a1a;
  }
</style>
```

---

## Technique-to-Theme Quick Reference

| Technique | LCARS | Cyberpunk | Retro Terminal | Holographic |
|-----------|:-----:|:---------:|:--------------:|:-----------:|
| SMIL Animation | Status pulses | Neon pulse | Cursor blink | Ring rotation |
| feTurbulence | Warp distortion | Glitch/corruption | Screen static | Projection shimmer |
| clipPath | Rounded panels | Hex/angular frames | CRT barrel curve | Diamond frames |
| pattern | Scanlines, dots | Circuit traces | Phosphor dots | Interference lines |
| stroke-dash draw | Border draw-in | Circuit activation | Wireframe boot | Blueprint reveal |
| feColorMatrix | Amber tinting | Cyan/magenta duotone | Green phosphor | Hue rotation |
| feMorphology | Outlined headers | Neon glow outlines | Degraded text | Projection edge glow |
| mask | Panel edge fade | Corruption masks | CRT scanline mask | Edge-fade projection |
| Holographic CSS | Panel sheen | Chrome effects | Glass reflection | Primary effect |
| Noise textures | Brushed metal | Static/grain | CRT phosphor noise | Projection grain |
| Grid patterns | Coordinate overlay | Neon grid | Wireframe BG | Floating grid planes |

---

## Performance Guidelines

1. **SVG Filters** are the most CPU-intensive. Keep filter regions small, avoid animating `feTurbulence` on large areas.
2. **SMIL Animations** are lightweight and hardware-accelerated.
3. **CSS Animations** on SVG `transform`/`opacity` are GPU-composited.
4. **Patterns** are efficient — they tile a small element.
5. **Masks and ClipPaths** are cheap for static shapes; animated clip-paths are more expensive.
6. **Combine judiciously**: noise overlay + scanline pattern + animated SMIL = fine. Adding large animated displacement on top may cause frame drops.
