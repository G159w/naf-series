<script lang="ts">
	import { User } from 'lucide-svelte';
	import { scale } from 'svelte/transition';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import type { Personality, Video, Role } from '@prisma/client';

	export let video: Video & {
		characters: (Role & {
			actor: Personality;
		})[];
	};
</script>

<div class="overflow-auto overflow-y-hidden pb-4">
	<span class="font-bold"> Rôles : </span>
	<div class="grid gap-4 grid-cols-9 w-[100rem] pt-2">
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
					<User class="w-full rounded-t-2xl  h-[142px] bg-surface-100 text-surface-700" />
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
