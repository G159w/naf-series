<script lang="ts">
	import type { PageData } from './$types';
	import AddMovie from '$lib/components/VideoClub/AddVideo/AddVideoButton.svelte';
	import MovieCard from '$lib/components/VideoClub/VideoCard.svelte';
	import SearchMovie from '$lib/components/VideoClub/SearchVideo.svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data: PageData;
</script>

<div class="flex flex-col gap-12 align-middle h-full">
	{#if data.session}
		Vous allez être redirigé vers le VideoClub
	{:else}
		Vous devez vous connecter afin d'accepter l'invitation
	{/if}
</div>
