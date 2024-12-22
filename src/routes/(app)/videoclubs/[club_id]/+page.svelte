<script lang="ts">
  import { Input } from '$lib/components/ui/input/index';
  import { debounce } from '$lib/components/utils.svelte.js';
  import AddVideoDialog from '$lib/components/video-club/add-video-dialog.svelte';
  import VideoDrawer from '$lib/components/video/VideoDrawer.svelte';
  import dayjs from 'dayjs';
  import { sum } from 'radash';
  import { queryParameters } from 'sveltekit-search-params';

  const params = queryParameters();

  let { data } = $props();

  const search = debounce((value?: string) => {
    $params.title = value;
  }, 300);
</script>

<svelte:head>
  <title>{data.videoClub.data?.name}</title>
  <meta name="videoclub" content="NAF Series" />
</svelte:head>

<div class="flex h-full flex-col gap-12 px-8 align-middle">
  <div class="flex w-full flex-row items-center justify-center gap-4 pt-8">
    <div class="flex items-center gap-8">
      <h1 class="text-4xl font-bold">{data.videoClub.data?.name}</h1>
      <AddVideoDialog videoClubId={data.videoClub.data?.id || ''} />
    </div>
  </div>
  <Input oninput={(e) => search((e.target as HTMLInputElement).value)} />
  <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.videoClub.data?.videos ?? [] as video (video.id)}
      <VideoDrawer {video} videoClubId={data.videoClub.data?.id || ''}>
        <div
          class="flex w-full animate-fade flex-col items-start justify-center gap-2 rounded-sm border-[3px] border-transparent transition-all hover:border-primary"
        >
          <div class="relative rounded-sm">
            <img
              class="w-[600px] rounded-sm"
              width="600"
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
              class=" absolute bottom-0 flex w-full justify-start bg-black/70 p-2 text-left font-bold"
            >
              <div>
                <div class="font-timeburner">
                  {video.title}
                </div>
                <div class="text-sm font-light text-red-500">
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
