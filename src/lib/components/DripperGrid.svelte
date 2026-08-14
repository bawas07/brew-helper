<script>
  /**
   * Grid of dripper cards with selection state
   */
  import { dripperId, setDripper } from '$lib/stores/brew';
  import { DRIPPERS } from '$lib/data/drippers';

  /**
   * @param {string} id
   */
  function handleClick(id) {
    setDripper(id);
  }
</script>

<div class="grid grid-cols-2 gap-3">
  {#each DRIPPERS as dripper (dripper.id)}
    <button
      class="text-left p-4 rounded-lg border transition-all"
      class:border-rust={$dripperId === dripper.id}
      class:bg-rust-soft={$dripperId === dripper.id}
      class:border-line={$dripperId !== dripper.id}
      class:bg-card={$dripperId !== dripper.id}
      class:shadow-card={$dripperId === dripper.id}
      class:hover:border-rust={$dripperId !== dripper.id}
      onclick={() => handleClick(dripper.id)}
      aria-pressed={$dripperId === dripper.id}
    >
      <p class="font-serif text-lg font-semibold text-ink leading-tight">
        {dripper.name}
      </p>
      <p class="mt-1 font-sans text-xs text-ink-soft">
        {dripper.shape} · {dripper.flow}
      </p>
    </button>
  {/each}
</div>
