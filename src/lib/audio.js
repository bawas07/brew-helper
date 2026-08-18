/** @type {AudioContext | null} */
let audioContext = null;

/**
 * Lazily create and resume the shared audio context.
 * Audio is initialized only after a user action so browser autoplay policies are respected.
 *
 * @returns {AudioContext | null}
 */
export function initAudio() {
  if (typeof window === 'undefined') return null;

  const browserWindow = /** @type {{ AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }} */ (window);
  const AudioContextConstructor = browserWindow.AudioContext || browserWindow.webkitAudioContext;
  if (!AudioContextConstructor) return null;

  let context = audioContext;
  if (!context) {
    try {
      context = new AudioContextConstructor();
      audioContext = context;
    } catch (error) {
      console.warn('Unable to initialize brew timer audio.', error);
      return null;
    }
  }

  if (context.state === 'suspended') {
    context.resume().catch(() => {
      console.warn('Unable to resume brew timer audio.');
    });
  }

  return context;
}

/**
 * Play a short, synthesized bell-like cue.
 * This intentionally has no external asset dependency.
 *
 * @param {number} [delaySeconds=0] Delay scheduling the cue to avoid overlap.
 */
export function playTing(delaySeconds = 0) {
  const context = initAudio();
  if (!context) return;

  try {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startTime = context.currentTime + Math.max(0, delaySeconds);
    const endTime = startTime + 0.18;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(1320, startTime + 0.04);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.16, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  } catch (error) {
    console.warn('Unable to play brew timer cue.', error);
  }
}
