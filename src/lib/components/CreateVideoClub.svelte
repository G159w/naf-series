<script lang="ts">
	export let parent: any;
	import { modalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import lottie from 'lottie-web';
	import movieTheater from '$lib/assets/lottie/movie_theater.json';

	let animationContainer: HTMLElement;

	onMount(() => {
		lottie.loadAnimation({
			container: animationContainer,
			animationData: movieTheater,
			loop: true,
			autoplay: true,
		});
	});
</script>

{#if $modalStore[0]}
	<form method="POST" class="modal-example-form card p-8 w-modal shadow-xl flex flex-col gap-8">
		<div class="flex flex-row items-center gap-2">
			<div class="w-24" bind:this={animationContainer} />
			<header class="text-2xl font-bold h-fit">Nouveau VideoClub</header>
		</div>

		<input
			class="input h-fit"
			type="text"
			autocomplete="off"
			name="name"
			placeholder="Entrez le nom de votre VideoClub..."
		/>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" type="button"  on:click={parent.onClose}>Annuler</button>
				<button class="btn variant-filled-primary" formaction="?/createVideoClub">Valider</button>
    </footer>
	</form>
{/if}
