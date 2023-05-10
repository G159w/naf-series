<script lang="ts">
	import { page } from '$app/stores';
	import { Delete, Star, Trash, User as UserIcon } from 'lucide-svelte';
	import { fade, scale, slide } from 'svelte/transition';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import type { Personality, Video, Genre, Rating, Comment, User, Role } from '@prisma/client';
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { format } from 'date-fns';
	import StarRating from './StarRating/StarRating.svelte';
	import { invalidateAll } from '$app/navigation';

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
	let comment: string = '';

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

	async function deleteComment(commentId: string) {
		if (!video) return;
		const response = await fetch(`/videoclubs/${$page.params.club_id}/videos/${video.id}/comments/${commentId}`, {
			method: 'DELETE'
		});

		const result = deserialize(await response.text());
		console.log(result);
		await invalidateAll();
		applyAction(result);
	}

	async function deleteRating(ratingId: string) {
		if (!video) return;
		const response = await fetch(`/videos/${video.id}/ratings/${ratingId}`, {
			method: 'DELETE'
		});

		const result = deserialize(await response.text());
		console.log(result);
		await invalidateAll();
		applyAction(result);
	}
</script>

{#if !video}
	<div><h4>Invalid VIDEO</h4></div>
{:else}
	<div class=" flex flex-col p-8 gap-8">
		<div class=" flex flex-row gap-8">
			<div class="">
				<img
					in:fade={{ delay: 100 }}
					alt="movie"
					class="w-[300px] max-w-[300px] rounded-3xl "
					src={'https://image.tmdb.org/t/p/w500' + video.posterPath}
				/>
			</div>
			<div class="flex flex-col gap-8 w-full">
				<h1 in:fade={{ delay: 100 }} class=" font-bold">{video.title}</h1>
				<div
					class="flex flex-row content-between justify-between items-center align-middle mt-[-1rem]"
				>
					<div class="flex flex-col gap-3">
						<h4 in:scale={{ delay: 125 }} class="text-red-600 font-bold">
							{format(video.releaseDate, 'dd/MM/yyyy')}
						</h4>
						{#if $page.data.session}
							<div class="flex flex-col items-center">
								<StarRating
									rating={myRating ? myRating.note / 2 : undefined}
									onRate={handleRating}
								/>
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
							class="self-end w-fit z-[1] flex flex-col gap-1 content-center align-middle justify-center items-center"
						>
							<div class="text-sm font-bold">Avis des délus</div>
							<div
								class="flex gap-2 align-middle items-center  w-[5rem] justify-center pl-3 pr-2 z-[1] rounded-3xl  font-bold shadow-2xl text-sm text-blue-600 bg-white border-2 border-blue-600"
							>
								{video.voteAverage.toFixed(2)}
								<Star fill="blue" color="blue" size="12" />
							</div>
							<div class="text-xs italic">
								votes : {video.voteCount}
							</div>
						</div>
						{#if video.userAvg}
							<div
								class="self-end w-fit z-[1] flex flex-col gap-1 content-center align-middle justify-center items-center"
							>
								<div class="text-sm font-bold">Avis NAF</div>
								<div
									class="flex gap-2 align-middle items-center w-[5rem] justify-center pl-3 pr-2 z-[1] rounded-3xl font-bold shadow-2xl text-sm  text-primary-600 bg-white border-2 border-primary-600"
								>
									{video.userAvg.toFixed(2)}
									<Star fill="red" color="red" size="12" />
								</div>
								<div class="text-xs italic">
									votes : {video.ratings.length}
								</div>
							</div>
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
							<a
								href={`/?searchType=creators&searchText=${creator.name}`}
								on:click={drawerStore.close}
							>
								{creator.name}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div class="overflow-auto overflow-y-hidden pb-4">
			<span class="font-bold"> Rôles : </span>
			<div class="grid gap-4 grid-cols-9  w-[100rem] pt-2">
				{#each video.characters as char, i}
					<a
						href={`/?searchType=actors&searchText=${char.actor.name}`}
						on:click={drawerStore.close}
						in:scale={{ delay: i * 25 }}
						class=" shadow-md card-hover flex flex-col bg-surface-700 rounded-xl w-36 align-middle items-center !no-underline !text-current"
					>
						{#if char.actor.imgUrl}
							<img
								alt={char.actor.name}
								class="rounded-t-2xl w-full"
								src={'https://image.tmdb.org/t/p/w138_and_h175_face' + char.actor.imgUrl}
							/>
						{:else}
							<UserIcon class="w-full rounded-t-2xl  h-[142px] bg-surface-100 text-surface-700" />
						{/if}
						<span class="px-2 text-center w-full font-light text-900">
							{char.character}
						</span>
						<span class="p-2 text-center w-full font-bold text-900">
							{char.actor.name}
						</span>
					</a>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-4">
			<span class="font-bold"> Commentaires ({video.comments.length}) : </span>
			<div class="flex flex-col flex-wrap  gap-8 mt-2">
				{#each video.comments as comment, i}
					<div
						transition:slide={{ duration: 200 }}
						class=" bg-surface-700 p-4 flex flex-col gap-4 rounded-2xl "
					>
						<div class="flex justify-between items-center">
							<div class="flex flex-row gap-2 align-middle items-center ">
								{#if comment.user?.image}
									<img class="w-10 rounded-full" alt="G img" src={comment.user.image} />
								{:else}
									<UserIcon />
								{/if}
								<div class="flex flex-col">
									<p
										class=" font-bold text-primary-500 flex justify-baseline align-baseline content-baseline"
									>
										{comment.user.name}
									</p>
									<span class=" text-xs italic">
										le {format(comment.createdAt, 'dd/MM/yyyy')}
									</span>
								</div>
							</div>
							<div>
								{#if comment.user.email === $page.data.session?.user?.email}
									<button on:click={() => deleteComment(comment.id)}>
										<Trash size="15" />
									</button>
								{/if}
							</div>
						</div>
						<hr />
						<p class="whitespace-pre-wrap">
							{comment.content}
						</p>
					</div>
				{/each}
			</div>
		</div>
		{#if $page.data.session}
			<hr />
			<form
				transition:slide={{ duration: 200 }}
				class="flex flex-col gap-4 items-end"
				method="post"
				action="?/createComment"
				use:enhance={({ data }) => {
					if (!video) return;
					data.append('videoId', video.id || '');
					return async ({ result }) => {
						if (result.type === 'error') {
							await applyAction(result);
						} else {
							comment = '';
							await invalidateAll();
						}
					};
				}}
			>
				<textarea
					bind:value={comment}
					name="content"
					class="textarea"
					rows="4"
					placeholder="Donnez votre avis."
				/>
				<button class=" btn variant-filled-primary">Envoyer</button>
			</form>
		{/if}
	</div>
{/if}
