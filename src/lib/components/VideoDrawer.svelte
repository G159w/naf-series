<script lang="ts">
  import { page } from '$app/stores';
  import { Star, User as UserIcon } from "lucide-svelte";
  import { fade, scale } from "svelte/transition";
  import { Drawer, drawerStore } from "@skeletonlabs/skeleton";
  import type {
    Personality,
    Video,
    Genre,
    Rating,
    Comment,
    User,
  } from "@prisma/client";
  import { applyAction, enhance } from "$app/forms";
  import format from "date-fns/format";

  $: video = $drawerStore.meta as Video & {
    comments: (Comment & {
      user: User;
    })[];
    ratings: Rating[];
    creators: Personality[];
    actors: Personality[];
    genres: Genre[];
  };
  let comment: string = "";
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
          src={"https://image.tmdb.org/t/p/w500" + video.posterPath}
        />
      </div>
      <div class="flex flex-col gap-8">
        <h1 in:fade={{ delay: 100 }} class=" font-bold">{video.title}</h1>
        <div
          class="flex flex-row content-between justify-between items-center align-middle"
        >
          <h3 in:scale={{ delay: 125 }} class="text-red-600 font-bold">
            {format(video.releaseDate, "MM/dd/yyyy")}
          </h3>
          <h3
            in:scale={{ delay: 150 }}
            class="flex gap-1 align-middle items-center"
          >
            {video.voteAverage}
            <Star fill="yellow" color="yellow" size="26" />
          </h3>
        </div>
        {#if video.tagline}
          <p in:fade={{ delay: 150 }} class="font-bold italic">
            "{video.tagline}"
          </p>
        {/if}
        <p in:fade={{ delay: 200 }} class=" italic">
          {video.overview}
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
        {#each video.actors as star, i}
          <a
            href={`/?searchType=actors&searchText=${star.name}`}
            on:click={drawerStore.close}
            in:scale={{ delay: i * 25 }}
            class=" shadow-md card-hover flex flex-col bg-surface-700 rounded-xl w-24 align-middle items-center !no-underline !text-current"
          >
            {#if star.imgUrl}
              <img
                alt={star.name}
                class="rounded-t-2xl w-full"
                src={"https://image.tmdb.org/t/p/w500" + star.imgUrl}
              />
            {:else}
              <UserIcon
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
    <div class="flex flex-col gap-4">
      <span class="font-bold"> Commentaires ({video.comments.length}) : </span>
      <div class="flex flex-col flex-wrap  gap-8 mt-2">
        {#each video.comments as comment, i}
          <div class=" bg-surface-700 p-4 flex flex-col gap-4 rounded-2xl">
            <div class="flex flex-row gap-4">
              <p class=" font-bold">
                {comment.user.name}
              </p>
              <p class=" italic">
                {comment.createdAt}
              </p>
            </div>
            <p>
              {comment.content}
            </p>
          </div>
        {/each}
      </div>
    </div>
    {#if $page.data.session}
      <hr />
      <form
        class="flex flex-col gap-4 items-end"
        method="post"
        action="?/createComment"
        use:enhance={({ data }) => {
          data.append("videoId", video.id || "");
          return async ({ result }) => {
            if (result.type === "error") {
              await applyAction(result);
            } else {
              comment = "";
              video.comments.push(result.data);
              video = video;
            }
          };
        }}
      >
        <textarea
          bind:value={comment}
          name="content"
          class="textarea"
          rows="4"
          placeholder="Donnez votre avis."
        />
        <button class=" btn variant-filled-primary">Envoyer</button>
      </form>
    {/if}
  </div>
{/if}
