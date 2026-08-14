import { writable } from 'svelte/store';

/**
 * Shared timer state for inter-component communication.
 * Timer component and BrewModal both read these stores
 * and call the exported control functions.
 */
export const timerElapsed = writable(0);
export const timerRunning = writable(false);
export const brewModalOpen = writable(false);

// ── Internal timer state ──
let _intervalId = /** @type {ReturnType<typeof setInterval> | null} */ (null);
let _startTime = /** @type {number | null} */ (null);
let _pausedElapsed = 0;

function _tick() {
  if (_startTime) {
    timerElapsed.set((Date.now() - _startTime) / 1000);
  }
}

/** Start or resume the timer */
export function timerStart() {
  if (_intervalId) return;
  _startTime = Date.now() - _pausedElapsed * 1000;
  timerRunning.set(true);
  _intervalId = setInterval(_tick, 100);
}

/** Pause the timer, preserving elapsed time */
export function timerPause() {
  if (_intervalId) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
  timerElapsed.subscribe((v) => {
    _pausedElapsed = v;
  })();
  timerRunning.set(false);
}

/** Reset timer to zero */
export function timerReset() {
  if (_intervalId) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
  _pausedElapsed = 0;
  _startTime = null;
  timerElapsed.set(0);
  timerRunning.set(false);
}
