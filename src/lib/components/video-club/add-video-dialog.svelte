<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import * as Dialog from '$lib/components/ui/dialog/index';
  import * as Tabs from '$lib/components/ui/tabs/index';
  import { queryHandler } from '$lib/tanstack-query';
  import { cn } from '$lib/utils/ui';
  import { createMutation } from '@tanstack/svelte-query';
  import { Plus } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { derived, writable } from 'svelte/store';

  import { Button, buttonVariants } from '../ui/button';
  import { Input } from '../ui/input';

  let search = writable('');
  let open = $state(false);
  let selectedVideoMovieDbId = $state<null | string>(null);
  let selectedType = $state<'movies' | 'series'>('movies');

  interface Props {
    videoClubId: string;
  }

  let { videoClubId }: HTMLAttributes<HTMLDivElement> & Props = $props();

  let queryOptions = derived(search, () => {
    return queryHandler({ fetch }).videos.searchVideos({ query: $search, videoClubId });
  });

  const searchMutation = createMutation(
    derived(queryOptions, () => ({
      mutationFn: $queryOptions.queryFn,
      mutationKey: $queryOptions.queryKey
    }))
  );

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
        $searchMutation.mutate();
      }}
    >
      <Input class="mt-4" placeholder="Nom du film" bind:value={$search} type="text" />
    </form>
    {#if $searchMutation.isPending}
      <div class="flex h-[350px] items-center justify-center">
        <p class="text-sm font-thin">Recherche en cours...</p>
      </div>
    {/if}
    {#if $searchMutation.isError}
      <div class="flex h-[350px] items-center justify-center">
        <p class="text-sm font-thin">Erreur lors de la recherche</p>
      </div>
    {/if}
    {#if $searchMutation.isSuccess && $searchMutation.data.data}
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
            {#each $searchMutation.data.data.movies as video (video.id)}
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
                    alt=""
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
            {#each $searchMutation.data.data.series as video (video.id)}
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
        <Button
          onclick={() => addVideo()}
          disabled={$addVideoMutation.isPending || !selectedVideoMovieDbId}
        >
          {$addVideoMutation.isPending ? 'Ajout ...' : 'Ajouter'}
        </Button>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<style scoped>
</style>
