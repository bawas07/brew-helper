<script>
  /**
   * Recipe output panel with brew stats, fit badge, temperature toggle,
   * grind info, ice instructions, and save-to-journal button
   */
  import { currentBrew, mode, dripperId, recipeId, tempUnit, toggleTempUnit } from '$lib/stores/brew';
  import { fmtTime, cToF, hackSecondsFor } from '$lib/calculations';
  import { GRIND_STEPS } from '$lib/data/constants';
  import { saveJournalEntry, createJournalEntry } from '$lib/storage';

  /** @param {Event} event */
  function handleSaveBrew(event) {
    event.preventDefault();
    const entry = createJournalEntry($currentBrew, {
      dripperId: $dripperId,
      recipeId: $recipeId,
      mode: $mode,
    });
    saveJournalEntry(entry);
  }

  let brew = $derived($currentBrew);
  let ratioDisplay = $derived(
    `1:${brew.recipe.ratio.toFixed(brew.recipe.ratio % 1 === 0 ? 0 : 1)}`,
  );
  let tempDisplay = $derived($tempUnit === 'C' ? `${brew.tempC}°C` : `${cToF(brew.tempC)}°F`);

  /** @type {string} */
  let fitBadgeColors = $derived({
    native: 'bg-gold-soft text-gold',
    compatible: 'bg-teal-soft text-teal',
    universal: 'bg-line/50 text-ink-soft',
  }[brew.fit] || 'bg-line/50 text-ink-soft');

  let grindStep = $derived(GRIND_STEPS[brew.grindIdx] || GRIND_STEPS[3]);
  let grindGuidance = $derived.by(() => {
    const adjustment = brew.grindAdjustment;
    const dripperName = brew.dripper?.name || 'selected dripper';
    if (adjustment === 0) return `Use the ${dripperName} default grind.`;

    const direction = adjustment < 0 ? 'finer' : 'coarser';
    const stepCount = Math.abs(adjustment);
    const stepLabel = stepCount === 1 ? 'step' : 'steps';
    return `${stepCount} ${stepLabel} ${direction} than the ${dripperName} default.`;
  });
  let hackSec = $derived(hackSecondsFor(brew.tempC));
  let hackText = $derived(
    hackSec < 5
      ? 'Use right off the boil.'
      : `No thermometer? Wait about ${fmtTime(hackSec)} off the boil.`,
  );
</script>

{#if brew && brew.dripper}
  <div class="bg-card border border-line rounded-lg shadow-card">
    <!-- Header -->
    <div class="p-5 pb-4 border-b border-line flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-[11px] tracking-widest uppercase text-ink-faint mb-0.5">Your recipe</p>
        <h2 class="font-serif font-medium text-[22px] leading-tight text-ink">
          {brew.recipe.name}
        </h2>
        <p class="text-sm text-ink-faint mt-1">
          {brew.dripper.name} · {ratioDisplay}
        </p>
        <span class="inline-block mt-1.5 text-[10.5px] font-bold tracking-wide px-2.5 py-0.5 rounded-full {fitBadgeColors}">
          {brew.fitText}
        </span>
      </div>
      <button
        class="bg-ink text-white font-semibold text-sm rounded-full px-4 py-2.5 flex items-center gap-1.5 hover:bg-rust-ink transition-colors shrink-0"
        onclick={handleSaveBrew}
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        Save brew
      </button>
    </div>

    <!-- Stats row (flex-wrap to handle 4 or 5 stats) -->
    <div class="flex flex-wrap px-5 py-4">
      <div class="flex-1 min-w-[90px] pr-4">
        <p class="text-[10.5px] tracking-wider uppercase text-ink-faint mb-1">Coffee</p>
        <p class="font-mono text-[22px] font-semibold text-ink">{brew.dose}<span class="text-xs text-ink-faint font-normal">g</span></p>
      </div>
      <div class="flex-1 min-w-[90px] border-l border-line pl-4">
        <p class="text-[10.5px] tracking-wider uppercase text-ink-faint mb-1">Total water</p>
        <p class="font-mono text-[22px] font-semibold text-ink">{brew.totalWater}<span class="text-xs text-ink-faint font-normal">g</span></p>
      </div>
      {#if brew.isIced}
        <div class="flex-1 min-w-[90px] border-l border-line pl-4">
          <p class="text-[10.5px] tracking-wider uppercase text-ink-faint mb-1">Hot water</p>
          <p class="font-mono text-[22px] font-semibold text-teal">{brew.hotWater}<span class="text-xs text-ink-faint font-normal">g</span></p>
        </div>
        <div class="flex-1 min-w-[90px] border-l border-line pl-4">
          <p class="text-[10.5px] tracking-wider uppercase text-ink-faint mb-1">Ice in server</p>
          <p class="font-mono text-[22px] font-semibold text-teal">{brew.ice}<span class="text-xs text-ink-faint font-normal">g</span></p>
        </div>
      {:else}
        <div class="flex-1 min-w-[90px] border-l border-line pl-4">
          <p class="text-[10.5px] tracking-wider uppercase text-ink-faint mb-1">Ratio</p>
          <p class="font-mono text-[22px] font-semibold text-ink">{ratioDisplay}</p>
        </div>
        <div class="flex-1 min-w-[90px] border-l border-line pl-4">
          <p class="text-[10.5px] tracking-wider uppercase text-ink-faint mb-1">Brew time</p>
          <p class="font-mono text-[22px] font-semibold text-ink">{fmtTime(brew.totalTime)}</p>
        </div>
      {/if}
    </div>

    <!-- Notes -->
    <div class="px-5 pb-5 flex flex-col gap-2">
      {#if brew.isIced}
        <div class="flex gap-2 text-[13px] text-ink-soft leading-relaxed">
          <svg class="w-3.5 h-3.5 shrink-0 mt-0.5 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span><b class="text-ink font-semibold">{brew.ice}g of ice</b> goes in the server before brewing — melt dilutes to target ratio.</span>
        </div>
      {/if}
      <div class="flex gap-2 text-[13px] text-ink-soft leading-relaxed">
        <svg class="w-3.5 h-3.5 shrink-0 mt-0.5 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Water at <b class="text-ink font-semibold">{tempDisplay}</b> (±2–3°C). {hackText}</span>
      </div>
      <div class="flex gap-2 text-[13px] text-ink-soft leading-relaxed">
        <svg class="w-3.5 h-3.5 shrink-0 mt-0.5 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Grind: <b class="text-ink font-semibold">{grindGuidance}</b> Effective: {grindStep.label}, like {grindStep.ref}.</span>
      </div>
      <div class="flex gap-2 text-[13px] text-ink-soft leading-relaxed">
        <svg class="w-3.5 h-3.5 shrink-0 mt-0.5 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Pre-rinse the paper filter with hot water to remove papery taste and warm the dripper.</span>
      </div>
    </div>
  </div>
{/if}
