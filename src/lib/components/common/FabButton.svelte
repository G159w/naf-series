<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	import { fade, scale, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let showDesc: boolean = false;
	export let clipboardContent: string | undefined = undefined;
</script>


<button
	use:clipboard={clipboardContent}
	on:click
	transition:scale={{ delay: 0, duration: 300, easing: quintOut }}
	on:mouseenter={() => (showDesc = true)}
	on:mouseleave={() => (showDesc = false)}
	class={`btn p-0 variant-filled-primary h-14 gap-2 rounded-full flex flex-row justify-end pr-4  ${
		showDesc ? 'w-full' : 'w-14'
	}`}
>
	{#if showDesc}
		<span class="line-clamp-1 pl-6">
			<slot name="description" />
		</span>
	{/if}
	<span>
		<slot name="icon" />
	</span>
</button>
