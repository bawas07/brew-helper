<script>
  /**
   * Brew journal showing saved brews with load/delete actions
   */
  import { mode, setDripper, setRecipe, setDose, toggleMode } from '$lib/stores/brew';
  import { loadJournal, deleteJournalEntry, fmtDate } from '$lib/storage';

  let entries = $state(loadJournal());

  /**
   * @param {{id: number, dripperId: string, dripperName: string, recipeId: string, recipeName: string, dose: number, mode: 'hot' | 'iced', ratio: number, ts: string}} entry
   */
  function handleLoad(entry) {
    toggleMode(entry.mode);
    setDripper(entry.dripperId);
    setRecipe(entry.recipeId);
    setDose(entry.dose);
  }

  /**
   * @param {number} id
   */
  function handleDelete(id) {
    entries = deleteJournalEntry(id);
  }

  function refreshEntries() {
    entries = loadJournal();
  }
</script>

<div class="bg-card border border-line rounded-lg shadow-card p-5">
  <h3 class="font-serif text-xl font-semibold text-ink mb-4">Brew Journal</h3>

  {#if entries.length === 0}
    <!-- Empty state -->
    <div class="border-2 border-dashed border-line rounded-lg p-8 text-center">
      <p class="font-sans text-sm text-ink-faint">
        No saved brews yet. Start brewing and save your first cup!
      </p>
    </div>
  {:else}
    <!-- Journal entries -->
    <ul class="space-y-3">
      {#each entries as entry (entry.id)}
        <li class="flex items-start justify-between gap-3 p-3 rounded-lg border border-line hover:border-rust transition-colors">
          <div class="flex-1 min-w-0">
            <p class="font-serif text-base font-semibold text-ink leading-tight">
              {entry.recipeName}
            </p>
            <p class="mt-1 font-sans text-xs text-ink-soft">
              {entry.dripperName} · {entry.dose}g · {entry.mode}
            </p>
            <p class="mt-1 font-sans text-xs text-ink-faint">
              {fmtDate(entry.ts)}
            </p>
          </div>

          <div class="flex gap-2 flex-shrink-0">
            <button
              class="px-3 py-1 bg-rust text-white font-sans text-xs font-medium rounded hover:bg-rust-ink transition-colors"
              onclick={() => handleLoad(entry)}
            >
              Load
            </button>
            <button
              class="px-3 py-1 bg-card border border-line text-ink-soft font-sans text-xs font-medium rounded hover:border-rust hover:text-rust transition-colors"
              onclick={() => handleDelete(entry.id)}
            >
              Delete
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
