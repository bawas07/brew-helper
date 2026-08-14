# Slow Pour — Implementation Plan

## Overview

Convert the existing `example.html` prototype (a complete single-file pour-over brewing calculator) into a SvelteKit + Svelte 5 application with PWA support. The prototype has all logic, data, and styling already working — we're decomposing it into a clean component architecture.

**Tech stack:** SvelteKit (static adapter), Svelte 5 (runes), Vite, Tailwind CSS v4, vite-plugin-pwa

---

## 1. Project Initialization

### 1.1 Scaffolding
```
npx sv create brew-calculator
```
- Template: Minimal (SvelteKit)
- Type checker: TypeScript (JSDoc type checking — no separate .ts files needed)
- Tooling: Prettier, ESLint
- Add `@sveltejs/adapter-static` for fully static PWA output

### 1.2 Dependencies
```
tailwindcss @tailwindcss/vite   # Tailwind CSS v4 with Vite plugin
vite-plugin-pwa                  # Service worker + manifest
```
Tailwind CSS v4 — the full design system (colors, fonts, radii, shadows) is encoded in the Tailwind theme config so components use utility classes exclusively.

### 1.3 Configuration
- **tailwind.config.js** — encode the full Slow Pour design system (see §8 for token mapping)
- **svelte.config.js** — configure static adapter with `fallback: 'index.html'` for SPA behavior
- **vite.config.js** — add `@tailwindcss/vite` plugin + vite-plugin-pwa config
- **static/manifest.webmanifest** — app name, icons, theme color (#F6F2E9 cream), display: standalone
- **static/robots.txt** — allow all

### 1.4 Git
- Initialize git repo
- Add .gitignore (node_modules, .svelte-kit, build, .env)
- Initial commit after scaffolding

---

## 2. File Structure

```
src/
├── lib/
│   ├── data/
│   │   ├── drippers.js         # DRIPPERS array + DRIPPER_ICON svg constant
│   │   ├── recipes.js           # RECIPES object (all 10 recipes)
│   │   └── constants.js         # GRIND_STEPS, COOL_TABLE, DEFAULT_DOSE, etc.
│   │
│   ├── calculations.js          # Pure functions: computeBrew(), hackSecondsFor(), cToF(), fmtTime()
│   │
│   ├── stores/
│   │   └── brew.js              # Svelte stores: mode, dose, dripperId, recipeId, grindIndex, etc.
│   │                            # + derived: currentBrew, currentRecipe, recipesForDripper
│   │
│   ├── storage.js               # localStorage wrapper for journal (loadJournal, saveJournal, etc.)
│   │
│   └── components/
│       ├── Header.svelte        # Brand mark + "Home Brew Calculator" eyebrow
│       ├── Hero.svelte          # Hero text section
│       ├── ServeToggle.svelte   # Hot / Iced segmented control
│       ├── DoseInput.svelte     # Number input + quick-pick chips
│       ├── DripperGrid.svelte   # 2-column card grid of dripper options
│       ├── GrindSelector.svelte # Range slider + readout label
│       ├── RecipeSelect.svelte  # Dropdown + rationale note + attribution
│       ├── RecipePanel.svelte   # Right column: title, fit badge, stat row, notes
│       ├── Timer.svelte         # Circular ring timer with start/pause/reset
│       ├── PourSchedule.svelte  # Step-by-step pour list with active highlighting
│       └── BrewJournal.svelte   # Saved brews list with load/delete
│
├── routes/
│   ├── +layout.svelte           # Root layout: font links, Tailwind base import
│   ├── +layout.js               # export const prerender = true; export const ssr = false;
│   └── +page.svelte             # Main page: assembles all components
│
├── app.css                      # Tailwind @import + minimal global overrides (fonts, range input)
tailwind.config.js               # Full design system: colors, fonts, radii, shadows
tailwind.css                     # (or app.css serves as the Tailwind entry with @tailwind directives)
└── app.html                     # HTML shell
```

---

## 3. Data Layer — `src/lib/data/`

### 3.1 `constants.js`
Extract directly from prototype:
- `GRIND_STEPS` — 7-step array with `label` + `ref`
- `COOL_TABLE` — temperature-to-seconds lookup for no-thermometer hack
- `DEFAULT_DOSE` = 15
- `DOSE_CHIP_VALUES` = [12, 15, 18, 20, 30]
- `DEFAULT_ICE_FRACTION` = 0.4
- `JOURNAL_KEY` = 'slowpour_brews'
- `MAX_JOURNAL_ENTRIES` = 20

### 3.2 `drippers.js`
Extract `DRIPPERS` array (8 entries) and the `DRIPPER_ICON` SVG string.

Each dripper: `{ id, name, shape, flow, grind }`

### 3.3 `recipes.js`
Extract `RECIPES` object (10 recipes). Each recipe:
```
{
  id, name, native (dripper id), compatible[], ratio, iceFraction,
  attribution, rationale, tempHot, tempIced, grindOverride,
  steps: [{ label, dur, pct, purpose }]
}
```

### 3.4 Helper: `recipesForDripper(dripperId)`
Returns sorted array: native recipes → compatible recipes → universal (last).
Each entry includes badge type for UI rendering.

---

## 4. Calculations — `src/lib/calculations.js`

Pure functions, no side effects. All derived from prototype's `computeBrew()`:

| Function | Input | Output |
|---|---|---|
| `computeBrew(state)` | Full state object | `{ dose, totalWater, hotWater, ice, tempC, steps[], totalTime, grindIdx, fit }` |
| `hackSecondsFor(targetC)` | Temperature in °C | Seconds to wait off boil |
| `fmtTime(seconds)` | Number | "m:ss" string |
| `cToF(celsius)` | Number | Fahrenheit integer |

**`computeBrew` detail:**
1. Look up recipe + dripper from state IDs
2. `totalWater = dose × recipe.ratio`
3. If iced: `ice = round(totalWater × iceFraction)`, `hotWater = totalWater - ice`
4. Map recipe steps → compute `delta` (incremental pour), `target` (cumulative grams), `startSec`/`endSec` (timing)
5. Determine grind index (manual override or recipe/dripper default)
6. Determine fit badge (native / compatible / universal)

---

## 5. Stores — `src/lib/stores/brew.js`

### Writable stores (source of truth):
```javascript
mode          // 'hot' | 'iced'  (default: 'hot')
dose          // number           (default: 15)
dripperId     // string           (default: 'v60')
recipeId      // string           (default: 'hoffmannV60')
grindIndex    // number 0-6       (default: 3)
grindManual   // boolean          (default: false — use recipe/dripper default)
tempUnit      // 'C' | 'F'       (default: 'C')
```

### Derived stores:
```javascript
currentRecipe      // → RECIPES[recipeId]
currentDripper     // → DRIPPERS.find(d => d.id === dripperId)
availableRecipes   // → recipesForDripper(dripperId)
currentBrew        // → computeBrew({...all writable state})
```

### Actions (functions that update stores):
```javascript
setDripper(id)          // Sets dripperId + auto-selects native recipe + resets grindManual
setRecipe(id)           // Sets recipeId + resets grindManual
setDose(value)          // Sets dose
toggleMode(mode)        // Sets mode
setGrind(index)         // Sets grindIndex + grindManual = true
toggleTempUnit()        // Flips °C / °F
```

### Timer state (local to Timer component, NOT in global store):
```javascript
timerRunning    // boolean
timerElapsed    // number (seconds)
```
Timer is ephemeral UI state — no need for global store. Lives inside `Timer.svelte`.

---

## 6. Components

### 6.1 `Header.svelte`
- SVG brand mark (coffee dripper icon) + "Slow Pour" brand name
- Eyebrow text: "Home Brew Calculator"
- Static, no interactivity

### 6.2 `Hero.svelte`
- `<h1>` with italic rust-colored emphasis on "pour-over"
- Subtitle paragraph
- Static content

### 6.3 `ServeToggle.svelte`
- Two-segment pill control (Hot / Iced)
- Each segment has an SVG icon
- Active state: rust color (hot), teal color (iced)
- Dispatches mode change → calls `toggleMode()`

### 6.4 `DoseInput.svelte`
- Number input with Fraunces serif font at 24px
- "g" unit label
- Quick-pick chip row below (12g, 15g, 18g, 20g, 30g)
- Chips highlight when matching current dose
- Input and chips stay synced

### 6.5 `DripperGrid.svelte`
- 2-column CSS grid of cards
- Each card: SVG icon + name + shape/flow descriptor
- Selected card: rust border + rust-soft background
- On select: calls `setDripper(id)`

### 6.6 `GrindSelector.svelte`
- Range input (0–6, step 1) with custom rust-colored thumb
- Fine/Coarse labels at endpoints
- Readout box below: grind label + reference ("like Standard Pour-Over")
- Subscribes to `currentBrew` for initial value, sets `grindManual` on interaction

### 6.7 `RecipeSelect.svelte`
- Native `<select>` with custom styling
- Options: grouped by badge (native → compatible → universal)
- Below select: rationale note + attribution text
- Subscribes to `availableRecipes` derived store

### 6.8 `RecipePanel.svelte` (right column top card)
- **Header section:**
  - Eyebrow "Your recipe"
  - Recipe name (h2) + dripper name + ratio
  - Fit badge (native/compatible/universal) with appropriate color
  - "Save brew" button (triggers journal save)
- **Stat row** (flex, wraps):
  - Hot mode: Coffee | Total Water | Ratio | Brew Time
  - Iced mode: Coffee | Total Water | Hot Water | Ice in Server
  - Each stat: small label, large monospace value
- **Notes section:**
  - Ice instruction (iced mode only)
  - Temperature + no-thermometer hack
  - Grind size recommendation
  - Pre-rinse reminder
  - Each note has an info icon

### 6.9 `Timer.svelte`
- **Circular progress ring** (SVG):
  - Background ring (line color)
  - Foreground ring (rust or teal, animated via stroke-dashoffset)
  - Time digits centered (IBM Plex Mono, 38px)
- **Status line:** "Now · Step 2 — Balance · pour to 54g"
- **Controls:**
  - Start / Pause (primary button, toggles)
  - Reset (ghost button)
- **Internal state:** `running`, `elapsed` (seconds)
- Uses `setInterval` (1s) for elapsed counter
- Auto-pauses when elapsed exceeds total brew time + 2s
- Active step index computed from elapsed time + brew steps
- Resets when dripper/recipe/dose changes (reactive effect)

### 6.10 `PourSchedule.svelte`
- Header: "Pour schedule" + step count
- Vertical timeline of steps, each with:
  - Dot indicator (active = rust/teal, done = ink-faint, pending = line color)
  - Step title + time range
  - Pour amount: "+27g water · to 54g total"
  - Purpose text
- Dashed separator between steps
- Receives `steps[]`, `activeStepIndex`, `isRunning`, `isIced` as props

### 6.11 `BrewJournal.svelte`
- "Brew journal" heading
- **Empty state:** dashed border box with "No brews yet" message + localStorage explanation
- **Filled state:** list of journal entries, each showing:
  - Dripper name + recipe name
  - Dose + mode + date
  - "Use" button (loads into calculator) + "✕" delete button
- Max 20 entries, newest first

---

## 7. Main Page — `routes/+page.svelte`

**Layout structure:**
```
Header
Hero
┌─────────────────────────────────────────────┐
│ LEFT (340px)          │  RIGHT (flex)        │
│ ┌─────────────────┐   │ ┌─────────────────┐  │
│ │ ServeToggle     │   │ │ RecipePanel     │  │
│ ├─────────────────┤   │ ├─────────────────┤  │
│ │ DoseInput       │   │ │ Timer           │  │
│ ├─────────────────┤   │ ├─────────────────┤  │
│ │ DripperGrid     │   │ │ PourSchedule    │  │
│ ├─────────────────┤   │ ├─────────────────┤  │
│ │ GrindSelector   │   │ │ BrewJournal     │  │
│ ├─────────────────┤   │ └─────────────────┘  │
│ │ RecipeSelect    │   │                      │
│ └─────────────────┘   │                      │
└─────────────────────────────────────────────┘
Footer
```

- Two-column grid on desktop (340px / 1fr)
- Single column below 900px breakpoint
- All components wired to stores via `$store` syntax

---

## 8. CSS Strategy — Tailwind CSS v4

**Tailwind CSS v4 with `@tailwindcss/vite` plugin.** The design system is fully encoded in the Tailwind config — components use utility classes exclusively, with a thin `app.css` layer only for things Tailwind can't express (custom range slider thumbs, font imports, base resets).

### 8.1 Tailwind theme config (`tailwind.config.js`)

Map every design token from the prototype into Tailwind's theme:

**Colors — extend `theme.colors`:**
```
cream:      #F6F2E9    (→ bg-cream)
card:       #FCFAF5    (→ bg-card)
ink:        #2B2621    (→ text-ink)
ink-soft:   #736A5E    (→ text-ink-soft)
ink-faint:  #A69C8C    (→ text-ink-faint)
line:       #E6DECE    (→ border-line)
rust:       #B24A21    (→ bg-rust, text-rust, border-rust)
rust-ink:   #7C3216    (→ text-rust-ink)
rust-soft:  #F2DDC8    (→ bg-rust-soft)
teal:       #2E6577    (→ bg-teal, text-teal)
teal-soft:  #DCEAEC    (→ bg-teal-soft)
gold:       #8A6D2F    (→ text-gold)
gold-soft:  #EFE6CD    (→ bg-gold-soft)
```

**Fonts — extend `theme.fontFamily`:**
```
serif:      ['Fraunces', 'Georgia', 'serif']
sans:       ['Inter', 'system-ui', 'sans-serif']
mono:       ['IBM Plex Mono', 'Menlo', 'monospace']
```

**Border radii — extend `theme.borderRadius`:**
```
lg:  18px    (→ rounded-lg)
md:  12px    (→ rounded-md)
sm:  8px     (→ rounded-sm)
full: 999px  (→ rounded-full / pill shapes)
```

**Shadows — extend `theme.boxShadow`:**
```
DEFAULT: '0 1px 2px rgba(43,38,33,.04), 0 8px 24px -12px rgba(43,38,33,.12)'
```

### 8.2 Global CSS (`app.css`) — minimal overrides only

```css
@import "tailwindcss";

/* Base resets */
body {
  -webkit-font-smoothing: antialiased;
  line-height: 1.5;
}

/* Range slider — Tailwind can't style pseudo-element thumbs */
input[type="range"]::-webkit-slider-thumb { ... }
input[type="range"]::-moz-range-thumb { ... }
```

This file stays **under 50 lines** — everything else is utility classes in components.

### 8.3 Font loading

Fonts loaded via `<link>` tags in `app.html` (same as prototype). Tailwind picks them up through the `fontFamily` config.

### 8.4 Component styling approach

Each component uses Tailwind utility classes in its HTML. For example, a card:

```svelte
<div class="bg-card border border-line rounded-lg shadow">
```

**Hot/iced color switching** is handled with conditional classes:
```svelte
<div class={mode === 'iced' ? 'text-teal' : 'text-rust'}>
```

Or with a computed `accent` variable passed as a prop.

### 8.5 What Tailwind handles well here vs. what needs custom CSS

| Handled by Tailwind | Needs custom CSS in app.css |
|---|---|
| All layout (grid, flex, spacing) | Range slider thumb styling |
| All colors, backgrounds, borders | (possibly) SVG ring animations |
| Typography (fonts, sizes, weights) | |
| Shadows, radii | |
| Responsive breakpoints | |
| Hover/focus/active states | |
| Transitions | |

---

## 9. PWA Configuration

### `vite-plugin-pwa` setup:
```javascript
// vite.config.js
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Slow Pour — Home Brew Calculator',
    short_name: 'Slow Pour',
    description: 'A calm, precise pour-over companion',
    theme_color: '#F6F2E9',
    background_color: '#F6F2E9',
    display: 'standalone',
    icons: [...] // 192x192 + 512x512 PNG
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,woff2}'],
    runtimeCaching: [{
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
    }, {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
    }]
  }
})
```

### Static icons:
- Generate or create simple icons (coffee dripper motif matching brand mark)
- Place in `static/` directory
- Reference in manifest

---

## 10. Task Sequence (Build Order)

| # | Task | Depends on | Est. time |
|---|---|---|---|
| 1 | Project scaffolding (SvelteKit + static adapter + PWA + git) | — | 15 min |
| 2 | Data layer (`data/` — drippers, recipes, constants) | #1 | 20 min |
| 3 | Calculations module (`calculations.js`) | #2 | 20 min |
| 4 | Stores (`stores/brew.js`) | #2, #3 | 20 min |
| 5 | Tailwind config + design tokens (`tailwind.config.js`, `app.css`) | #1 | 25 min |
| 6 | Header + Hero components | #5 | 10 min |
| 7 | ServeToggle component | #4, #5 | 15 min |
| 8 | DoseInput component | #4, #5 | 15 min |
| 9 | DripperGrid component | #4, #5 | 15 min |
| 10 | GrindSelector component | #4, #5 | 15 min |
| 11 | RecipeSelect component | #4, #5 | 15 min |
| 12 | RecipePanel component | #3, #4, #5 | 25 min |
| 13 | Timer component | #3, #5 | 30 min |
| 14 | PourSchedule component | #3, #5 | 20 min |
| 15 | BrewJournal component + storage.js | #4, #5 | 25 min |
| 16 | Main page assembly (`+page.svelte`) | #6-15 | 20 min |
| 17 | PWA manifest + icons | #1 | 15 min |
| 18 | Visual QA against prototype + fixes | #16 | 30 min |

**Total estimated: ~5.5 hours of focused work**

---

## 11. Hazards & Mitigations

| Hazard | Risk | Mitigation |
|---|---|---|
| **Timer drift** — `setInterval` is not precise | Timer may drift by ±50ms/sec | Acceptable for a coffee timer (1s granularity). Don't use `Date.now()` delta — just count ticks. |
| **Recipe auto-select** — changing dripper should pick the "best" recipe | Could confuse users if it jumps unexpectedly | Always prefer native recipe → first compatible → universal. Reset `grindManual` on dripper change. |
| **Iced mode stat layout** — 5 stats vs 4 stats | Flex layout must not break on narrow screens | Use `flex-wrap: wrap` + `min-width: 90px` on stat cards (matching prototype) |
| **localStorage limits** — ~5MB in most browsers | Journal could grow | Cap at 20 entries. No other significant localStorage use. |
| **PWA font caching** — Google Fonts could fail offline | Fonts won't load | StaleWhileRevalidate for fonts. App remains functional — just uses fallback system fonts. |
| **State reset on recipe change** — timer should stop | Running timer with changed steps is confusing | Reactive effect: when `recipeId`/`dripperId`/`dose` changes, reset timer to 0. |

---

## 12. Testing Strategy

No formal test framework in v1. Validate by:
1. **Visual comparison** — open app side-by-side with `example.html`, verify all states match
2. **Calculation verification** — test key recipes manually:
   - V60 + 30g → 500g total (1:16.67 ratio)
   - Iced mode: 30g → 500g total, 200g ice, 300g hot water
   - Chemex + 20g → 333g total (1:16.67)
3. **Flow testing** — walk through full user journeys:
   - Select dripper → pick recipe → adjust dose → start timer → save brew
   - Toggle hot/iced → verify stats change
   - Load brew from journal → verify state restored
4. **Offline test** — load app, go offline, refresh, verify full functionality
5. **Mobile test** — verify single-column layout at <900px, touch targets adequate

---

## Summary

**Problem:** Home brewers need fast, trustworthy pour-over guidance without mental math.

**Approach:** Decompose the working HTML prototype into a SvelteKit app with clean separation: data modules, pure calculation functions, reactive stores, and focused UI components.

**Scope:** Medium — ~18 tasks, ~5 hours, single developer.

**Key files:** 11 components, 3 data modules, 1 calculations module, 1 store module, 1 storage utility, main page, global CSS.
