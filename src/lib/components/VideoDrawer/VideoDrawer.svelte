<script lang="ts">
	import { page } from '$app/stores';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import type { Personality, Video, Genre, Rating, Comment, User, Role } from '@prisma/client';
	import Comments from './Comments.svelte';
	import MovieDetails from './MovieDetails.svelte';
	import Characters from './Characters.svelte';

	$: videos = ($page.data.videos || []) as (Video & {
		comments: (Comment & {
			user: User;
		})[];
		ratings: (Rating & {
			user: User;
		})[];
		creators: Personality[];
		characters: (Role & {
			actor: Personality;
		})[];
		genres: Genre[];
		userAvg: number | null;
	})[];

	$: videoId = $drawerStore.meta as string;
	$: video = videos.find((video) => video.id === videoId);
</script>

{#if !video}
	<div><h4>Invalid VIDEO</h4></div>
{:else}
	<div class=" flex flex-col p-8 gap-8">
		<MovieDetails {video} />
		<Characters {video} />
		<Comments {video} />
	</div>
{/if}
