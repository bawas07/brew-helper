// Grind size scale: 7 steps from Extra Fine to Extra Coarse
// Each step includes an abstract label and a familiar reference grind
export const GRIND_STEPS = [
  { label: 'Extra Fine', ref: 'Espresso' },
  { label: 'Fine', ref: 'Moka Pot' },
  { label: 'Medium-Fine', ref: 'Fast Pour-Over' },
  { label: 'Medium', ref: 'Standard Pour-Over' },
  { label: 'Medium-Coarse', ref: 'Slow Pour-Over' },
  { label: 'Coarse', ref: 'French Press' },
  { label: 'Extra Coarse', ref: 'Cold Brew' },
];

// Approximate cooling curve for no-thermometer hack
// Maps target temperature (°C) to seconds off boil
export const COOL_TABLE = [
  { t: 100, s: 0 },
  { t: 96, s: 15 },
  { t: 95, s: 30 },
  { t: 93, s: 40 },
  { t: 90, s: 60 },
  { t: 88, s: 75 },
  { t: 85, s: 120 },
  { t: 82, s: 150 },
  { t: 80, s: 180 },
];

// Default values
export const DEFAULT_DOSE = 15;
export const DOSE_CHIP_VALUES = [12, 15, 18, 20, 30];
export const DEFAULT_ICE_FRACTION = 0.4;

// Storage keys
export const JOURNAL_KEY = 'slowpour_brews';
export const MAX_JOURNAL_ENTRIES = 20;
