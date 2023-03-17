<script lang="ts">
  import { Star, User } from "lucide-svelte";
  import { fade, scale } from "svelte/transition";
  import { Drawer, drawerStore } from "@skeletonlabs/skeleton";
  import type { Personality, Video, Genre } from "@prisma/client";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  $: video = $drawerStore.meta as Video & {
    creators: Personality[];
    stars: Personality[];
    genres: Genre[];
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
        {#if video.genres.length}
          <div class="flex flex-row gap-2" in:fade={{ delay: 250 }}>
            <span class="font-bold"> Genres : </span>
            {#each video.genres as genre}
              <a href={`/?genre=${genre.id}`} on:click={drawerStore.close}>
                {genre.name}
              </a>
            {/each}
          </div>
        {/if}
        {#if video.creators.length}
          <div class="flex flex-row gap-2" in:fade={{ delay: 250 }}>
            <span class="font-bold"> Créateurs : </span>
            {#each video.creators as creator}
              <a
                href={`/?searchType=creators&searchText=${creator.name}`}
                on:click={drawerStore.close}
              >
                {creator.name}
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div>
      <span class="font-bold"> Acteurs : </span>
      <div class="flex flex-row flex-wrap rounded-2xl gap-8 mt-2">
        {#each video.stars as star, i}
          <a
            href={`/?searchType=stars&searchText=${star.name}`}
            on:click={drawerStore.close}
            in:scale={{ delay: i * 25 }}
            class=" shadow-md card-hover flex flex-col bg-surface-700 rounded-xl w-28 align-middle items-center !no-underline !text-current"
          >
            {#if star.imgUrl}
              <img
                alt={star.name}
                class="rounded-t-2xl w-full"
                src={star.imgUrl}
              />
            {:else}
              <User
                class="w-full rounded-t-2xl  h-[142px] bg-surface-100 text-surface-700"
              />
            {/if}
            <span class="p-2 text-center w-full font-bold text-900">
              {star.name}
            </span>
          </a>
        {/each}
      </div>
    </div>
  </div>
{/if}
