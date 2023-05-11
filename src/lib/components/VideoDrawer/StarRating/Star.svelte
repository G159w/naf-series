<script lang="ts">
	import { Star } from 'lucide-svelte';

	// use id in the 'half' gradient id to make it unique and avoid same gradient in all 'half' stars
	export let full: number; // from array of Numbers 0-1
	export let fullColor = '#ffcf00';
	export let emptyColor = '#7f7f7f';
	export let onHover: (half: number) => void;
	export let onClick: (half: number) => void;
	// check (and use) user size input
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:focus on:mouseover on:click on:focus on:mouseleave class="relative w-6 h-6">
	<div
		on:mouseover={() => onHover(0)}
		on:click={() => onClick(0)}
		on:focus
		class="absolute top-0 left-0 w-3 h-6 z-[1] "
	/>
	<div
		on:mouseover={() => onHover(0.5)}
		on:click={() => onClick(0.5)}
		on:focus
		class="absolute top-0 left-3 w-3 h-6 z-[1]"
	/>
	<svg
		class=" absolute top-0 left-0"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		viewBox="0 0 24 24"
		height="24"
		style="--width:{24};--height:{24}"
	>
		<!-- if not whole number, create gradient -->
		{#if full !== 1 && full !== 0}
			<defs>
				<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" style="stop-color:{fullColor};stop-opacity:1" />
					<stop offset="{full * 100}%" style="stop-color:{fullColor};stop-opacity:1" />
					<stop offset="{full * 100}%" style="stop-color:{emptyColor};stop-opacity:1" />
				</linearGradient>
			</defs>
		{/if}
		<Star
			fill={full === 1 ? fullColor : full === 0 ? emptyColor : `url(#grad)`}
			color={full === 1 ? fullColor : full === 0 ? emptyColor : `url(#grad)`}
			width="24"
		/>
	</svg>
</div>
