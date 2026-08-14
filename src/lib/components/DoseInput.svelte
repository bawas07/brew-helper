<script>
  /**
   * Dose input with number field and quick-pick chips
   */
  import { dose, setDose } from '$lib/stores/brew';
  import { DOSE_CHIP_VALUES } from '$lib/data/constants';

  /**
   * @param {Event} event
   */
  function handleInput(event) {
    const target = event.target;
    if (!target) return;
    const value = parseFloat(/** @type {HTMLInputElement} */ (target).value);
    if (!isNaN(value) && value > 0) {
      setDose(value);
    }
  }

  /**
   * @param {number} value
   */
  function handleChipClick(value) {
    setDose(value);
  }
</script>

<div class="space-y-4">
  <!-- Number input -->
  <div class="relative">
    <input
      type="number"
      class="w-full text-center font-serif text-5xl font-semibold text-ink bg-card border border-line rounded-lg shadow-card py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-rust"
      value={$dose}
      oninput={handleInput}
      min="1"
      step="0.1"
      aria-label="Coffee dose in grams"
    />
    <span class="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-2xl text-ink-soft">
      g
    </span>
  </div>

  <!-- Quick-pick chips -->
  <div class="flex flex-wrap justify-center gap-2">
    {#each DOSE_CHIP_VALUES as chipValue}
      <button
        class="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all border"
        class:bg-rust={$dose === chipValue}
        class:text-white={$dose === chipValue}
        class:border-rust={$dose === chipValue}
        class:bg-card={$dose !== chipValue}
        class:text-ink-soft={$dose !== chipValue}
        class:border-line={$dose !== chipValue}
        class:hover:border-rust={$dose !== chipValue}
        onclick={() => handleChipClick(chipValue)}
      >
        {chipValue}g
      </button>
    {/each}
  </div>
</div>
