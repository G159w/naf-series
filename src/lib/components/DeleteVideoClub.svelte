<script lang="ts">
	import { enhance } from '$app/forms';
	import type { VideoClub } from '@prisma/client';
	export let parent: any;
	import { modalStore } from '@skeletonlabs/skeleton';

	export let videoClub: VideoClub;
</script>

{#if $modalStore[0]}
	<form
		method="POST"
		use:enhance={({ data }) => {
			data.append('clubId', videoClub.id);
			modalStore.close();
		}}
		class="modal-example-form card p-8 w-modal shadow-xl flex flex-col gap-8"
		action="?/deleteVideClub"
	>
		<div class="flex flex-row items-center gap-2">
			<header class="text-2xl font-bold h-fit">Quitter le VideoClub</header>
		</div>
		<div class=" flex flex-col align-center gap-1">
			<span>Vous allez quitter le VideoClub suivant:</span>
			<span class=" font-bold text-primary-500">{videoClub.name}</span>
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" type="button" on:click={parent.onClose}
				>Annuler</button
			>
			<button class="btn variant-filled-primary">Valider</button>
		</footer>
	</form>
{/if}
