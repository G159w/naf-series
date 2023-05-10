<script lang="ts">
	import { Glasses, Plus, UserPlus } from 'lucide-svelte';
	import { page } from '$app/stores';
	import type { VideoClub } from '@prisma/client';
	import AddVideoButton from './AddVideoButton.svelte';
	import FabButton from './common/FabButton.svelte';

	let displayMoreIcons = false;

	let clipCopy = (clip: string) => {
		navigator.clipboard.writeText(clip);
	};

	export let videoClub: VideoClub;
</script>

<div
	class="flex flex-col gap-4 z-[1] pr-2 pl-8 pt-4 justify-end content-end items-end flex-wrap"
	on:mouseleave={async () => {
		displayMoreIcons = false;
	}}
>
	{#if displayMoreIcons}
		<FabButton
			on:click={() => clipCopy(`https://${$page.url.host}/videoclub/${videoClub.inviteId}/invite`)}
		>
			<span slot="description"> Lien d'invitation </span>
			<span slot="icon">
				<UserPlus />
			</span>
		</FabButton>

		<FabButton
			on:click={() => clipCopy(`https://${$page.url.host}/videoclub/${videoClub.watchId}/watch`)}
		>
			<span slot="description"> Lien visiteur </span>
			<span slot="icon">
				<Glasses />
			</span>
		</FabButton>

		<AddVideoButton />
	{/if}
	<button
		class={`btn-icon p-0 variant-filled-primary btn-icon-lg ${
			displayMoreIcons ? 'rotate-[135deg]' : 'rotate-0'
		}`}
		on:click={() => (displayMoreIcons = !displayMoreIcons)}
	>
		<span><Plus class="w-5" /></span>
	</button>
</div>
