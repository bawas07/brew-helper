<script>
  /**
   * Full-screen brew modal: compact timer + 4-step sliding window.
   * Opens when the user clicks Start, keeps timer running in background.
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

  const RADIUS = 44;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let elapsed = $derived($timerElapsed);
  let running = $derived($timerRunning);
  let open = $derived($brewModalOpen);
  let steps = $derived($currentBrew.steps);
  let totalTime = $derived($currentBrew.totalTime);
  let progress = $derived(totalTime > 0 ? Math.min(elapsed / totalTime, 1) : 0);
  let dashOffset = $derived(CIRCUMFERENCE * (1 - progress));
  let isComplete = $derived(elapsed >= totalTime && totalTime > 0);

  // Find current step index based on elapsed time
  let currentStepIndex = $derived.by(() => {
    if (steps.length === 0) return -1;
    for (let i = 0; i < steps.length; i++) {
      if (elapsed >= steps[i].startSec && elapsed < steps[i].endSec) return i;
    }
    // Past all steps
    return steps.length - 1;
  });

  // Sliding window: previous (if available) + current + 2 upcoming
  let windowStart = $derived(Math.max(0, (currentStepIndex >= 0 ? currentStepIndex : 0) - 1));
  let visibleSteps = $derived(steps.slice(windowStart, windowStart + 4));

  function close() {
    $brewModalOpen = false;
  }

  function handleReset() {
    timerReset();
    close();
  }

  /** @param {MouseEvent} e */
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) close();
  }

  /** @param {KeyboardEvent} e */
  function handleKeydown(e) {
    if (e.key === 'Escape' && open) close();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label="Brew timer"
  >
    <!-- Modal panel -->
    <div class="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[100dvh] sm:max-h-[90dvh] overflow-y-auto flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
        <p class="text-[11px] tracking-widest uppercase text-ink-faint">Brewing</p>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full text-ink-faint hover:text-ink hover:bg-line/50 transition-colors"
          onclick={close}
          aria-label="Close brew timer"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Timer ring -->
      <div class="relative flex items-center justify-center py-3 shrink-0">
        <svg class="w-36 h-36 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="currentColor" stroke-width="7" class="text-line" />
          <circle
            cx="50" cy="50" r={RADIUS} fill="none" stroke="currentColor" stroke-width="7"
            stroke-linecap="round" stroke-dasharray={CIRCUMFERENCE} stroke-dashoffset={dashOffset}
            class="text-rust transition-all duration-100"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <p class="font-mono text-3xl font-semibold text-ink">{fmtTime(elapsed)}</p>
          <p class="font-mono text-[11px] text-ink-faint mt-0.5">/ {fmtTime(totalTime)}</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-center gap-3 pb-4 shrink-0">
        {#if running}
          <button
            class="px-5 py-2 bg-rust text-white font-sans text-sm font-medium rounded-lg hover:bg-rust-ink transition-colors"
            onclick={timerPause}
          >
            Pause
          </button>
        {:else}
          <button
            class="px-5 py-2 bg-rust text-white font-sans text-sm font-medium rounded-lg hover:bg-rust-ink transition-colors"
            onclick={timerStart}
            disabled={isComplete}
          >
            {elapsed > 0 ? 'Resume' : 'Start'}
          </button>
        {/if}
        <button
          class="px-5 py-2 bg-card border border-line text-ink-soft font-sans text-sm font-medium rounded-lg hover:border-rust hover:text-rust transition-colors"
          onclick={handleReset}
        >
          Reset
        </button>
      </div>

      <!-- Divider -->
      <div class="border-t border-line mx-5 shrink-0"></div>

      <!-- Step window -->
      <div class="px-5 py-4 flex-1 min-h-0">
        {#if isComplete}
          <!-- Completion state -->
          <div class="text-center py-6">
            <div class="w-12 h-12 rounded-full bg-teal flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="font-serif text-lg font-semibold text-ink">Brew complete!</p>
            <p class="text-sm text-ink-faint mt-1">Time to enjoy your coffee</p>
          </div>
        {:else if steps.length === 0}
          <p class="text-sm text-ink-faint text-center py-6">No steps for this recipe.</p>
        {:else}
          <!-- 4-step sliding window -->
          <div class="space-y-0">
            {#each visibleSteps as step, i (step.startSec)}
              {@const globalIndex = windowStart + i}
              {@const isCurrent = globalIndex === currentStepIndex}
              {@const isCompleted = elapsed >= step.endSec}

              <div class="relative flex gap-3 py-3">
                <!-- Connector line -->
                {#if i < visibleSteps.length - 1}
                  <div class="absolute left-[11px] top-[42px] bottom-0 w-0.5 border-l-2 border-dashed border-line"></div>
                {/if}

                <!-- Dot -->
                <div
                  class="relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300"
                  class:border-rust={isCurrent}
                  class:bg-rust={isCurrent}
                  class:border-teal={isCompleted}
                  class:bg-teal={isCompleted}
                  class:border-line={!isCurrent && !isCompleted}
                  class:bg-card={!isCurrent && !isCompleted}
                >
                  {#if isCompleted}
                    <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  {:else if isCurrent}
                    <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  {/if}
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-baseline justify-between gap-2">
                    <p
                      class="font-sans text-sm font-semibold transition-colors duration-300"
                      class:text-ink={isCurrent || isCompleted}
                      class:text-ink-soft={!isCurrent && !isCompleted}
                    >
                      {step.label}
                    </p>
                    <p
                      class="font-mono text-xs flex-shrink-0 transition-colors duration-300"
                      class:text-rust={isCurrent}
                      class:text-ink-faint={!isCurrent}
                    >
                      {fmtTime(step.startSec)}–{fmtTime(step.endSec)}
                    </p>
                  </div>
                  <p
                    class="mt-0.5 font-sans text-sm transition-colors duration-300"
                    class:text-ink-soft={isCurrent || isCompleted}
                    class:text-ink-faint={!isCurrent && !isCompleted}
                  >
                    {step.delta}g{#if isCurrent} · {step.purpose}{/if}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
