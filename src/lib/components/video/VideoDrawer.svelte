<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  import * as Drawer from '$lib/components/ui/drawer/index.js';
  import { queryHandler } from '$lib/tanstack-query';
  import { type VideoClubDetailResponse } from '$lib/tanstack-query/video-club';
  import { createQuery } from '@tanstack/svelte-query';
  import dayjs from 'dayjs';
  import { Star, X } from 'lucide-svelte';
  import { sum } from 'radash';

  import { Button } from '../ui/button';
  import Comments from './Comments.svelte';
  import Rating from './Rating.svelte';

  interface Props {
    video: NonNullable<VideoClubDetailResponse>['videos'][0];
    videoClubId: string;
  }

  let { children, video, videoClubId }: HTMLAttributes<HTMLDivElement> & Props = $props();

  let open = $state(false);

  const query = createQuery(
    queryHandler({ fetch }).video.getDetail({ videoClubId, videoId: video.id })
  );
</script>

<Drawer.Root bind:open>
  <Drawer.Trigger>
    {@render children?.()}
  </Drawer.Trigger>
  <Drawer.Content class=" h-[90vh]">
    <div class="select-text overflow-y-scroll">
      <Drawer.Close class="absolute right-5 top-5">
        <Button variant="ghost">
          <X size="24" />
        </Button>
      </Drawer.Close>
      {#await $query.data then data}
        {#if data?.data}
          <div
            class="flex flex-col items-center gap-4 overflow-x-hidden overflow-y-hidden p-4 md:flex-row md:items-stretch"
          >
            <div>
              <img
                class="min-w-[300px] animate-fade-up rounded-sm animate-normal animate-fill-backwards animate-ease-in-out"
                width="300"
                src={`https://image.tmdb.org/t/p/w500${data.data.posterPath}`}
                alt={data.data.title}
              />
            </div>
            <div
              class="flex animate-fade-left flex-col justify-between gap-2 animate-normal animate-ease-in-out"
            >
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center gap-2">
                  <div class="text-xs">Les délus</div>
                  <div
                    class="flex items-center justify-center gap-1 rounded-sm border-2 border-blue-600 bg-black px-2 py-1 text-xs"
                  >
                    <div>{data.data.voteAverage.toFixed(2)}</div>

                    <Star size="14" />
                  </div>
                </div>
                {#if data.data.ratings.length > 0}
                  <div class="flex items-center gap-2">
                    <div class="text-xs">Vidéo club</div>
                    <div
                      class="flex items-center justify-center gap-1 rounded-sm border-2 border-red-600 bg-black px-2 py-1 text-xs"
                    >
                      <div>
                        {(sum(data.data.ratings, (r) => r.note) / data.data.ratings.length).toFixed(
                          2
                        )}
                      </div>
                      <Star size="14" class="mb-[1px]" />
                    </div>
                  </div>
                {/if}
              </div>
              <div class="flex max-w-[900px] flex-col">
                <div class="font-timeburner text-3xl font-bold">
                  <span>{data.data.title}</span>
                  <span class="text-xl font-thin">
                    ({dayjs(data.data.releaseDate).format('YYYY')})
                  </span>
                </div>
                <div class="mt-4">
                  {data.data.overview}
                </div>
              </div>
              <div class="h-8">
                <Rating video={data.data} {videoClubId} onUpdated={() => $query.refetch()} />
              </div>
            </div>
          </div>

          <div class=" p-4">
            <Comments video={data.data} {videoClubId} onUpdated={() => $query.refetch()} />
            <div class="my-4 animate-fade text-2xl animate-delay-500">Acteurs</div>
            <div
              class="flex animate-fade flex-wrap justify-center gap-4 animate-delay-500 md:justify-start"
            >
              {#each data.data.characters || [] as char (char.id)}
                <div
                  class="flex w-32 flex-col items-center gap-1 animate-alternate animate-once animate-ease-in-out"
                >
                  <div>
                    <img
                      class="h-48 w-32 rounded-sm"
                      src={`https://image.tmdb.org/t/p/w500${char.actor.imgUrl}`}
                      alt={char.actor.name}
                    />
                  </div>
                  <div class="text-center text-xs">
                    {char.actor.name}
                  </div>
                  <div class="text-center text-xs font-bold">
                    {char.character}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/await}
    </div>
  </Drawer.Content>
</Drawer.Root>
