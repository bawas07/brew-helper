# Slow Pour — PRD

## Problem
Home pour-over brewers who own multiple drippers (V60, Kalita Wave, Chemex, etc.) have to
either memorize ratios/timing per dripper or hunt down recipes online mid-brew, hands wet,
kettle in hand. Iced coffee makes this worse — getting the Japanese iced method's ice/hot-water
split right requires math most people don't want to do standing at the counter. Nerds and pros
already have their dialed-in recipes and don't need this; the gap is beginners and casual home
brewers who want a fast, trustworthy "tell me what to do" tool for their specific dripper.

## Goals
- Input dripper + dose + hot/iced → get exact water amounts, temperature, and a step-by-step
  pour schedule in under 10 seconds, no account needed.
- Iced brews use the Japanese iced-coffee method (brew hot over ice) with correct dilution math,
  not just "brew hot coffee and add ice after."
- Feel calm and precise, not cluttered — a ritual tool, not a spreadsheet.
- Work offline, installable as a PWA, fast enough to feel native during an actual brew.
- Be useful without a thermometer or a calibrated grinder (both common gaps for home brewers).

## Non-goals
- No AI explain/troubleshooting features — pure calculator + steps.
- No user accounts or server-side sync — brew history is local-only (localStorage).
- No roast-level-driven temperature tuning in v1 (flagged as a future idea, not built now).
- Not building for advanced/pro users who already have their own dialed-in recipes — curated
  presets exist, but the product doesn't try to out-recipe a competition barista.

## Target users / roles
Single role: **Home brewer**. No auth, no permissions tiers. Two informal sub-profiles the UI
should serve without splitting into separate modes:
- **Beginner** — picks their dripper, uses a curated or universal preset as-is, leans on the
  grind reference labels and the no-thermometer hack.
- **Casual enthusiast** — still no account, but adjusts dose/ratio and compares curated recipes
  per dripper (e.g. Tetsu Kasuya 4:6 vs. a dripper's universal ratio).

## Core features

### Dripper selection
- **What**: Visual card grid of supported drippers, single-select.
- **Why**: People recognize their dripper by shape/brand, not by reading a dropdown list.
- **Key requirements**:
  - Supported drippers (v1): Hario V60, Kalita Wave, Origami, Hario Switch, CAFEC Abaca,
    CAFEC T-90, CAFEC Deep 27 (T27), Chemex, April Brewer, Orea Brewer, Flower Dripper.
  - Each card shows name + short descriptor (shape + relative flow speed, e.g. "Cone · Fast").
  - Selecting a dripper filters the Recipe dropdown to that dripper's curated recipes (plus the
    universal recipe, always available regardless of dripper).

### Dose & water calculator
- **What**: User enters coffee dose (grams); app computes total water from the active recipe's
  ratio, and per-step pour amounts (both incremental and running-total).
- **Why**: This is the core value of the tool — remove the mental math mid-brew.
- **Key requirements**:
  - Dose input with quick-pick chips (e.g. 12g / 15g / 20g / 30g) plus free text entry.
  - Stat row shows: Coffee, Total Water, Ratio, Brew Time (hot) — or Coffee, Total Water, Hot
    Water, Ice in Server, Brew Time (iced) — panel must flex layout between 3-4 and 5 stat cards,
    not a fixed grid.
  - Pour schedule list: each step shows incremental amount ("+27g"), running total ("to 54g
    total"), a one-line purpose/rationale, and a time range.

### Iced brewing (Japanese method)
- **What**: Toggle between Hot and Iced. Iced mode brews hot, concentrated, directly over ice in
  the server so melt dilutes it to the target final ratio.
- **Why**: This is the single most math-heavy part of the product and the reason a generic
  ratio calculator isn't good enough — most home brewers get this wrong by hand.
- **Key requirements**:
  - Given dose `D` and ratio `R`: `total_water = D × R`.
  - Split total water into ice weight and hot water weight using a default ice fraction (~40%
    ice / 60% hot water), so `ice = total_water × 0.4`, `hot_water = total_water × 0.6`.
  - All pour steps in iced mode are computed against `hot_water`, not `total_water` — the ice
    is placed in the server before brewing, not poured.
  - Recipe note must explicitly instruct: put ice in server first, brew hot water over it.
  - **Open question**: should ice fraction vary by dripper flow speed (slow drippers → more melt
    happens during brew, so maybe less ice needed)? Deferred — v1 uses a flat 40% default.

### Temperature guidance
- **What**: Each recipe has a target water temperature (or range). A toggle switches °C/°F.
  For users without a thermometer, show an approximate "time off boil" hack instead.
- **Why**: Explicitly requested — most home brewers don't own a thermometer, and temp matters
  a lot for both flavor and (in iced mode) getting the overshoot right.
- **Key requirements**:
  - Target temp shown prominently per recipe (e.g. "93°C, range 91–94°C").
  - °C/°F toggle converts the displayed number; the underlying wait-time hack is temperature-based
    so it doesn't change with the unit toggle, only its displayed label does.
  - No-thermometer hack: approximate "seconds/minutes off boil" to reach the target temp, using
    a lookup/interpolation table (roughly: 30s ≈ 95°C, 60s ≈ 90°C, 120s ≈ 85°C, 180s ≈ 80°C).
    Must be labeled as approximate (varies by altitude, kettle, ambient temp).

### Grind size guidance
- **What**: Stepped (not continuous) grind selector with both an abstract label and a familiar
  reference grind, e.g. "Medium-Fine — like Moka Pot".
- **Why**: Most home brewers don't have calibrated numeric grinders; "adjust to what you already
  use for X" is more actionable than "grind setting 4.5".
- **Key requirements**:
  - 7-step scale: Extra Fine (Espresso) → Fine (Moka Pot) → Medium-Fine (fast pour-over) →
    Medium (standard pour-over) → Medium-Coarse (slow pour-over, e.g. CAFEC T27) → Coarse
    (French Press) → Extra Coarse (Cold Brew).
  - Stepped/snapping control, not free-drag — easier on touch, avoids imprecise input.
  - Each dripper/recipe pre-selects a sensible default step (e.g. CAFEC T27 defaults coarser
    than CAFEC Abaca since it drains much slower).

### Recipe selection (curated + universal)
- **What**: Dropdown of recipes available for the selected dripper. Always includes "Universal"
  (a simple, dripper-agnostic ratio + basic bloom/pour structure). May also include curated,
  named recipes for that dripper (e.g. Tetsu Kasuya 4:6 for V60).
- **Why**: Beginners get a safe default that always works; anyone curious can compare a named
  method without the tool trying to be a full recipe database.
- **Key requirements**:
  - Switching recipe recalculates the entire right-hand panel (stats, temp, grind default, pour
    schedule) immediately.
  - Each recipe includes a short rationale note (e.g. "First 40% controls sweetness/acidity,
    last 60% controls strength") shown near the recipe name.

### Guided timer
- **What**: Large countdown/elapsed timer with the current step name and target highlighted,
  and the full step list below with the active step visually marked.
- **Why**: This is the "hands wet, glance at the phone" moment the whole product exists for.
- **Key requirements**:
  - Shows current phase (e.g. "NOW · Step 2 — Pour 2: Balance · pour to 54g").
  - Start / pause / reset controls.
  - Active step is visually distinct in the pour schedule list (not just in the timer header).

### Brew journal (local only)
- **What**: List of past brews (dripper, recipe, dose, date), stored in localStorage, no account.
- **Why**: Lets a user repeat a good brew without re-entering everything, without any backend.
- **Key requirements**:
  - "Save this brew" action from the recipe panel.
  - Empty state explains data is device-local (sets expectation, avoids "where did my brews go"
    confusion if they switch devices/clear browser data).
  - v1: view + reload into calculator. No editing/renaming required for v1.

## Data entities (high level)
- **Dripper** — id, name, shape descriptor, relative flow speed, default grind step.
- **Recipe** — id, dripper id (or "universal"), name, ratio, rationale note, temp target (hot
  and, if different, iced), default grind step override, ice fraction override (optional), list
  of Steps.
- **Step** — order, label (e.g. "Bloom", "Pour 2 — Balance"), cumulative % of water target,
  purpose/rationale text, time range.
- **Brew (journal entry)** — dripper id, recipe id, dose, hot/iced, timestamp. Stored client-side
  only (localStorage), no server entity.

## Out-of-scope / future considerations
- Accounts / cross-device sync.
- AI-generated explanations or troubleshooting ("why does my coffee taste sour").
- Roast-level as an input that shifts temperature/grind recommendations.
- Ice fraction varying by dripper flow speed instead of a flat default.
- Shareable recipe links (URL-encoded state) — would not require a backend, but deferred.
- Native Android widget via a sideloaded wrapper (explored separately, not part of the PWA
  itself — see PWA Widgets platform proposal, not yet available on Android as of this writing).
