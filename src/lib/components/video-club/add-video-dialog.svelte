<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import * as Dialog from '$lib/components/ui/dialog/index';
  import * as Tabs from '$lib/components/ui/tabs/index';
  import { queryHandler } from '$lib/tanstack-query';
  import { cn } from '$lib/utils/ui';
  import { createMutation, createQuery } from '@tanstack/svelte-query';
  import { Plus } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  import { Button, buttonVariants } from '../ui/button';
  import { Input } from '../ui/input';

  let search = $state('');
  let open = $state(false);
  let selectedVideoMovieDbId = $state<null | string>(null);
  let selectedType = $state<'movies' | 'series'>('movies');

  interface Props {
    videoClubId: string;
  }

  let { videoClubId }: HTMLAttributes<HTMLDivElement> & Props = $props();

  let queryFn = $derived(() => {
    return queryHandler({ fetch }).videos.searchVideos({ query: search, videoClubId });
  });

  const query = createQuery({
    enabled: false,
    queryFn: async () =>
      queryHandler({ fetch })
        .videos.searchVideos({ query: (() => search)(), videoClubId })
        .queryFn(),

    queryKey: queryFn().queryKey
  });

  const addVideoMutation = createMutation({
    mutationFn: queryHandler({ fetch }).videos.addVideo().mutationFn,
    onSuccess: () => {
      open = false;
      toast.success('✅ Vidéo ajoutée');
    }
  });

  const addVideo = () => {
    if (!selectedVideoMovieDbId) return;
    $addVideoMutation.mutate({
      movieDbId: selectedVideoMovieDbId,
      type: selectedType === 'movies' ? 'movie' : 'tv',
      videoClubId
    });
  };
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants({ variant: 'ghost' })} onclick={() => (open = true)}>
    <Plus width="16" />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Ajouter un film / une série à votre vidéo club</Dialog.Title>
    </Dialog.Header>
    <form
      onsubmit={() => {
        $query.refetch();
      }}
    >
      <Input class="mt-4" placeholder="Nom du film" bind:value={search} type="text" />
    </form>
    {#await $query.data then data}
      {#if data?.data}
        <Tabs.Root value="movies" class="h-[350px]">
          <Tabs.List class="w-full">
            <Tabs.Trigger value="movies" onclick={() => (selectedType = 'movies')} class="w-full">
              Films
            </Tabs.Trigger>
            <Tabs.Trigger value="series" class="w-full" onclick={() => (selectedType = 'series')}>
              Series
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="movies">
            <div class="flex flex-col pt-2">
              {#each data.data.movies as video (video.id)}
                <Button
                  variant="ghost"
                  class={cn('flex h-14 items-center justify-start gap-2 px-0', {
                    'bg-accent text-accent-foreground': selectedVideoMovieDbId === String(video.id)
                  })}
                  onclick={() => (selectedVideoMovieDbId = String(video.id))}
                >
                  <div>
                    <img
                      class="h-14 w-[38px]"
                      src={`https://image.tmdb.org/t/p/w500${video.poster_path}`}
                      alt={''}
                    />
                  </div>
                  <div class="flex flex-col items-start justify-start">
                    <div class="line-clamp-1 text-sm font-bold">{video.title}</div>
                    <div class="text-xs font-thin">{video.release_date}</div>
                  </div>
                </Button>
              {/each}
            </div>
          </Tabs.Content>
          <Tabs.Content value="series">
            <div class="flex flex-col pt-2">
              {#each data.data.series as video (video.id)}
                <Button
                  variant="ghost"
                  class={cn('flex h-14 items-center justify-start gap-2 px-0', {
                    'bg-accent text-accent-foreground': selectedVideoMovieDbId === String(video.id)
                  })}
                  onclick={() => (selectedVideoMovieDbId = String(video.id))}
                >
                  <img
                    class="h-14 w-[38px]"
                    src={`https://image.tmdb.org/t/p/w500${video.poster_path}`}
                    alt={video.name}
                  />
                  <div class="flex flex-col items-start justify-start">
                    <div class="line-clamp-1 text-sm font-bold">{video.name}</div>
                    <div class="text-xs font-thin">{video.first_air_date}</div>
                  </div>
                </Button>
              {/each}
            </div>
          </Tabs.Content>
        </Tabs.Root>
        <div class="flex justify-end">
          <Button disabled={!selectedVideoMovieDbId} onclick={() => addVideo()}>Ajouter</Button>
        </div>
      {/if}
    {/await}
  </Dialog.Content>
</Dialog.Root>

<style scoped>
  .broken-image {
    background-color: #f3f4f6;
  }
</style>
