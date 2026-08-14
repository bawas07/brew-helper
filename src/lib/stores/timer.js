import { writable } from 'svelte/store';

/**
 * Shared timer state for inter-component communication
 * Timer component writes to these, PourSchedule reads elapsed
 */
export const timerElapsed = writable(0);
export const timerRunning = writable(false);
