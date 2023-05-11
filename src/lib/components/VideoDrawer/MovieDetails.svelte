<script lang="ts">
	import { page } from '$app/stores';
	import { Star } from 'lucide-svelte';
	import { fade, scale, slide } from 'svelte/transition';
	import { drawerStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { Personality, Video, Genre, Rating, User } from '@prisma/client';
	import { applyAction, deserialize } from '$app/forms';
	import { format } from 'date-fns';
	import { invalidateAll } from '$app/navigation';
	import StarRating from './StarRating/StarRating.svelte';

	export let video: Video & {
		ratings: (Rating & {
			user: User;
		})[];
		creators: Personality[];
		genres: Genre[];
		userAvg: number | null;
	};

	async function handleRating(num: number) {
		if (!video) return;
		const response = await fetch(`/videos/${video.id}/ratings`, {
			method: 'POST',
			body: JSON.stringify({ note: num * 2 })
		});

		const result = deserialize(await response.text());
		if (result) {
			await invalidateAll();
		}
		applyAction(result);
	}

	$: myRating = video?.ratings.find(
		(rating) => rating.user.email === $page.data.session?.user?.email
	);

	async function deleteRating(ratingId: string) {
		if (!video) return;
		const response = await fetch(`/videos/${video.id}/ratings/${ratingId}`, {
			method: 'DELETE'
		});

		const result = deserialize(await response.text());
		await invalidateAll();
		applyAction(result);
	}

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'bottom'
	};
</script>

<div class="card p-4 variant-filled-surface" data-popup="popupHover">
	<ul class="list">
		{#each video.ratings as rating}
			<li>
				<span
					class="w-8 h-8 bg-surface-700 rounded-full text-center flex items-center justify-center"
					>{rating.note}</span
				>
				<span class="flex-auto">{rating.user.name}</span>
			</li>
			<hr class="last:hidden" />
		{/each}

		<!-- ... -->
	</ul>
</div>

<div class=" flex flex-row gap-8">
	<div class="">
		<img
			in:fade={{ delay: 100 }}
			alt="movie"
			class="w-[300px] max-w-[300px] rounded-3xl"
			src={'https://image.tmdb.org/t/p/w500' + video.posterPath}
		/>
	</div>
	<div class="flex flex-col gap-8 w-full">
		<h1 in:fade={{ delay: 100 }} class=" font-bold">{video.title}</h1>
		<div class="flex flex-row content-between justify-between items-center align-middle mt-[-1rem]">
			<div class="flex flex-col gap-3">
				<h4 in:scale={{ delay: 125 }} class="text-red-600 font-bold">
					{format(video.releaseDate, 'dd/MM/yyyy')}
				</h4>
				{#if $page.data.session}
					<div class="flex flex-col items-center">
						<StarRating rating={myRating ? myRating.note / 2 : undefined} onRate={handleRating} />
						{#if myRating}
							<div
								on:keypress
								transition:slide={{ duration: 200 }}
								on:click={() => deleteRating(myRating?.id || '')}
								class=" text-xs text-primary-500 underline cursor-pointer"
							>
								Supprimer ma note
							</div>
						{/if}
					</div>
				{/if}
			</div>
			<div class="flex flex-row gap-8">
				<div
					class="self-end w-fit z-[1] flex flex-col gap-1 content-center align-middle justify-center items-center p-2"
				>
					<div class="text-sm font-bold">Avis des délus</div>
					<div
						class="flex gap-2 align-middle items-center w-[5rem] justify-center pl-3 pr-2 z-[1] rounded-3xl font-bold shadow-2xl text-sm text-blue-600 bg-white border-2 border-blue-600"
					>
						{video.voteAverage.toFixed(2)}
						<Star fill="blue" color="blue" size="12" />
					</div>
					<div class="text-xs italic">
						votes : {video.voteCount}
					</div>
				</div>
				{#if video.userAvg}
					<button
						use:popup={popupHover}
						class="self-end w-fit z-[2] flex flex-col gap-1 content-center align-middle justify-center items-center shadow-md card-hover bg-surface-700 rounded-xl p-2 [&>*]:pointer-events-none"
					>
						<div class="text-sm font-bold">Vos avis</div>
						<div
							class="flex gap-2 align-middle items-center w-[5rem] justify-center pl-3 pr-2 rounded-3xl font-bold shadow-2xl text-sm text-primary-600 bg-white border-2 border-primary-600"
						>
							{video.userAvg.toFixed(2)}
							<Star fill="red" color="red" size="12" />
						</div>
						<div class="text-xs italic">
							votes : {video.ratings.length}
						</div>
					</button>
				{/if}
			</div>
		</div>
		{#if video.tagline}
			<p in:fade={{ delay: 150 }} class="font-bold italic">
				"{video.tagline}"
			</p>
		{/if}
		<p in:fade={{ delay: 200 }} class=" font-light">
			{video.overview}
		</p>
		{#if video.genres.length}
			<div class="flex flex-row gap-2" in:fade={{ delay: 250 }}>
				<span class="font-bold"> Genres : </span>
				{#each video.genres as genre}
					<a href={`/?genre=${genre.id}`} on:click={drawerStore.close}>
						{genre.name}
					</a>
				{/each}
			</div>
		{/if}
		{#if video.creators.length}
			<div class="flex flex-row gap-2" in:fade={{ delay: 250 }}>
				<span class="font-bold"> Créateurs : </span>
				{#each video.creators as creator}
					<a href={`/?searchType=creators&searchText=${creator.name}`} on:click={drawerStore.close}>
						{creator.name}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
