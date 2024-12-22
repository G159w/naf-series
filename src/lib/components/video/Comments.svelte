<script lang="ts">
  import type { GetVideoDetailResponse } from '$lib/tanstack-query/videos';

  import { queryHandler } from '$lib/tanstack-query';
  import { createMutation } from '@tanstack/svelte-query';
  import dayjs from 'dayjs';
  import { Star } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  import { Button } from '../ui/button';
  import Textarea from '../ui/textarea/textarea.svelte';
  import { userState } from '../utils.svelte';

  interface Props {
    onUpdated?: () => void;
    video: NonNullable<GetVideoDetailResponse>;
    videoClubId: string;
  }

  let { onUpdated, video, videoClubId }: Props = $props();

  let addComment = $state(false);
  let commentContent = $state('');

  const deleteCommentMutation = createMutation({
    mutationFn: queryHandler({ fetch }).videos.deleteComment().mutationFn,
    onSuccess: () => {
      onUpdated?.();
      toast.success('🗑️ Commentaire supprimé');
    }
  });

  const postCommentMutation = createMutation({
    mutationFn: queryHandler({ fetch }).videos.postComment().mutationFn,
    onSuccess: () => {
      addComment = false;
      onUpdated?.();
      toast.success('✅ Commentaire ajouté');
    }
  });

  function getUserRating(data: GetVideoDetailResponse | undefined, userId: string) {
    if (!data) return;
    return data.ratings.find((r) => r.user.id === userId)?.note;
  }

  function submitComment(content: string) {
    $postCommentMutation.mutate({ content, videoClubId, videoId: video.id });
  }
</script>

<div
  class="flex animate-fade-right flex-col gap-2 pb-12 animate-normal animate-fill-forwards animate-ease-in-out"
>
  {#each video.comments || [] as comment}
    <div class="my-2 border-b border-gray-800"></div>
    <div class="flex flex-col">
      <div class="flex h-7 items-center gap-3 text-sm font-bold">
        <span class="text-primary">
          {comment.user.name}
        </span>
        {#if !!getUserRating(video, comment.user.id)}
          <span class="mt-[2px] flex flex-row items-start gap-1">
            <span class="text-xs">
              {getUserRating(video, comment.user.id)}
            </span>
            <Star size="16" fill="yellow" strokeWidth={0} />
          </span>
        {/if}
        {#if comment.user.id === userState.session?.user?.id}
          <Button
            variant="ghost"
            size="sm"
            class="text-red-500"
            disabled={$deleteCommentMutation.isPending}
            onclick={() =>
              $deleteCommentMutation.mutate({
                commentId: comment.id,
                videoClubId,
                videoId: video.id
              })}
          >
            Supprimer
          </Button>
        {/if}
      </div>
      <span class="text-xs font-light">
        Le {dayjs(comment.createdAt).format('DD/MM/YYYY')}
      </span>
      <div class="mt-2 text-sm font-medium antialiased">{comment.content}</div>
    </div>
  {/each}
  <div>
    <div class="my-2 border-b border-gray-800"></div>

    {#if addComment}
      <div class="flex flex-col justify-end">
        <Textarea
          class="mb-2 mt-4 w-full"
          placeholder="Ajouter un commentaire"
          bind:value={commentContent}
        />
        <div class="flex w-full justify-end gap-2">
          <Button variant="outline" class="my-2 w-fit" onclick={() => (addComment = false)}>
            Annuler
          </Button>
          <Button
            variant="default"
            class="my-2 w-fit"
            disabled={!commentContent || $postCommentMutation.isPending}
            onclick={() => submitComment(commentContent)}
          >
            Ajouter
          </Button>
        </div>
      </div>
    {:else}
      <Button variant="outline" class="my-2 w-fit" onclick={() => (addComment = true)}>
        Ajouter un commentaire
      </Button>
    {/if}
  </div>
</div>
