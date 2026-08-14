<script>
  /**
   * Grind size selector with range slider and readout
   */
  import { grindIndex, setGrind } from '$lib/stores/brew';
  import { GRIND_STEPS } from '$lib/data/constants';

  /**
   * @param {Event} event
   */
  function handleInput(event) {
    const target = event.target;
    if (!target) return;
    const value = parseInt(/** @type {HTMLInputElement} */ (target).value, 10);
    setGrind(value);
  }

  let currentGrind = $derived(GRIND_STEPS[$grindIndex]);
</script>

<div class="bg-card border border-line rounded-lg shadow-card p-5 space-y-4">
  <div class="flex items-baseline justify-between">
    <label class="font-sans text-sm font-medium text-ink-soft" for="grind-slider">
      Grind Size
    </label>
    <div class="text-right">
      <p class="font-serif text-xl font-semibold text-ink">
        {currentGrind.label}
      </p>
      <p class="font-sans text-xs text-ink-faint">
        {currentGrind.ref}
      </p>
    </div>
  </div>

  <input
    id="grind-slider"
    type="range"
    min="0"
    max="6"
    step="1"
    value={$grindIndex}
    oninput={handleInput}
    aria-label="Grind size"
  />
</div>
