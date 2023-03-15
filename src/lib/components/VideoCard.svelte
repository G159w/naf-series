<script lang="ts">
  import { drawerStore } from "@skeletonlabs/skeleton";
  import type { Personality, Video } from "@prisma/client";
  import { Star } from "lucide-svelte";
  import type { DrawerSettings } from "@skeletonlabs/skeleton";
  import { scale } from "svelte/transition";

  export let video: (Video & {
    creators: Personality[];
    stars: Personality[];
  });
  const drawerSettings: DrawerSettings = {
    meta: video,
    width: "w-[1200px] ",
    padding: "p-4",
    rounded: "rounded-3xl",
  };
</script>

<button
  on:click={() => drawerStore.open(drawerSettings)}
  class=" min-w-[288px] shadow-lg rounded-3xl bg-surface-700 w-72 h-[440px]  text-left  card-hover"
>
  <img
    alt="movie"
    class="h-52 w-full rounded-t-3xl object-cover"
    src={video.imageUrl}
  />
  <div class="p-4 flex flex-col gap-2">
    <div class="flex flex-col align-middle">
      <span class="font-bold line-clamp-1">
        {video.title}
      </span>
      <div
        class="flex flex-row content-between justify-between items-center align-middle"
      >
        <span class="text-red-600 font-bold">
          {video.year}
        </span>
        <span class="flex gap-1 align-middle items-center">
          {video.usersRating}%
          <Star fill="yellow" color="yellow" size="20" />
        </span>
      </div>
    </div>
    <div class="line-clamp-6 italic h-[146px]">
      {video.storyline}
    </div>
  </div>
</button>
