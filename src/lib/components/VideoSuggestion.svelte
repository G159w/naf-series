<script lang="ts">
	import { Film } from 'lucide-svelte';
	import { isMovie, type DBMovieMovies, type DBMovieSeries } from '$lib/types';

	export let video: DBMovieMovies | DBMovieSeries;
	export let onClick: () => void;
	export let isSelected: boolean;

	$: name = isMovie(video) ? video.title : video.name;
	$: year = isMovie(video) ? video.release_date : video.first_air_date;
	console.log(video.poster_path);
</script>

<button
	class={` rounded-lg shadow-lg   card-hover border-primary-500 flex flex-row gap-2 w-full h-[75px] ${
		isSelected ? 'bg-primary-500' : 'bg-surface-700'
	} `}
	on:click={onClick}
>
	{#if video.poster_path}
		<img
			alt={name}
			class="h-[75px]  rounded-lg"
			src={'https://image.tmdb.org/t/p/w500' + video.poster_path}
		/>
	{:else}
		<div
			class="w-[50px] h-[75px] flex items-center align-middle justify-center flex-col bg-surface-200 rounded-lg"
		>
			<Film />
		</div>
	{/if}
	<div class="flex flex-col h-[75px] items-start text-left gap-1 p-1 pr-2">
		<div class="font-bold line-clamp-2 leading-tight">
			{name}
		</div>
		{#if year}
			<div class=" font-light">
				{year}
			</div>
		{/if}
	</div>
</button>
