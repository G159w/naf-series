<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { Search } from 'lucide-svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import { isMovie, type DBMovieMovies, type DBMovieSeries } from '$lib/types';
	import { fade, scale } from 'svelte/transition';
	import VideoSuggestion from './VideoSuggestion.svelte';

	let movies = new Array<DBMovieMovies>();
	let series = new Array<DBMovieSeries>();
	let selectedMovieDBVideo: DBMovieMovies | DBMovieSeries | undefined;
</script>

<div
	class="shadow-xl w-modal h-fit  min-h-[520px] p-8 rounded-3xl bg-surface-active-token flex flex-col gap-8 align-middle w-full justify-between"
>
	<form
		class="flex w-full justify-center"
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'error') {
					await applyAction(result);
				} else {
					selectedMovieDBVideo = undefined;
					movies = result.data.movies;
					series = result.data.series;
				}
			};
		}}
		action="?/fetchMovieDB"
	>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] w-fit h-12">
			<input
				name="searchedVideo"
				class="w-[250px]"
				type="search"
				autocomplete="off"
				placeholder="Search on movie database..."
			/>
			<button class="variant-filled-primary"><Search /></button>
		</div>
	</form>
	<div class="flex flex-row gap-4">
		{#if movies.length > 0}
			<div class="flex flex-col gap-4 ali w-full">
				<h3 in:fade>Films</h3>
				<div class="flex flex-row gap-4 flex-wrap w-full">
					{#each movies as video, i (video.id)}
						<div in:scale={{ delay: i * 25 }} class="w-full">
							<VideoSuggestion
								{video}
								onClick={() => (selectedMovieDBVideo = video)}
								isSelected={video === selectedMovieDBVideo}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}
		{#if series.length > 0}
			<div class="flex flex-col gap-4 ali w-full">
				<h3>Séries</h3>
				<div class="flex flex-row gap-4 flex-wrap w-full">
					{#each series as video, i (video.id)}
						<div in:scale={{ delay: i * 25 }} class="w-full">
							<VideoSuggestion
								{video}
								onClick={() => (selectedMovieDBVideo = video)}
								isSelected={video === selectedMovieDBVideo}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	{#if selectedMovieDBVideo}
		<div in:fade class="w-full flex ">
			<form
				class="flex w-full justify-end"
				method="POST"
				use:enhance={({ data }) => {
					if (!selectedMovieDBVideo) return;
					data.append('type', isMovie(selectedMovieDBVideo) ? 'movie' : 'series');
					data.append('movieDbId', selectedMovieDBVideo.id.toString());
					modalStore.close();
				}}
				action="?/addMovieDbVideo"
			>
				<button class="btn variant-filled-primary ">Valider</button>
			</form>
		</div>
	{:else}
		<div class="h-[42px]" />
	{/if}
</div>
