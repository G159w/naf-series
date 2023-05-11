<script lang="ts">
	import type { PageData } from './$types';
	import MovieCard from '$lib/components/VideoClub/VideoCard.svelte';
	import SearchMovie from '$lib/components/VideoClub/SearchVideo.svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import MoreButton from '$lib/components/VideoClub/MoreButton.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.videoClub.name}</title>
	<meta name="videoclub" content="NAF Series" />
</svelte:head>

<div class="flex flex-col gap-12 align-middle h-full">
	<div class="w-full gap-4 flex flex-row items-center justify-center">
		<h1 class=" font-bold text-primary-500">{data.videoClub.name}</h1>
	</div>

	<div class="flex gap-2 w-full justify-center">
		<SearchMovie genres={data.genres} />
	</div>
	{#if data.videos.length === 0}
		<h3 class="flex w-full justify-center h-full items-center">
			Aucun films ou séries trouvés :(
		</h3>
	{:else}
		<div
			class="grid gap-4 justify-center column grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:px-32 xl:grid-cols-3 3xl:grid-cols-4 w-full self-center"
		>
			{#each data.videos as video, i (video.id)}
				<div in:fade={{ delay: i * 25 }} class="first-of-type:row-span-2">
					<MovieCard size={i === 0 ? 'big' : 'small'} {video} />
				</div>
			{/each}
		</div>
	{/if}
	{#if data.session}
		<div
			in:scale={{ delay: 50, duration: 600, easing: quintOut }}
			class="fixed bottom-8 right-16 z-[1]"
		>
			<MoreButton videoClub={data.videoClub} />
		</div>
	{/if}
</div>
