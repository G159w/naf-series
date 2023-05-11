<script lang="ts">
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import CreateVideoClub from '$lib/components/CreateVideoClub.svelte';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Trash } from 'lucide-svelte';
	import DeleteVideoClub from '$lib/components/DeleteVideoClub.svelte';
	import type { VideoClub } from '@prisma/client';

	export let data: PageData;

	const createModalComponent: ModalComponent = {
		ref: CreateVideoClub
	};

	const deleteModal = (videoClub: VideoClub): ModalSettings => {
		const deleteModalComponent: ModalComponent = {
			ref: DeleteVideoClub,
			props: { videoClub: videoClub }
		};

		return {
			type: 'component',
			component: deleteModalComponent
		};
	};

	const createModal: ModalSettings = {
		type: 'component',
		component: createModalComponent
	};
</script>

<svelte:head>
	<title>NAF Series</title>
	<meta name="home" content="NAF Series" />
</svelte:head>

<div
	in:scale={{ delay: 50, duration: 600, easing: quintOut }}
	class="flex flex-col gap-16 align-middle w-full items-center h-full content-center justify-center"
>
	<img alt="NafSeries" src="nafseries.gif" class=" w-96" />

	{#if data.session}
		{#if data.videoClubs.length > 0}
			<div class="flex flex-col gap-4 w-96">
				{#each data.videoClubs as videoClub}
					<div class="flex flex-row">
						<a
							class="!no-underline !text-white bg-surface-500 font-bold hover:bg-primary-500/20 p-4 rounded-xl cursor-pointer active:bg-primary-500/90 shadow-lg w-full"
							href={`/videoclubs/${videoClub.id}`}
						>
							{videoClub.name}
						</a>
						<button
							class="btn btn-icon"
							on:click={() => modalStore.trigger(deleteModal(videoClub))}
						>
							<Trash class="text-primary-500" size="18" />
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<h4>Vous n'avez pas de VideoCLub</h4>
		{/if}
		<button class="btn variant-filled-primary" on:click={() => modalStore.trigger(createModal)}>
			Créer un nouveau VideoClub
		</button>
	{:else}
		<h3>Visitez vos <b class="text-primary-500">VideoClubs</b> en ligne avec vos amis</h3>
		<button class="btn variant-filled-primary" on:click={() => signIn('google')}
			>Se connecter</button
		>
	{/if}
</div>
