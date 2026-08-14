<script>
  /**
   * Recipe dropdown with grouped options and rationale display
   */
  import { recipeId, availableRecipes, setRecipe } from '$lib/stores/brew';

  /**
   * @param {Event} event
   */
  function handleChange(event) {
    const target = event.target;
    if (!target) return;
    setRecipe(/** @type {HTMLSelectElement} */ (target).value);
  }

  let currentRecipeEntry = $derived($availableRecipes.find((r) => r.recipe.id === $recipeId));
</script>

<div class="bg-card border border-line rounded-lg shadow-card p-5 space-y-4">
  <div>
    <label class="block font-sans text-sm font-medium text-ink-soft mb-2" for="recipe-select">
      Recipe
    </label>
    <select
      id="recipe-select"
      class="w-full font-sans text-base text-ink bg-white border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rust"
      value={$recipeId}
      onchange={handleChange}
    >
      {#each $availableRecipes as entry}
        <option value={entry.recipe.id}>
          {entry.recipe.name} — {entry.badgeText}
        </option>
      {/each}
    </select>
  </div>

  {#if currentRecipeEntry}
    <div class="space-y-2">
      <p class="font-sans text-sm text-ink-soft italic">
        {currentRecipeEntry.recipe.rationale}
      </p>
      <p class="font-sans text-xs text-ink-faint">
        — {currentRecipeEntry.recipe.attribution}
      </p>
    </div>
  {/if}
</div>
