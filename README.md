# Slow Pour — Home Brew Calculator

A calm, precise pour-over coffee companion built with SvelteKit.

## Features

- **Dripper Selection**: Choose from 11 popular dripper types (V60, Chemex, Kalita Wave, etc.)
- **Smart Calculations**: Automatic water/ice ratios for hot and Japanese iced brewing methods
- **Guided Timer**: Step-by-step brewing with real-time progress tracking
- **Curated Recipes**: Classic brew methods from world champion baristas
- **Grind Guidance**: Contextual grind size recommendations per dripper
- **Temperature Control**: Celsius/Fahrenheit toggle with "time off boil" guidance
- **Brew Journal**: Save and track your brewing history (localStorage)
- **PWA Support**: Install as a mobile app, works offline

## Tech Stack

- **Framework**: SvelteKit + Svelte 5 (runes)
- **Styling**: Tailwind CSS v4
- **PWA**: vite-plugin-pwa
- **Build adapter**: @sveltejs/adapter-static
- **Deployment**: Cloudflare Workers (static assets served via Wrangler)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (outputs to ./build)
npm run build

# Preview the production build locally (served via wrangler dev)
npm run preview

# Deploy to Cloudflare Workers
npm run deploy
```

> `preview` and `deploy` require a Cloudflare account and Wrangler auth (`wrangler login`).

## Project Structure

```
src/
├── app.html              # HTML shell, fonts, PWA meta
├── app.d.ts              # App-level type declarations
├── lib/
│   ├── assets/           # Static assets (favicon, etc.)
│   ├── calculations.js   # Brewing math logic (pure functions)
│   ├── components/       # 11 Svelte components
│   ├── data/             # Dripper, recipe, and constants data
│   ├── index.js          # Public library exports
│   ├── storage.js        # localStorage utilities
│   └── stores/           # State management (brew + timer runes)
└── routes/
    ├── +layout.js        # Layout load / config
    ├── +layout.svelte    # Root layout with fonts
    ├── +page.svelte      # Main page
    └── layout.css        # Global styles
```

## Development

The app uses Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactivity. All brewing calculations are in `calculations.js` for easy testing.

## Deployment

The app builds a static site (`@sveltejs/adapter-static`) into `./build`, which is served as Cloudflare assets. Configuration lives in `wrangler.jsonc` (SPA fallback enabled).

```bash
# Authenticate once
wrangler login

# Build + deploy to Cloudflare Workers
npm run deploy
```

## License

MIT
