<script lang="ts">
  import { page } from '$app/state';
  import { page as storePage } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Input } from '$lib/components/ui/input/index';
  import { debounce } from '$lib/components/utils.svelte.js';
  import AddVideoDialog from '$lib/components/video-club/add-video-dialog.svelte';
  import VideoClubDeleteModal from '$lib/components/video-club/video-club-delete-modal.svelte';
  import VideoClubShareModal from '$lib/components/video-club/video-club-share-modal.svelte';
  import VideoDrawer from '$lib/components/video/VideoDrawer.svelte';
  import { queryHandler } from '$lib/tanstack-query/index';
  import { createQuery } from '@tanstack/svelte-query';
  import dayjs from 'dayjs';
  import { MoreVertical, Plus, Share, Trash2 } from 'lucide-svelte';
  import { sum } from 'radash';
  import { derived as storeDerived } from 'svelte/store';
  import { queryParameters } from 'sveltekit-search-params';

  let { data } = $props();

  const params = queryParameters();

  let deleteModalOpen = $state(false);
  let shareModalOpen = $state(false);

  const queryOptions = storeDerived(storePage, () =>
    queryHandler({ fetch }).videoClub.findOne({
      videoClubId: page.params.club_id ?? undefined
    })
  );

  const query = createQuery(
    storeDerived(queryOptions, () => ({
      queryFn: () =>
        $queryOptions.queryFn({
          title: $params.title
        }),
      queryKey: $queryOptions.queryKey
    }))
  );

  const search = debounce((value?: string) => {
    $params.title = value;
  }, 300);

  function openDeleteModal() {
    deleteModalOpen = true;
  }

  function openShareModal() {
    shareModalOpen = true;
  }

  const videoClub = $derived($query.data?.data ?? data.videoClub);
</script>

<svelte:head>
  <title>{videoClub?.name || 'VidéoClub non trouvé'}</title>
  <meta name="videoclub" content="NAF Series" />
</svelte:head>

{#if !videoClub || $query.isLoading}
  <Button variant="ghost" size="icon" onclick={() => $query.refetch({})}>
    <Plus size={16} />
  </Button>
  <div class="flex h-full w-full items-center justify-center">
    <h1 class="text-4xl font-bold">VidéoClub non trouvé</h1>
  </div>
{:else}
  <div class="@container/videos flex h-full flex-col gap-12 px-8 align-middle">
    <div class="flex w-full flex-row items-center justify-center gap-4 pt-8">
      <div class="flex items-end gap-8">
        <h1 class="text-4xl font-bold">{videoClub.name}</h1>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size="icon">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {#if videoClub.inviteId}
              <DropdownMenu.Item onclick={openShareModal}>
                <Share size={16} class="mr-2" />
                <span>Inviter</span>
              </DropdownMenu.Item>
            {/if}
            <DropdownMenu.Separator />
            <DropdownMenu.Item onclick={openDeleteModal} class="text-destructive">
              <Trash2 size={16} class="mr-2" />
              <span>Supprimer</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
    <Input
      oninput={(e) => search((e.target as HTMLInputElement).value)}
      placeholder="Rechercher..."
    />
    <div
      class="@lg/videos:grid-cols-2 @4xl/videos:grid-cols-3 @7xl/videos:grid-cols-4 grid grid-cols-1 items-center justify-center gap-8"
    >
      <div class="flex w-full animate-fade flex-col items-center justify-center gap-2">
        <AddVideoDialog
          videoClubId={videoClub.id}
          class="aspect-video h-full w-full max-w-[400px] items-center justify-center rounded-sm border-[3px] border-transparent bg-white/5 transition-all hover:border-primary"
        >
          <Button
            variant="ghost"
            class="relative flex h-full w-full items-center justify-center p-0 [&_svg]:size-16"
          >
            <Plus class="text-primary " />
          </Button>
        </AddVideoDialog>
      </div>
      {#each videoClub.videos as video (video.id)}
        <VideoDrawer {video} videoClubId={videoClub.id || ''}>
          <div class="flex w-full animate-fade flex-col items-center justify-center gap-2">
            <div
              class="relative rounded-sm border-[3px] border-transparent transition-all hover:border-primary"
            >
              <img
                class="w-[400px] rounded-sm"
                width="400"
                src={`https://image.tmdb.org/t/p/w500${video.backdropPath}`}
                alt={video.title}
              />
              <div class="absolute top-0 flex w-full justify-end p-2">
                <div class="flex flex-col gap-2 text-xs">
                  <div
                    class="flex items-center justify-center rounded-sm border-2 border-blue-600 bg-black px-2"
                  >
                    {video.voteAverage.toFixed(2)}
                  </div>
                  {#if video.ratings.length > 0}
                    <div
                      class="flex items-center justify-center rounded-sm border-2 border-red-600 bg-black px-2"
                    >
                      {(sum(video.ratings, (r) => r.note) / video.ratings.length).toFixed(2)}
                    </div>
                  {/if}
                </div>
              </div>
              <h1
                class="absolute bottom-0 flex w-full justify-start bg-black/70 p-2 text-left font-bold"
              >
                <div>
                  <div
                    class="@lg/videos:text-sm @4xl/videos:text-xs @7xl/videos:text-sm line-clamp-1 text-lg"
                  >
                    {video.title}
                  </div>
                  <div
                    class="@lg/videos:text-sm @4xl/videos:text-xs @7xl/videos:text-sm text-sm font-light text-red-500"
                  >
                    {dayjs(video.releaseDate).format('DD/MM/YYYY')}
                  </div>
                </div>
              </h1>
            </div>
          </div>
        </VideoDrawer>
      {/each}
    </div>
    <div class=""></div>
  </div>

  <VideoClubShareModal
    bind:open={shareModalOpen}
    videoClubId={videoClub.id}
    inviteId={videoClub.inviteId}
  />
  <VideoClubDeleteModal
    bind:open={deleteModalOpen}
    videoClubId={videoClub.id}
    videoClubName={videoClub.name}
  />
{/if}
