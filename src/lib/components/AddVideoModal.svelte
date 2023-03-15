<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import { Film, Search } from "lucide-svelte";
  import type { ModalSettings, ModalComponent } from "@skeletonlabs/skeleton";
  import type { imdbVideo } from "$lib/types";
  import { fade, scale } from "svelte/transition";
  import { append } from "svelte/internal";
  import { VideoType } from "@prisma/client";
  import VideoSuggestion from "./VideoSuggestion.svelte";

  let imdbVideos = new Array<imdbVideo>();
  $: movies = imdbVideos.filter((v) => v.type === VideoType.Movie);
  $: series = imdbVideos.filter((v) => v.type === VideoType.Series);
  let selectedImdbVideo: imdbVideo | undefined;
</script>

<div
  class="shadow-xl w-modal h-fit  min-h-[520px] p-8 rounded-3xl bg-surface-active-token flex flex-col gap-8 align-middle w-full justify-between"
>
  <form
    class="flex w-full justify-center"
    method="POST"
    use:enhance={() => {
      return async ({ result }) => {
        if (result.type === "error") {
          await applyAction(result);
        } else {
          selectedImdbVideo = undefined;
          imdbVideos = result.data;
          console.log(imdbVideos);
        }
      };
    }}
    action="?/fetchImdbVideos"
  >
    <div
      class="input-group input-group-divider grid-cols-[auto_1fr_auto] w-fit h-12"
    >
      <input
        name="searchedVideo"
        class="w-[300px]"
        type="search"
        placeholder="Search on imdb..."
      />
      <button class="variant-filled-primary"><Search /></button>
    </div>
  </form>
  <div class="flex flex-row gap-4">
    {#if movies.length > 0}
      <div class="flex flex-col gap-4 ali w-full">
        <h3 in:fade>Films</h3>
        <div class="flex flex-row gap-4 flex-wrap w-full">
          {#each movies as video, i (video.imdbUrl)}
            <div in:scale={{ delay: i * 25 }} class="w-full">
              <VideoSuggestion
                {video}
                onClick={() => (selectedImdbVideo = video)}
                isSelected={video === selectedImdbVideo}
              />
            </div>
          {/each}
        </div>
      </div>
    {/if}
    {#if series.length > 0}
      <div class="flex flex-col gap-4 ali w-full">
        <h3>Séries</h3>
        <div class="flex flex-row gap-4 flex-wrap w-full">
          {#each series as video, i (video.imdbUrl)}
            <div in:scale={{ delay: i * 25 }} class="w-full">
              <VideoSuggestion
                {video}
                onClick={() => (selectedImdbVideo = video)}
                isSelected={video === selectedImdbVideo}
              />
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  {#if selectedImdbVideo}
    <div in:fade class="w-full flex ">
      <form
        class="flex w-full justify-end"
        method="POST"
        use:enhance={({ data }) => {
          data.append("imdbUrl", selectedImdbVideo?.imdbUrl || "");
          return async ({ result }) => {
            if (result.type === "error") {
              await applyAction(result);
            } else {
              selectedImdbVideo = undefined;
              console.log(result);
            }
          };
        }}
        action="?/addImbdbVideo"
      >
        <button class="btn variant-filled-primary ">Valider</button>
      </form>
    </div>
  {:else}
    <div class="h-[42px]" />
  {/if}
</div>
