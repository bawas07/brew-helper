<script>
  /**
   * Circular progress timer with start/pause/reset controls.
   * On Start, opens the BrewModal for focused brewing view.
   * Shows compact "brewing" bar while modal is open.
   */
  import { currentBrew } from '$lib/stores/brew';
  import { fmtTime } from '$lib/calculations';
  import {
    timerElapsed,
    timerRunning,
    brewModalOpen,
    timerStart,
    timerPause,
    timerReset,
  } from '$lib/stores/timer';

  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let elapsed = $derived($timerElapsed);
  let running = $derived($timerRunning);
  let modalOpen = $derived($brewModalOpen);
  let totalTime = $derived($currentBrew.totalTime);
  let progress = $derived(totalTime > 0 ? Math.min(elapsed / totalTime, 1) : 0);
  let dashOffset = $derived(CIRCUMFERENCE * (1 - progress));
  let isComplete = $derived(elapsed >= totalTime && totalTime > 0);

  // Reset when recipe/dose changes
  $effect(() => {
    const _totalTime = $currentBrew.totalTime;
    timerReset();
  });

  // Auto-pause when complete
  $effect(() => {
    if (isComplete && running) {
      timerPause();
    }
  });

  function handleStart() {
    timerStart();
    $brewModalOpen = true;
  }

  function openModal() {
    $brewModalOpen = true;
  }
</script>

{#if modalOpen}
  <!-- Compact brewing bar (shown while modal is open) -->
  <div class="bg-card border border-line rounded-lg shadow-card px-4 py-3 flex items-center justify-between gap-3">
    <div class="flex items-center gap-3 min-w-0">
      <!-- Mini progress ring -->
      <div class="relative w-10 h-10 flex-shrink-0">
        <svg class="w-10 h-10 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8" class="text-line" />
          <circle
            cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8"
            stroke-linecap="round" stroke-dasharray={CIRCUMFERENCE}
            stroke-dashoffset={CIRCUMFERENCE * (1 - progress)}
            class="text-rust transition-all duration-100"
          />
        </svg>
      </div>
      <div class="min-w-0">
        <p class="font-mono text-lg font-semibold text-ink leading-tight">{fmtTime(elapsed)}</p>
        <p class="text-[11px] text-ink-faint">{#if isComplete}Done{:else}Brewing…{/if}</p>
      </div>
    </div>
    <button
      class="px-4 py-2 bg-rust text-white font-sans text-sm font-medium rounded-lg hover:bg-rust-ink transition-colors shrink-0"
      onclick={openModal}
    >
      Open
    </button>
  </div>
{:else}
  <!-- Full timer UI -->
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
          onclick={timerPause}
        >
          Pause
        </button>
      {:else}
        <button
          class="px-6 py-2 bg-rust text-white font-sans text-sm font-medium rounded-lg hover:bg-rust-ink transition-colors"
          onclick={handleStart}
          disabled={isComplete}
        >
          {elapsed > 0 ? 'Resume' : 'Start'}
        </button>
      {/if}

      <button
        class="px-6 py-2 bg-card border border-line text-ink-soft font-sans text-sm font-medium rounded-lg hover:border-rust hover:text-rust transition-colors"
        onclick={timerReset}
      >
        Reset
      </button>
    </div>
  </div>
{/if}
