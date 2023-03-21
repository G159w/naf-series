<script lang="ts">
  import { drawerStore } from "@skeletonlabs/skeleton";
  import type { Personality, Video } from "@prisma/client";
  import { Star } from "lucide-svelte";
  import type { DrawerSettings } from "@skeletonlabs/skeleton";
  import { scale } from "svelte/transition";
  import { format } from "date-fns";

  export let video: Video & {
    creators: Personality[];
    stars: Personality[];
  };
  export let size: 'small' | 'big' = 'small'
  const drawerSettings: DrawerSettings = {
    meta: video,
    width: "w-[1200px] ",
    padding: "p-4",
    rounded: "rounded-3xl",
  };
</script>

<button
  on:click={() => drawerStore.open(drawerSettings)}
  class={`shadow-lg rounded-3xl ${size === 'small' ? 'h-80' : 'h-full'} min-h-[16rem]  w-full text-left relative overflow-hidden`}
>
  <img
    alt="movie"
    class={` w-full h-full rounded-t-3xl object-cover absolute top-0 img rounded-3xl img z-[1] hover:scale-110`}
    src={"https://image.tmdb.org/t/p/w500" + (size === 'small' ? video.backdropPath : video.posterPath)}
  />
  <div
    class="p-4 flex flex-col gap-2 absolute top-0 w-full justify-between content-between h-full"
  >
    <span
      class="flex gap-2 align-middle items-center bg-white w-fit pl-3 pr-2  z-[1] rounded-3xl self-end text-primary-500 font-bold shadow-2xl text-sm border-primary-500 border-2"
    >
      {video.voteAverage}
      <Star fill="red" color="red" size="12" />
    </span>
    <div class="flex flex-col align-middle z-[1] w-fit">
      <span class="font-bold line-clamp-1 text-xl">
        {video.title}
      </span>
      <div class="flex flex-row  items-center align-middle">
        <span class="text-primary-500 ">
          {format(video.releaseDate, "MM/dd/yyyy")}
        </span>
      </div>
    </div>
  </div>
</button>

<style>
  .img {
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 20%,
      transparent 100%
    );
    transition: transform 0.3s;
  }
</style>
