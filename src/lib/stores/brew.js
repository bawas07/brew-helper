import { writable, derived } from 'svelte/store';
import { computeBrew, recipesForDripper, dripperById } from '$lib/calculations';
import { RECIPES } from '$lib/data/recipes';
import { DEFAULT_DOSE } from '$lib/data/constants';

// Writable stores (source of truth)
export const mode = writable('hot'); // 'hot' | 'iced'
export const dose = writable(DEFAULT_DOSE); // number (grams)
export const dripperId = writable('v60'); // string
export const recipeId = writable('universal'); // string
export const tempUnit = writable('C'); // 'C' | 'F'

// Derived stores
export const currentRecipe = derived(recipeId, ($recipeId) => RECIPES[$recipeId]);

export const currentDripper = derived(dripperId, ($dripperId) => dripperById($dripperId));

export const availableRecipes = derived(dripperId, ($dripperId) => recipesForDripper($dripperId));

export const currentBrew = derived(
  [mode, dose, dripperId, recipeId],
  ([$mode, $dose, $dripperId, $recipeId]) => {
    return computeBrew({
      mode: $mode,
      dose: $dose,
      dripperId: $dripperId,
      recipeId: $recipeId,
    });
  }
);

// Action functions
export function setDripper(id) {
  dripperId.set(id);
  // Always reset to Universal 1:16 on dripper change
  recipeId.set('universal');
}

export function setRecipe(id) {
  recipeId.set(id);
}

/**
 * Set the coffee dose in grams
 * @param {number} value
 */
export function setDose(value) {
  dose.set(value);
}

/**
 * Toggle between hot and iced brewing modes
 * @param {'hot'|'iced'} newMode
 */
export function toggleMode(newMode) {
  mode.set(newMode);
}

export function toggleTempUnit() {
  tempUnit.update((current) => (current === 'C' ? 'F' : 'C'));
}
