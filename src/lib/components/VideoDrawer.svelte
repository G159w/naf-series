<script lang="ts">
  import { Star } from "lucide-svelte";
  import { fade, scale } from "svelte/transition";
  import { Drawer, drawerStore } from "@skeletonlabs/skeleton";
  import type { Personality, Video } from "@prisma/client";

  $: video = $drawerStore.meta as Video & {
    creators: Personality[];
    stars: Personality[];
  };
</script>

{#if !video}
  <div><h4>Invalid VIDEO</h4></div>
{:else}
  <div class=" flex flex-col p-8 gap-8">
    <div class=" flex flex-row gap-8">
      <div class="">
        <img
          in:fade={{ delay: 100 }}
          alt="movie"
          class="w-[300px] max-w-[300px] rounded-3xl "
          src={video.imageUrl}
        />
      </div>
      <div class="flex flex-col gap-8">
        <h1 in:fade={{ delay: 100 }} class=" font-bold">{video.title}</h1>
        <div
          class="flex flex-row content-between justify-between items-center align-middle"
        >
          <h3 in:scale={{ delay: 125 }} class="text-red-600 font-bold">
            {video.year}
          </h3>
          <h3
            in:scale={{ delay: 150 }}
            class="flex gap-1 align-middle items-center"
          >
            {video.usersRating}%
            <Star fill="yellow" color="yellow" size="26" />
          </h3>
        </div>
        {#if video.desc}
          <p in:fade={{ delay: 150 }} class="font-bold italic">
            "{video.desc}"
          </p>
        {/if}
        <p in:fade={{ delay: 200 }} class=" italic">
          {video.storyline}
        </p>
        {#if video.creators.length}
          <div in:fade={{ delay: 250 }}>
            <span class="font-bold"> Créateurs: </span>
            {#each video.creators as creator}
              <div>{creator.name}</div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div>
      <span class="font-bold"> Acteurs: </span>
      <div class="flex flex-row flex-wrap rounded-2xl gap-8 mt-2">
        {#each video.stars as star, i}
          <div
            in:scale={{ delay: i * 25 }}
            class="flex flex-col bg-surface-700 rounded-xl w-28 align-middle"
          >
            <img class="rounded-t-2xl w-full" src={star.imgUrl} />
            <span class="p-2 text-center w-full font-bold">
              {star.name}
            </span>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
