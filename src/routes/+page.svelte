<script>
	import Header from '$lib/components/Header.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ServeToggle from '$lib/components/ServeToggle.svelte';
	import DoseInput from '$lib/components/DoseInput.svelte';
	import DripperGrid from '$lib/components/DripperGrid.svelte';
	import RecipeSelect from '$lib/components/RecipeSelect.svelte';
	import RecipePanel from '$lib/components/RecipePanel.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import PourSchedule from '$lib/components/PourSchedule.svelte';
	import BrewModal from '$lib/components/BrewModal.svelte';
	import BrewJournal from '$lib/components/BrewJournal.svelte';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen bg-cream">
	<div class="mx-auto max-w-[1180px] px-6 py-7 pb-20">
		<Header />
		<Hero />

		<div class="grid grid-cols-1 gap-5 md:grid-cols-[340px_1fr]">
			<!-- Left Column: Inputs -->
			<div class="flex flex-col gap-6 rounded-lg border border-line bg-card p-5 shadow-card">
				<ServeToggle />
				<DoseInput />
				<DripperGrid />
				<RecipeSelect />
			</div>

			<!-- Right Column: Output -->
			<div class="flex flex-col gap-5">
				<RecipePanel />
				<Timer />
				<PourSchedule />
				<BrewJournal />
			</div>
		</div>

		<footer class="mt-12 text-center text-xs text-ink-faint">
			Slow Pour · brewed at home · recipes adapted from public brew guides — water &amp; ice
			figures are approximate, trust your taste
		</footer>
	</div>

	<BrewModal />
</div>
