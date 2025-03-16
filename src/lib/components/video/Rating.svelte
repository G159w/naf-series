<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import { queryHandler } from '$lib/tanstack-query';
  import { type GetVideoDetailResponse } from '$lib/tanstack-query/videos';
  import { createMutation } from '@tanstack/svelte-query';
  import { Star, Trash } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  import { Button } from '../ui/button';
  import { Slider } from '../ui/slider';
  import { debounce, userState } from '../utils.svelte';

  interface Props {
    onUpdated?: () => void;
    video: NonNullable<GetVideoDetailResponse>;
    videoClubId: string;
  }

  let { onUpdated, video, videoClubId }: HTMLAttributes<HTMLDivElement> & Props = $props();

  const userRating = $derived(video.ratings.find((r) => r.user.id === userState.session?.user?.id));

  const deleteCommentMutation = createMutation({
    mutationFn: queryHandler({ fetch }).videos.deleteRating().mutationFn,
    onSuccess: () => {
      onUpdated?.();
      toast.success('🗑️ Note supprimée');
    }
  });

  const postCommentMutation = createMutation({
    mutationFn: queryHandler({ fetch }).videos.createRating().mutationFn,
    onSuccess: () => {
      onUpdated?.();
      toast.success('✅ Note ajoutée');
    }
  });

  const editCommentMutation = createMutation({
    mutationFn: queryHandler({ fetch }).videos.updateRating().mutationFn,
    onSuccess: () => {
      onUpdated?.();
      toast.success('✅ Note modifiée');
    }
  });

  const submitComment = (rating?: number) => {
    if (rating === undefined && userRating) {
      return $deleteCommentMutation.mutate({
        ratingId: userRating.id,
        videoClubId,
        videoId: video.id
      });
    }
    if (userRating && rating !== undefined) {
      return $editCommentMutation.mutate({
        rating: rating,
        ratingId: userRating.id,
        videoClubId,
        videoId: video.id
      });
    }
    if (rating !== undefined)
      $postCommentMutation.mutate({
        rating: rating,
        videoClubId,
        videoId: video.id
      });
  };

  const debounceFn = debounce((rating?: number) => submitComment(rating), 300);

  // svelte-ignore state_referenced_locally
  let rating = $state(userRating ? [userRating.note] : []);
</script>

<div class="flex flex-row items-center gap-2">
  <Slider
    type="multiple"
    bind:value={rating}
    min={0}
    max={10}
    step={1}
    onValueChange={(value) => debounceFn(value[0])}
  />
  <div class="flex gap-2">
    <span>{rating.length ? rating : '-'}</span>
    <Star size="24" fill="yellow" strokeWidth={0} />
  </div>
  <Button
    variant="ghost"
    disabled={rating.length === 0}
    onclick={() => {
      rating = [];
      submitComment(undefined);
    }}
  >
    <Trash size="24" class="text-destructive" />
  </Button>
</div>
