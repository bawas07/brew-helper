/**
 * localStorage wrapper for brew journal
 * All data stays on-device, no server sync
 */

import { JOURNAL_KEY, MAX_JOURNAL_ENTRIES } from '$lib/data/constants';

/**
 * Load journal entries from localStorage
 * Returns empty array if nothing stored or parse fails
 */
export function loadJournal() {
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load journal:', e);
    return [];
  }
}

/**
 * Save a new brew entry to the journal
 * Prepends to array, caps at MAX_JOURNAL_ENTRIES
 */
export function saveJournalEntry(entry) {
  const entries = loadJournal();
  entries.unshift(entry);
  const trimmed = entries.slice(0, MAX_JOURNAL_ENTRIES);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(trimmed));
  return trimmed;
}

/**
 * Delete a journal entry by ID
 */
export function deleteJournalEntry(id) {
  const entries = loadJournal().filter((e) => e.id !== id);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  return entries;
}

/**
 * Format ISO date string to short date (e.g., "Jan 15")
 */
export function fmtDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Create a journal entry from current brew state
 */
export function createJournalEntry(brew, state) {
  return {
    id: Date.now(),
    dripperId: state.dripperId,
    dripperName: brew.dripper.name,
    recipeId: state.recipeId,
    recipeName: brew.recipe.name,
    dose: brew.dose,
    mode: state.mode,
    ratio: brew.recipe.ratio,
    ts: new Date().toISOString(),
  };
}
