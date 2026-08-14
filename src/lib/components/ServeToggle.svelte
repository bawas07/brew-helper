<script>
  /**
   * Two-segment pill toggle for hot/iced brewing mode
   */
  import { mode, toggleMode } from '$lib/stores/brew';

  function handleHotClick() {
    toggleMode('hot');
  }

  function handleIcedClick() {
    toggleMode('iced');
  }
</script>

<div class="inline-flex rounded-full bg-card border border-line p-1 shadow-card">
  <button
    class="flex items-center gap-2 px-5 py-2 rounded-full font-sans text-sm font-medium transition-all"
    class:bg-rust={$mode === 'hot'}
    class:text-white={$mode === 'hot'}
    class:text-ink-soft={$mode !== 'hot'}
    class:hover:bg-rust-soft={$mode !== 'hot'}
    onclick={handleHotClick}
    aria-pressed={$mode === 'hot'}
  >
    <!-- Hot icon (flame) -->
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
    </svg>
    <span>Hot</span>
  </button>

  <button
    class="flex items-center gap-2 px-5 py-2 rounded-full font-sans text-sm font-medium transition-all"
    class:bg-teal={$mode === 'iced'}
    class:text-white={$mode === 'iced'}
    class:text-ink-soft={$mode !== 'iced'}
    class:hover:bg-teal-soft={$mode !== 'iced'}
    onclick={handleIcedClick}
    aria-pressed={$mode === 'iced'}
  >
    <!-- Iced icon (snowflake) -->
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
    </svg>
    <span>Iced</span>
  </button>
</div>
