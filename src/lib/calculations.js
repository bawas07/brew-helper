import { DRIPPERS } from './data/drippers.js';
import { RECIPES } from './data/recipes.js';
import { COOL_TABLE } from './data/constants.js';

/**
 * Find a dripper by its ID
 */
export function dripperById(id) {
  return DRIPPERS.find((d) => d.id === id);
}

/**
 * Get recipes available for a given dripper, sorted by relevance:
 * native → compatible → universal
 */
export function recipesForDripper(dripperId) {
  const allRecipes = Object.values(RECIPES).filter((r) => r.id !== 'universal');
  const native = allRecipes.filter((r) => r.native === dripperId);
  const compatible = allRecipes.filter(
    (r) => r.native !== dripperId && (r.compatible || []).includes(dripperId),
  );

  return [
    ...native.map((r) => ({ recipe: r, badge: 'native', badgeText: 'Recommended' })),
    ...compatible.map((r) => ({ recipe: r, badge: 'compatible', badgeText: 'Also works well' })),
    { recipe: RECIPES.universal, badge: 'universal', badgeText: 'Universal' },
  ];
}

/**
 * Format seconds into "m:ss" string
 */
export function fmtTime(seconds) {
  const sec = Math.max(0, Math.round(seconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Format a pour amount as an incremental pour and cumulative target.
 * @param {number} delta
 * @param {number} target
 */
export function formatPourAmount(delta, target) {
  if (delta <= 0) return `${target}g total`;
  return `${delta}g → ${target}g total`;
}

/**
 * Convert Celsius to Fahrenheit (rounded)
 */
export function cToF(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Look up approximate "seconds off boil" for a target temperature
 * Uses linear interpolation between COOL_TABLE entries
 */
export function hackSecondsFor(targetC) {
  const table = COOL_TABLE;

  if (targetC >= table[0].t) return 0;

  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (targetC <= a.t && targetC >= b.t) {
      const ratio = (a.t - targetC) / (a.t - b.t);
      return a.s + ratio * (b.s - a.s);
    }
  }

  // Below table range — extrapolate
  const a = table[table.length - 2];
  const b = table[table.length - 1];
  const slope = (b.s - a.s) / (a.t - b.t);
  return b.s + slope * (b.t - targetC);
}

/**
 * Compute the full brew parameters from current state
 * Returns all values needed for the output panel
 */
export function computeBrew(state) {
  const recipe = RECIPES[state.recipeId];
  const dripper = dripperById(state.dripperId);
  const dose = Math.max(1, state.dose);

  const totalWater = dose * recipe.ratio;
  const isIced = state.mode === 'iced';
  const iceFraction = recipe.iceFraction ?? 0.4;
  const ice = isIced ? Math.round(totalWater * iceFraction) : 0;
  const baseWater = isIced ? totalWater - ice : totalWater;
  const tempC = isIced ? recipe.tempIced : recipe.tempHot;

  // Compute pour steps with cumulative amounts and timing
  let cumulative = 0;
  let prevSec = 0;
  const steps = recipe.steps.map((s) => {
    const target = Math.round(baseWater * s.pct);
    const delta = target - cumulative;
    cumulative = target;
    const startSec = prevSec;
    const endSec = prevSec + s.dur;
    prevSec = endSec;
    return { ...s, delta, target, startSec, endSec };
  });

  const totalTime = steps.length > 0 ? steps[steps.length - 1].endSec : 0;

  // Recipe overrides are absolute scale positions; otherwise use the dripper default.
  const hasRecipeGrindOverride = recipe.grindOverride !== null && recipe.grindOverride !== undefined;
  const grindIdx = hasRecipeGrindOverride ? recipe.grindOverride : dripper.grind;
  const grindAdjustment = hasRecipeGrindOverride ? grindIdx - dripper.grind : 0;

  // Determine fit badge relative to the currently selected dripper
  let fit = 'universal';
  let fitText = 'Works with any dripper';
  if (recipe.native === dripper.id) {
    fit = 'native';
    fitText = `Recommended for ${dripper.name}`;
  } else if ((recipe.compatible || []).includes(dripper.id)) {
    fit = 'compatible';
    fitText = `Also works well on ${dripper.name}`;
  }

  return {
    recipe,
    dripper,
    dose,
    totalWater: Math.round(totalWater),
    isIced,
    ice,
    hotWater: Math.round(baseWater),
    tempC,
    steps,
    totalTime,
    grindIdx,
    grindAdjustment,
    fit,
    fitText,
  };
}
