<script lang="ts">
  import { Film } from "lucide-svelte";
  import type { movieDBVideo } from "$lib/types";


  export let video: movieDBVideo;
  export let onClick: () => void;
  export let isSelected: boolean;
</script>

<button
  class={` rounded-lg shadow-lg   card-hover border-primary-500 flex flex-row gap-2 w-full h-[75px] ${
    isSelected ? "bg-primary-500" : "bg-surface-700"
  } `}
  on:click={onClick}
>
  {#if video.imgUrl}
    <img alt={video.title} class="h-[75px]  rounded-lg" src={video.imgUrl} />
  {:else}
    <div
      class="w-[50px] h-[75px] flex items-center align-middle justify-center flex-col bg-surface-200 rounded-lg"
    >
      <Film />
    </div>
  {/if}
  <div class="flex flex-col h-[75px] items-start text-left gap-1 p-1 pr-2">
    <div class="font-bold line-clamp-2 leading-tight">
      {video.title}
    </div>
    {#if video.year}
      <div class=" font-light">
        {video.year}
      </div>
    {/if}
  </div>
</button>
