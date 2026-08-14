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

- **Framework**: SvelteKit + Svelte 5
- **Styling**: Tailwind CSS v4
- **PWA**: vite-plugin-pwa
- **Deployment**: Static site (Vercel-ready)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── lib/
│   ├── components/     # 11 Svelte components
│   ├── stores/         # State management (brew + timer)
│   ├── data/           # Dripper & recipe data
│   ├── calculations.js # Brewing math logic
│   └── storage.js      # localStorage utilities
└── routes/
    ├── +page.svelte    # Main page
    └── +layout.svelte  # Root layout with fonts
```

## Development

The app uses Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactivity. All brewing calculations are in `calculations.js` for easy testing.

## License

MIT
