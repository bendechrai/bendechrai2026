# Theme Design Specifications

> Research and design decisions for the four sci-fi homepage themes.
> Each theme is not just a color swap — it has its own layout, navigation, animation,
> typography, and interaction patterns.

---

## Shared Across All Themes

- **Boot sequence** on first visit (theme-appropriate)
- **Persistent command line** at the bottom (styled per theme)
- **Same content modules**: Articles, Events, Talks & Workshops, Contact
- **Same commands**: `articles`, `events`, `talks`, `contact`, `theme <name>`, `help`, `clear`
- **Theme via query string** (`?theme=lcars`) with `localStorage` persistence
- **Default theme**: Cyberpunk (most visually striking first impression)
- **Boot sequence**: Skippable (click/keypress), plays only on first visit per session

---

## 1. LCARS (Star Trek)

### Reference Material

The Library Computer Access/Retrieval System from Star Trek: The Next Generation and later series. Designed by scenic art supervisor Michael Okuda. Key references:
- Star Trek TNG/DS9/Voyager bridge consoles
- [LCARS Interface Design Guide](https://www.thelcars.com)
- Territory Studio's Star Trek: Discovery FUI work

### Layout Structure

**Signature elbow-frame** with sidebar, header bar, and footer bar. Content fills the center panel on a black background.

```
+--[TOP BAR - colored, rounded left end]--+--[HEADER TEXT]--+
|                                          |                 |
+--[ELBOW - rounded inner corner]---------+                  |
|          |                                                 |
| SIDEBAR  |  CONTENT AREA                                   |
| (pills)  |  (black background, colored text)               |
|          |                                                 |
|          |                                                 |
+--[ELBOW]-+                                                 |
|                                                            |
+--[BOTTOM BAR - colored, rounded left end]--+--[INPUT]------+
```

Key structural elements:
- **Elbows**: The signature curved bracket shapes at top-left and bottom-left. Built with `border-radius` on a container with two child bars meeting at a right angle. The inner area is clipped to black.
- **Sidebar**: Vertical stack of pill-shaped buttons with gaps between them
- **Bars**: Horizontal colored bars with rounded ends (one end rounded, one square where it meets the elbow)
- **Content area**: Black background, always. Content never has a colored background.

### Navigation

- **Pill-shaped text buttons** stacked vertically in the left sidebar
- Clicking a pill replaces the content area (no floating windows, no modals)
- Active pill is a different color from inactive pills
- No icons — text-only labels (this is canon-accurate)
- Buttons have no border — they ARE the colored shape

### Icons

**None.** LCARS is text-only for navigation and labels. Status indicators use colored circles/rectangles, not iconographic symbols.

### Typography

| Role | Font | Style |
|------|------|-------|
| Display/Headers | Antonio (Google Fonts) | ALL CAPS, wide letter-spacing |
| Body text | Antonio or system sans-serif | Mixed case allowed for content |
| Data/Numbers | Antonio | Tabular figures, monospaced numbers |

All text is ALL CAPS in navigation and headers. Body text may use mixed case. Letter-spacing is generous (0.1-0.15em). No italic usage. Bold is used sparingly — color conveys hierarchy, not weight.

### Color Palette

LCARS uses warm pastels on pure black. Colors are NOT neon — they are soft, almost pastel.

| Name | Hex | Usage |
|------|-----|-------|
| Black (background) | `#000000` | All backgrounds, always |
| Tanoi (gold) | `#ffaa00` or `#ff9900` | Primary bars, elbows, active elements |
| Golden Tangerine | `#ff7700` | Secondary bars, alternate panels |
| Lilac | `#cc99cc` | Tertiary elements, decorative bars |
| Anakiwa (sky blue) | `#99ccff` | Information displays, data readouts |
| Periwinkle | `#cc99ff` | Alert/status elements |
| Mars (red-orange) | `#dd4444` | Warning/alert state |
| Hopbush (pink) | `#cc6699` | Section headers, category labels |
| White | `#ffffff` | Body text on black background |

**Distribution**: The bars and elbows carry the color. Content areas are always black with white or colored text. Different sections use different color schemes (e.g., Engineering = gold/orange, Science = blue, Medical = teal).

### Animations & Transitions

- **Snap transitions** (<300ms fades). No fancy effects.
- Content area fades in when switching sections (200ms opacity transition)
- The technology is "too advanced" to need flashy effects
- Status indicators may pulse slowly (2-3s cycle)
- Data readouts may have a subtle number-scrolling effect (like an odometer)
- No glitch effects, no scanlines, no CRT simulation

### Persistent UI Elements

- The frame itself (elbows + bars + sidebar) is always visible
- A clock/stardate display in the top bar
- System status indicators (small colored rectangles) in the sidebar gaps

### Command Input

- Styled input in the footer bar
- Prompt style: `LCARS > _`
- Input text is white on black
- The footer bar is colored like the other bars, with a cutout for the input area

### Boot Sequence

- Bars and elbows draw in from left to right
- Sidebar pills appear one by one, top to bottom
- Content area fades in last
- A "LCARS INTERFACE ACTIVE" text appears briefly
- Total duration: ~2 seconds

---

## 2. Cyberpunk

### Reference Material

- Blade Runner (1982) and Blade Runner 2049 UI by Territory Studio
- Cyberpunk 2077 by CD Projekt Red (UI design by Vilimovsky)
- Ghost in the Shell interfaces
- eDEX-UI terminal emulator (TRON Legacy inspired)
- Akira (1988) — industrial readouts and military displays

### Layout Structure

**Overlapping glassmorphic panels** with clipped/angled corners. HUD-style status bar at top. Terminal at bottom.

```
+--[STATUS BAR - fixed top, monospace]-------------------------------+
| > SYS://NIGHTCITY.NET | 22:47:03 | THREAT: LOW | NET: ACTIVE     |
+--------------------------------------------------------------------+
|                                                                    |
|  +--[MAIN PANEL - glassmorphic, clipped corners]----------------+  |
|  |                                                              |  |
|  |  [TABS: DATA | COMMS | EVENTS | ARCHIVES]                   |  |
|  |  +---------------------------------------------------------+ |  |
|  |  |  Content: neon-bordered cards, data tables              | |  |
|  |  |  with angular corners and glow effects                  | |  |
|  |  +---------------------------------------------------------+ |  |
|  |                                                              |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  +--[TERMINAL - bottom panel, expandable]------------------------+  |
|  |  user@system:~$ _                                             |  |
|  +---------------------------------------------------------------+  |
|                                                                    |
+--[SCANLINE + NOISE OVERLAY - full viewport, pointer-events:none]---+
```

Key structural elements:
- **Panels use `clip-path: polygon()`** for angled/beveled corners (not rounded)
- **Glassmorphism**: `backdrop-filter: blur(12px)` with `rgba(0, 0, 0, 0.7)` backgrounds
- **Neon borders**: 1px solid borders with matching `box-shadow` glow
- **Overlapping layers**: Panels sit at different `z-index` levels with overlap allowed
- **Status bar**: Fixed top, monospace, dim text that brightens on activity

### Navigation

- **Neon-bordered tab bar** across the top of the main panel
- Active tab has bright neon border and background glow
- Inactive tabs have dim borders
- Tabs use `clip-path` for angular shapes
- Content transitions with glitch effect (brief RGB split + horizontal tear)

### Icons

- **Thin neon-outlined line icons** with glow (1-1.5px stroke)
- Lucide or similar line-icon set, colored to match the theme
- Icons get a `filter: drop-shadow(0 0 4px var(--accent))` glow
- Used sparingly — mostly for status indicators and tab labels

### Typography

| Role | Font | Style |
|------|------|-------|
| Display/Headlines | Orbitron (Google Fonts) | ALL CAPS, wide letter-spacing (0.15-0.2em) |
| Body text | Rajdhani (Google Fonts) | Mixed case, 400-500 weight |
| Terminal/Code | Share Tech Mono (Google Fonts) | Fixed width, terminal commands |
| Data readouts | Share Tech Mono | Numbers, status indicators |

Text effects:
- Headers may have subtle glitch effect (chromatic aberration via pseudo-elements)
- ALL CAPS with wide letter-spacing for labels and headers
- Body text is readable — no effects applied to long-form content

### Color Palette

High-contrast neons on deep darks. 60-30-10 rule.

| Name | Hex | Usage |
|------|-----|-------|
| Void Black | `#0a0a0f` | Primary background |
| Dark Navy | `#0d0d1a` to `#1a1a2e` | Panel backgrounds (semi-transparent) |
| Cyan / Electric Blue | `#00f3ff` | Primary accent — borders, active states, links |
| Hot Pink / Magenta | `#ff0055` | Secondary accent — warnings, highlights, hover |
| Neon Green | `#00ff9f` | Success states, terminal text |
| Electric Yellow | `#f3e600` | Caution, special highlights |
| Danger Red | `#c5003c` | Errors, critical alerts |
| Cool White | `#e0e0ff` | Body text |

**Glow effects (CSS)**:
```css
/* Neon text glow */
text-shadow: 0 0 7px #00f3ff, 0 0 10px #00f3ff, 0 0 21px #00f3ff;

/* Neon border glow */
box-shadow: 0 0 5px #00f3ff, 0 0 10px #00f3ff, inset 0 0 5px rgba(0, 243, 255, 0.1);
```

**60-30-10 distribution**:
- 60% dark backgrounds
- 30% secondary dark tones / muted neons (desaturate by 20-30% for large areas)
- 10% bright neon accents for borders, buttons, active states

### Animations & Transitions

- **Glitch transitions**: Content changes with a brief (200-400ms) RGB split + horizontal tear
- **Scanline overlay**: Full-viewport `repeating-linear-gradient` via `::after` on body
- **CRT flicker**: Subtle opacity animation (very restrained — 0.9-1.0 range)
- **Chromatic aberration on hover**: Text pseudo-elements with offset colors
- **`prefers-reduced-motion` respected**: All effects disabled for users who prefer reduced motion
- **`steps()` timing**: Animations use `steps()` for jerky, digital-feeling motion

```css
/* Scanline overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 9999;
}
```

### Persistent UI Elements

- **Status bar** (fixed top): system name, time (24h), threat level, network status
- **Scanline overlay** (full viewport, `pointer-events: none`)
- **Optional: noise texture overlay** via SVG `feTurbulence` at low opacity

### Command Input

- Always-visible terminal panel at the bottom
- Styled as a hacking console
- Prompt: `> user@system:~$ _` with blinking block cursor
- Green or cyan text on near-black background
- Terminal has a thin neon border on top edge only

### Boot Sequence

- Screen flashes white briefly (50ms)
- Scanlines appear first
- Status bar types in character by character
- Main panel fades in with a glitch burst
- Terminal prompt blinks into existence
- Optional: Matrix-style code rain during boot
- Total duration: ~3 seconds

---

## 3. Retro Terminal (Green Phosphor CRT)

### Reference Material

- Alien (1979) — MU-TH-UR 6000 computer interface
- Fallout series — Pip-Boy terminal
- WarGames (1983) — WOPR terminal
- eDEX-UI (before it was discontinued)
- Early 1980s IBM/DEC VT terminals

### Layout Structure

**Full-screen text on black.** Box-drawing characters for borders. 80-column feel. This theme is the most command-line native.

```
+============================================================+
|  SYSTEM v2.4.7 - BEN DE CHRAI PERSONAL TERMINAL            |
|  Connection established: 2026-02-17 22:47:03 UTC            |
+============================================================+
|                                                              |
|  Welcome to the personal terminal of Ben de Chrai.          |
|                                                              |
|  Available commands:                                         |
|                                                              |
|    1) articles    - Published writings                       |
|    2) events      - Upcoming appearances                     |
|    3) talks       - Talks & workshops                        |
|    4) contact     - Get in touch                             |
|    5) help        - Show this menu                           |
|    6) theme <n>   - Change visual theme                      |
|                                                              |
|  Type a command or number to continue.                       |
|                                                              |
+------------------------------------------------------------+
|  > _                                                         |
+------------------------------------------------------------+
```

Key structural elements:
- **Box-drawing characters**: `┌─┐│└─┘┤├┬┴┼` for all borders and dividers
- **80-column maximum width** (centered on screen if wider)
- **Monospace everything** — the entire page is a single monospace font
- **No images** — ASCII art headers for decoration
- **CRT curvature**: Subtle `border-radius: 20px` on outer container + perspective transform

### Navigation

- **Numbered menus**: `1) Articles  2) Events  3) Talks  4) Contact`
- **OR type commands** directly in the prompt
- This theme has the most command-line-native interaction model
- Menu items render character by character when displayed
- Selected items are highlighted with `> arrows` or `[brackets]`

### Icons

**None.** ASCII art headers and text symbols only.

```
 _____ _____ _____ _____ _____ __    _____ _____
|  _  | __  |_   _|     |     |  |  |   __|   __|
|     |    -| | | |  |  |   --|  |__|   __|__   |
|__|__|__|__| |_| |_____|_____|_____|_____|_____|
```

### Typography

| Role | Font | Style |
|------|------|-------|
| Everything | VT323 (Google Fonts) | Monospace, pixel-style |
| Alternative | Share Tech Mono | If VT323 feels too pixelated |
| Fallback | 'Courier New', monospace | System fallback |

All text is the same font. Hierarchy is achieved through:
- CAPS for headers
- Box-drawing borders for sections
- Blank lines for spacing
- `> arrows` for emphasis

### Color Palette

Green phosphor on black. Simple.

| Name | Hex | Usage |
|------|-----|-------|
| Black (CRT off) | `#0D0208` | Background |
| Green phosphor (bright) | `#00FF41` | Primary text |
| Green phosphor (dim) | `#008F11` | Secondary text, borders |
| Green phosphor (glow) | `#003B00` | Text-shadow glow color |
| Amber variant | `#FFB000` / `#FF8C00` | Alternative phosphor color |

**Phosphor glow effect (CSS)**:
```css
.terminal-text {
  color: #00FF41;
  text-shadow:
    0 0 5px rgba(0, 255, 65, 0.7),
    0 0 10px rgba(0, 255, 65, 0.4),
    0 0 20px rgba(0, 255, 65, 0.2);
}
```

### Animations & Transitions

- **Character-by-character text output** (typewriter effect using `width` animation with `steps()`)
- **Blinking block cursor** (`border-right: 2px solid; animation: blink 1s step-end infinite`)
- **Subtle screen flicker** (opacity 0.95-1.0 range, very fast)
- **Rolling scanline** (a slightly brighter horizontal band that scrolls slowly top to bottom)
- **CRT turn-on effect**: Screen brightens from center horizontal line outward
- **No smooth transitions** — text appears or doesn't. This is a terminal.

```css
/* Rolling scanline */
.crt::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 255, 65, 0.03) 50%,
    transparent 100%
  );
  background-size: 100% 30%;
  animation: scanroll 6s linear infinite;
  pointer-events: none;
}
@keyframes scanroll {
  from { background-position: 0 -100%; }
  to   { background-position: 0 200%; }
}
```

### Persistent UI Elements

- **Header line**: System name, version, date/time
- **Box-drawn border**: Around the entire terminal area
- **Status line at bottom**: Above the input prompt, shows current section
- **Scanline + flicker overlay**: Always active (respects `prefers-reduced-motion`)

### Command Input

The command prompt IS the primary interface. Always at the bottom.

- Prompt: `> _` with blinking block cursor
- Input text appears in the same green phosphor color
- Previous commands scroll up and remain visible (like a real terminal)
- Command history is navigable (up/down arrows)

### Boot Sequence

This theme has the most elaborate boot sequence — it's the main event:

```
[BIOS POST]
Memory test... 640K OK
Checking devices... OK

Loading SYSTEM v2.4.7...
████████████████████████ 100%

Establishing connection...
Connection established: 2026-02-17 22:47:03 UTC

WELCOME TO THE PERSONAL TERMINAL OF BEN DE CHRAI
Type 'help' for available commands.

> _
```

- Each line appears with typewriter effect
- Progress bar fills with block characters
- Total duration: ~4-5 seconds (longest boot, most dramatic)

---

## 4. Holographic

### Reference Material

- Iron Man / Avengers — Tony Stark's holographic displays
- Minority Report — gesture-based transparent displays
- Star Wars — holographic projections (Leia's message, Jedi Council)
- Halo — Cortana's holographic interface
- Avatar — military holographic war room displays

### Layout Structure

**Floating translucent panels with depth layering.** Subtle grid lines in the background. Corner bracket frames on panels. Spacious, minimal, breathes.

```
+--[AMBIENT GRID BACKGROUND - subtle, low opacity]------------------+
|                                                                    |
|     ┌──                                          ──┐              |
|     |   FLOATING PANEL (translucent, blurred bg)   |              |
|     |                                               |              |
|     |   Content with generous padding               |              |
|     |   and thin-line icons                         |              |
|     |                                               |              |
|     └──                                          ──┘              |
|                                                                    |
|              [ COMMAND PALETTE - center screen ]                    |
|              [ Type a command...              / ]                   |
|                                                                    |
|     ┌──              ──┐    ┌──              ──┐                  |
|     |  Secondary Panel |    |  Secondary Panel |                  |
|     └──              ──┘    └──              ──┘                  |
|                                                                    |
+--------------------------------------------------------------------+
```

Key structural elements:
- **Corner brackets** instead of full borders: Only the corners of panels have visible border segments
- **Generous whitespace**: Panels float with lots of breathing room
- **Depth via blur + opacity**: Foreground panels are more opaque, background panels are more transparent
- **Grid background**: Subtle SVG pattern grid at ~0.1 opacity, suggesting a projected coordinate system
- **No sharp corners, no hard edges**: Everything is soft, translucent, ethereal

Corner bracket CSS:
```css
.holo-panel {
  position: relative;
  padding: 2rem;
}
.holo-panel::before, .holo-panel::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(0, 220, 220, 0.6);
  border-style: solid;
}
.holo-panel::before {
  top: 0; left: 0;
  border-width: 2px 0 0 2px; /* top-left corner */
}
.holo-panel::after {
  bottom: 0; right: 0;
  border-width: 0 2px 2px 0; /* bottom-right corner */
}
```

### Navigation

- **Central command palette** (Spotlight-style, triggered by `/` or clicking)
- Appears center-screen with backdrop blur
- Type to search/filter commands
- Panels materialize when selected (scale up + fade in from `display: none` using `@starting-style`)
- Dismissing a panel reverses the animation

### Icons

- **Thin-line SVG icons** (Lucide icon set), 1.5px stroke weight
- Draw-in animation on first appearance (SVG `stroke-dashoffset` animation)
- Subtle glow on hover: `filter: drop-shadow(0 0 3px var(--accent))`
- Used more than other themes — icons are primary labels for compact panels

### Typography

| Role | Font | Style |
|------|------|-------|
| Display/Headers | Exo 2 (Google Fonts) | Light/thin weight (200-300), ALL CAPS, very wide letter-spacing (0.2-0.3em) |
| Body text | Exo 2 | Regular weight (400), mixed case |
| Labels | Exo 2 | Light weight, ALL CAPS, small font size |
| Data/Code | Share Tech Mono | Monospace for any data readouts |

The holographic theme uses the thinnest font weights. Everything feels etched in light rather than printed on a surface.

### Color Palette

Cool, translucent, ethereal. Less saturated than cyberpunk.

| Name | Hex | Usage |
|------|-----|-------|
| Deep Navy | `#0a0e1a` | Background |
| Cyan | `#00DCDC` | Primary accent — borders, active states |
| Cool White | `#E4EFF0` | Primary text |
| Light Cyan | `#80EEEE` | Secondary text, labels |
| Translucent Cyan | `rgba(0, 220, 220, 0.1)` | Panel backgrounds |
| Warm Accent | `#FF6B35` | Highlight, notifications (rare, warm contrast) |
| Dim Grid | `rgba(0, 220, 220, 0.05)` | Background grid lines |

Holographic panels:
```css
.holo-panel {
  background: rgba(0, 220, 220, 0.06);
  backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid rgba(0, 220, 220, 0.12);
  box-shadow: 0 0 30px rgba(0, 220, 220, 0.05);
}
```

### Animations & Transitions

- **Panels materialize**: Scale from 0.85 to 1.0 + fade from 0 to 1 (400ms ease-out)
- **Panels dematerialize**: Reverse (300ms ease-in)
- **Ambient pulsing**: Status indicators pulse slowly (3-4s cycle, subtle opacity change)
- **Parallax on layers**: Background grid moves slightly on scroll (CSS `background-attachment: fixed` or scroll-driven animation)
- **Glow intensification on hover**: Border and shadow glow brighten (transition, not animation)
- **Icon draw-in**: SVG `stroke-dashoffset` animation when icons first appear
- **Iridescent shimmer**: Subtle rainbow gradient overlay using `mix-blend-mode: screen` with animated `background-position`

### Persistent UI Elements

- **Background grid**: Always visible, very subtle
- **Corner bracket frames**: On all floating panels
- **Ambient data particles**: Small floating dots/motes using CSS particle effect (box-shadow technique)
- **Floating status indicators**: Small circles in corners showing system status

### Command Input

- **Floating command palette** center-screen (like macOS Spotlight or VS Code command palette)
- Appears with a scale+fade transition
- Has a search icon and placeholder text: "Type a command..."
- Trigger: `/` key or clicking a subtle floating prompt indicator
- Results appear below the input as a filtered list
- Selecting a result materializes the corresponding panel

### Boot Sequence

- Background grid fades in first (1s)
- Ambient particles begin drifting
- A central "ring" or "reticle" SVG draws itself (stroke-dashoffset animation)
- Text materializes inside: "HOLOGRAPHIC INTERFACE INITIALIZED"
- Ring dissolves outward
- Main panels materialize one by one with staggered delays
- Total duration: ~3 seconds

---

## Theme Comparison Matrix

| Aspect | LCARS | Cyberpunk | Retro Terminal | Holographic |
|--------|-------|-----------|----------------|-------------|
| **Layout** | Frame + elbows | Overlapping glassmorphic panels | Full-screen text, 80-col | Floating translucent panels |
| **Borders** | Colored bars | Angled clip-path + neon glow | Box-drawing chars | Corner brackets only |
| **Navigation** | Sidebar pills | Tab bar | Numbered menu + commands | Command palette (center) |
| **Icons** | None (text only) | Thin neon outlines | None (ASCII only) | Thin-line SVG with draw-in |
| **Font (display)** | Antonio | Orbitron | VT323 | Exo 2 Light |
| **Font (body)** | Antonio | Rajdhani | VT323 | Exo 2 Regular |
| **Font (mono)** | Antonio | Share Tech Mono | VT323 | Share Tech Mono |
| **Primary BG** | `#000000` | `#0a0a0f` | `#0D0208` | `#0a0e1a` |
| **Primary Accent** | `#ffaa00` (gold) | `#00f3ff` (cyan) | `#00FF41` (green) | `#00DCDC` (cyan) |
| **Secondary Accent** | `#cc6699` (pink) | `#ff0055` (magenta) | `#008F11` (dim green) | `#FF6B35` (warm) |
| **Text Color** | `#ffffff` | `#e0e0ff` | `#00FF41` | `#E4EFF0` |
| **Animations** | Minimal, snappy | Glitch, scanlines, CRT | Typewriter, flicker, scanroll | Materialize, pulse, shimmer |
| **Boot Duration** | ~2s | ~3s | ~4-5s | ~3s |
| **Boot Character** | Clean, professional | Aggressive, flashy | Dramatic, nostalgic | Elegant, ethereal |
| **Overall Mood** | Advanced, utilitarian | Gritty, dangerous | Nostalgic, authentic | Ethereal, futuristic |

---

## Cyberpunk Sub-References

### Blade Runner UI Design Principles (Territory Studio)

Territory Studio designed different UI fidelity levels for different social classes:
- **Wallace Corp**: Elegant, minimal, clean — the highest class of technology
- **LAPD**: Clunky, gritty, utilitarian — mid-tier institutional tech
- **K's Spinner**: Glitchy, degraded — the lowest personal tech tier

This is a powerful design principle: **the state of the UI communicates status.** The cyberpunk theme uses this idea — the interface feels slightly rough around the edges, suggesting it's been hacked together from scavenged parts.

### Cyberpunk 2077 UI Design Principles

- Red as default UI color (deliberate non-conformist choice)
- HUD divided into 4 fixed zones (minimap top-right, quest center-right, equipment bottom-left, actions bottom-right)
- Center screen left clear for immersion
- Contextual UI — elements appear/disappear based on activity
- HSL color space for flexible theming
- `clip-path` for button/panel shapes

### eDEX-UI Reference

- Full-screen terminal emulator inspired by TRON Legacy
- Real terminal functionality + system monitoring panels (CPU, RAM, network)
- Split-screen: terminal 60-70% + monitoring panels 30-40%
- On-screen keyboard for visual effect
- Sound effects for keystrokes and commands

---

## Accessibility Requirements (All Themes)

1. **`prefers-reduced-motion`**: All animations disabled or reduced to simple fades
2. **`prefers-contrast`**: High-contrast mode increases border opacity and text contrast
3. **`prefers-color-scheme`**: Not applicable (all themes are dark by design)
4. **Keyboard navigation**: Full keyboard support for all themes
5. **Screen reader**: Semantic HTML underneath all visual effects
6. **Focus indicators**: Visible focus rings styled per theme (not removed)
7. **Text sizing**: All text respects user font-size preferences (`rem` units)
8. **Color contrast**: WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
9. **Photosensitive epilepsy**: Flicker effects are very subtle (>3Hz but low amplitude); CRT flicker disabled with `prefers-reduced-motion`
