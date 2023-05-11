<script lang="ts">
	import { page } from '$app/stores';
	import { Trash, User as UserIcon } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import type { Video, Comment, User } from '@prisma/client';
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { format } from 'date-fns';
	import { invalidateAll } from '$app/navigation';

	let comment: string = '';
	export let video: Video & {
		comments: (Comment & {
			user: User;
		})[];
	};

	async function deleteComment(commentId: string) {
		if (!video) return;
		const response = await fetch(
			`/videoclubs/${$page.params.club_id}/videos/${video.id}/comments/${commentId}`,
			{
				method: 'DELETE'
			}
		);

		const result = deserialize(await response.text());
		await invalidateAll();
		applyAction(result);
	}
</script>

<div class="flex flex-col gap-4">
	<span class="font-bold"> Commentaires ({video.comments.length}) : </span>
	<div class="flex flex-col flex-wrap gap-8 mt-2">
		{#each video.comments as comment, i}
			<div
				transition:slide={{ duration: 200 }}
				class=" bg-surface-700 p-4 flex flex-col gap-4 rounded-2xl"
			>
				<div class="flex justify-between items-center">
					<div class="flex flex-row gap-2 align-middle items-center">
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
