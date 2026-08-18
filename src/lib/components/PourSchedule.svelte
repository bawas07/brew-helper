<script>
  /**
   * Vertical timeline of pour steps with active step highlighting
   */
  import { currentBrew } from '$lib/stores/brew';
  import { formatPourAmount, fmtTime } from '$lib/calculations';
  import { timerElapsed } from '$lib/stores/timer';

  let steps = $derived($currentBrew.steps);
  let elapsed = $derived($timerElapsed);

  /**
   * @param {{startSec: number, endSec: number}} step
   */
  function isActiveStep(step) {
    return elapsed >= step.startSec && elapsed < step.endSec;
  }

  /**
   * @param {{endSec: number}} step
   */
  function isCompletedStep(step) {
    return elapsed >= step.endSec;
  }
</script>

<div class="bg-card border border-line rounded-lg shadow-card p-5">
  <h3 class="font-serif text-xl font-semibold text-ink mb-4">Pour Schedule</h3>

  <div class="space-y-0">
    {#each steps as step, index (index)}
      {@const active = isActiveStep(step)}
      {@const completed = isCompletedStep(step)}

      <!-- Step -->
      <div class="relative flex gap-4 pb-6">
        <!-- Timeline line -->
        {#if index < steps.length - 1}
          <div class="absolute left-[11px] top-6 bottom-0 w-0.5 border-l-2 border-dashed border-line"></div>
        {/if}

        <!-- Dot -->
        <div
          class="relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center"
          class:border-rust={active}
          class:bg-rust={active}
          class:border-teal={completed}
          class:bg-teal={completed}
          class:border-line={!active && !completed}
          class:bg-card={!active && !completed}
        >
          {#if completed}
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
              <path d="M5 13l4 4L19 7" />
            </svg>
          {:else if active}
            <div class="w-2 h-2 rounded-full bg-white"></div>
          {/if}
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline justify-between gap-2">
            <p
              class="font-sans text-sm font-semibold"
              class:text-ink={active || completed}
              class:text-ink-soft={!active && !completed}
            >
              {step.label}
            </p>
            <p
              class="font-mono text-xs flex-shrink-0"
              class:text-rust={active}
              class:text-ink-faint={!active}
            >
              {fmtTime(step.startSec)}–{fmtTime(step.endSec)}
            </p>
          </div>

          <p
            class="mt-1 font-sans text-sm"
            class:text-ink-soft={active || completed}
            class:text-ink-faint={!active && !completed}
          >
            {formatPourAmount(step.delta, step.target)} · {step.purpose}
          </p>
        </div>
      </div>
    {/each}
  </div>
</div>
