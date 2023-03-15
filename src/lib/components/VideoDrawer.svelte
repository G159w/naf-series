<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import { Film, Search, Star } from "lucide-svelte";
  import type { ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import type { imdbVideo } from "$lib/types";
  import { fade, scale } from "svelte/transition";
  import { Drawer, drawerStore } from "@skeletonlabs/skeleton";
  import type { Video } from "@prisma/client";

  $: video = $drawerStore.meta as Video;
</script>

{#if !video}
  <div><h4>Invalid VIDEO</h4></div>
{:else}
  <div class=" flex flex-row p-8 gap-8">
    <img
      in:fade
      alt="movie"
      class="w-[400px] rounded-3xl object-cover"
      src={video.imageUrl}
    />
    <div class="flex flex-col gap-8">
      <h1 in:fade class=" font-bold">{video.title}</h1>
      <div
        class="flex flex-row content-between justify-between items-center align-middle"
      >
        <h3 class="text-red-600 font-bold">
          {video.year}
        </h3>
        <h3 class="flex gap-1 align-middle items-center">
          {video.usersRating}%
          <Star fill="yellow" color="yellow" size="26" />
        </h3>
      </div>
      {#if video.desc}
        <p class="font-bold italic">"{video.desc}"</p>
      {/if}
      <p class=" italic">
        {video.storyline}
      </p>
    </div>
  </div>
{/if}
