<script>
  /**
   * Circular progress timer with start/pause/reset controls
   */
  import { currentBrew } from '$lib/stores/brew';
  import { fmtTime } from '$lib/calculations';
  import { timerElapsed, timerRunning } from '$lib/stores/timer';

  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let intervalId = /** @type {number | null} */ ($state(null));
  let startTime = $state(null);
  let pausedElapsed = $state(0);

  let elapsed = $derived($timerElapsed);
  let running = $derived($timerRunning);
  let totalTime = $derived($currentBrew.totalTime);
  let progress = $derived(totalTime > 0 ? Math.min(elapsed / totalTime, 1) : 0);
  let dashOffset = $derived(CIRCUMFERENCE * (1 - progress));
  let isComplete = $derived(elapsed >= totalTime && totalTime > 0);

  // Reset when recipe/dose changes
  $effect(() => {
    const _totalTime = $currentBrew.totalTime;
    reset();
  });

  // Auto-pause when complete
  $effect(() => {
    if (isComplete && running) {
      pause();
    }
  });

  function start() {
    startTime = Date.now() - pausedElapsed * 1000;
    $timerRunning = true;
    intervalId = setInterval(tick, 100);
  }

  function pause() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    pausedElapsed = $timerElapsed;
    $timerRunning = false;
  }

  function reset() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    pausedElapsed = 0;
    $timerElapsed = 0;
    $timerRunning = false;
  }

  function tick() {
    if (startTime) {
      $timerElapsed = (Date.now() - startTime) / 1000;
    }
  }
</script>

<div class="bg-card border border-line rounded-lg shadow-card p-5 space-y-5">
  <!-- Progress ring -->
  <div class="relative flex items-center justify-center">
    <svg class="w-48 h-48 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
      <!-- Background circle -->
      <circle
        cx="60"
        cy="60"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        stroke-width="8"
        class="text-line"
      />
      <!-- Progress circle -->
      <circle
        cx="60"
        cy="60"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray={CIRCUMFERENCE}
        stroke-dashoffset={dashOffset}
        class="text-rust transition-all duration-100"
      />
    </svg>

    <!-- Time display -->
    <div class="absolute inset-0 flex items-center justify-center">
      <p class="font-mono text-4xl font-semibold text-ink">
        {fmtTime(elapsed)}
      </p>
    </div>
  </div>

  <!-- Controls -->
  <div class="flex justify-center gap-3">
    {#if running}
      <button
        class="px-6 py-2 bg-rust text-white font-sans text-sm font-medium rounded-lg hover:bg-rust-ink transition-colors"
        onclick={pause}
      >
        Pause
      </button>
    {:else}
      <button
        class="px-6 py-2 bg-rust text-white font-sans text-sm font-medium rounded-lg hover:bg-rust-ink transition-colors"
        onclick={start}
        disabled={isComplete}
      >
        {elapsed > 0 ? 'Resume' : 'Start'}
      </button>
    {/if}

    <button
      class="px-6 py-2 bg-card border border-line text-ink-soft font-sans text-sm font-medium rounded-lg hover:border-rust hover:text-rust transition-colors"
      onclick={reset}
    >
      Reset
    </button>
  </div>
</div>
