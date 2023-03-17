<script lang="ts">
  import type { PageData } from "./$types";
  import AddMovie from "$lib/components/AddVideoButton.svelte";
  import MovieCard from "$lib/components/VideoCard.svelte";
  import SearchMovie from "$lib/components/SearchVideo.svelte";
  import { fade } from "svelte/transition";

  export let data: PageData;


</script>

<div class="flex flex-col gap-12">
  <div class="flex gap-2 w-full justify-center">
    <SearchMovie genres={data.genres} />
  </div>
  <div class="flex flex-row flex-wrap gap-8 justify-center">
    {#each data.videos as video, i (video.id)}
      <div in:fade={{ delay: i * 25 }}>
        <MovieCard {video} />
      </div>
    {/each}
  </div>
  <div class="fixed bottom-8 right-14">
    <AddMovie />
  </div>
</div>
