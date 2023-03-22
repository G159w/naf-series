<script lang="ts">
  import type { PageData } from "./$types";
  import { drawerStore } from "@skeletonlabs/skeleton";
  import AddMovie from "$lib/components/AddVideoButton.svelte";
  import MovieCard from "$lib/components/VideoCard.svelte";
  import SearchMovie from "$lib/components/SearchVideo.svelte";
  import { fade } from "svelte/transition";

  export let data: PageData;

</script>

<div class="flex flex-col gap-12 align-middle">
  <div class="flex gap-2 w-full justify-center">
    <SearchMovie genres={data.genres} />
  </div>
  <div class="grid gap-4 justify-center column grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:px-32 xl:grid-cols-3 3xl:grid-cols-4 w-full self-center">
    {#each data.videos as video, i (video.id)}
      <div in:fade={{ delay: i * 25 }} class="first-of-type:row-span-2">
        <MovieCard size={i === 0 ? 'big' : 'small'} video={video} />
      </div>
    {/each}
  </div>
  {#if data.session}
    <div class="fixed bottom-8 right-14 z-[1]">
      <AddMovie />
    </div>
  {/if}
</div>
