<script lang="ts">
	import { drawerStore } from '@skeletonlabs/skeleton';
	import type { Personality, Video, Comment, Rating, User } from '@prisma/client';
	import { MessageSquare, Star } from 'lucide-svelte';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import { format } from 'date-fns';
	import { page } from '$app/stores';

	export let video: Video & {
		comments: Comment[];
		creators: Personality[];
		actors: Personality[];
		ratings: (Rating & {
			user: User;
		})[];
		userAvg: number | null;
	};
	export let size: 'small' | 'big' = 'small';
	const getDrawerSettings = (): DrawerSettings => ({
		meta: video.id,
		width: 'w-[1200px] ',
		padding: 'p-4',
		rounded: 'rounded-3xl'
	});
	let hovered = false;
	$: hasSeenVideo = !!video?.ratings.find(
		(rating) => rating.user.email === $page.data.session?.user?.email
	);
</script>

<button
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	on:click={() => drawerStore.open(getDrawerSettings())}
	class={`shadow-lg rounded-xl ${
		size === 'small' ? 'h-80' : 'h-full'
	} min-h-[16rem]  w-full text-left relative overflow-hidden [&>*]:pointer-events-none`}
>
	<img
		alt="movie"
		class={` w-full h-full object-cover absolute top-0 img rounded-xl img z-[1] ${
			hovered ? 'scale-110' : ''
		}`}
		src={'https://image.tmdb.org/t/p/w500' +
			(size === 'small' ? video.backdropPath : video.posterPath)}
	/>
	{#if hasSeenVideo}
		<div
			class="absolute top-0 left-0 rotate z-[1] bg-primary-700 w-32 text-center mt-2 ml-[-2rem] pr-2 font-bold h-[18px]"
		>
			<div class="text-xs h-1">VU</div>
		</div>
	{/if}
	<div class="p-4 flex flex-col gap-2 absolute top-0 w-full justify-between content-between h-full">
		<div class="self-end w-fit z-[1] flex flex-col gap-1">
			<span
				class="flex gap-2 align-middle items-center w-[5rem] justify-center pl-3 pr-2 z-[1] rounded-3xl self-end font-bold shadow-2xl text-sm text-blue-600 bg-white border-2 border-blue-600"
			>
				{video.voteAverage.toFixed(2)}
				<Star fill="blue" color="blue" size="12" />
			</span>
			{#if video.userAvg}
				<span
					class="flex gap-2 align-middle items-center w-[5rem] justify-center pl-3 pr-2 z-[1] rounded-3xl self-end font-bold shadow-2xl text-sm text-primary-600 bg-white border-2 border-primary-600"
				>
					{video.userAvg.toFixed(2)}
					<Star fill="red" color="red" size="12" />
				</span>
			{/if}
		</div>
		<div class="flex flex-col align-middle w-full">
			<span class="font-bold line-clamp-1 text-xl z-[2] w-fit">
				{video.title}
			</span>
			<div class="flex flex-row content-between w-full items-center justify-between">
				<span class="text-primary-600 z-[2]">
					{format(video.releaseDate, 'dd/MM/yyyy')}
				</span>
				{#if video.comments.length}
					<span class="flex flex-row items-center gap-2 z-[2]">
						{video.comments.length}
						<MessageSquare size="14" class="mt-[2px]" color="white" fill="white" />
					</span>
				{/if}
			</div>
		</div>
	</div>
</button>

<style>
	.img {
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 20%, transparent 100%);
		transition: transform 0.3s;
	}

	.rotate {
		-webkit-transform: rotate(-35deg);
		-moz-transform: rotate(-35deg);
		-ms-transform: rotate(-35deg);
		-o-transform: rotate(-35deg);
		transform: rotate(-35deg);
	}
</style>
