import { writable, get } from 'svelte/store';
import { initAudio } from '$lib/audio';

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
let _wakeLockSentinel = /** @type {WakeLockSentinel | null} */ (null);
let _wakeLockGeneration = 0;
let _wakeLockRequestInFlight = false;

/** @param {WakeLockSentinel} sentinel */
function releaseSentinel(sentinel) {
  try {
    sentinel.release().catch((error) => {
      console.warn('Unable to release screen wake lock.', error);
    });
  } catch (error) {
    console.warn('Unable to release screen wake lock.', error);
  }
}

function isDocumentVisible() {
  return typeof document !== 'undefined' && document.visibilityState === 'visible';
}

/** Keep the screen on while the active brew timer is running. */
export async function acquireWakeLock() {
  if (typeof navigator === 'undefined' || !navigator.wakeLock) return;
  if (!get(timerRunning) || !isDocumentVisible()) return;
  if (_wakeLockSentinel?.released) _wakeLockSentinel = null;
  if (_wakeLockSentinel || _wakeLockRequestInFlight) return;

  const requestGeneration = _wakeLockGeneration;
  _wakeLockRequestInFlight = true;
  let requestNeedsRetry = false;

  try {
    const sentinel = await navigator.wakeLock.request('screen');
    const requestIsCurrent =
      requestGeneration === _wakeLockGeneration &&
      get(timerRunning) &&
      isDocumentVisible() &&
      !sentinel.released;

    if (!requestIsCurrent) {
      requestNeedsRetry = true;
      releaseSentinel(sentinel);
      return;
    }

    _wakeLockSentinel = sentinel;
    sentinel.addEventListener('release', () => {
      if (_wakeLockSentinel === sentinel) _wakeLockSentinel = null;
    });
  } catch (error) {
    // Wake Lock is an enhancement; unsupported or denied requests must not stop brewing.
    console.warn('Unable to acquire screen wake lock.', error);
  } finally {
    _wakeLockRequestInFlight = false;
    if (requestNeedsRetry && get(timerRunning) && isDocumentVisible()) {
      void acquireWakeLock();
    }
  }
}

/** Release the screen wake lock when the timer is no longer active. */
export function releaseWakeLock() {
  _wakeLockGeneration += 1;
  if (!_wakeLockSentinel) return;

  const sentinel = _wakeLockSentinel;
  _wakeLockSentinel = null;
  releaseSentinel(sentinel);
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && get(timerRunning)) {
      void acquireWakeLock();
    }
  });
}

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

  // Called from a button handler, so initialize audio while the gesture is active.
  initAudio();
  void acquireWakeLock();
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
  releaseWakeLock();
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
  releaseWakeLock();
}
