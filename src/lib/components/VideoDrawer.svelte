<script lang="ts">
  import { page } from "$app/stores";
  import { Star, User, User as UserIcon } from "lucide-svelte";
  import { fade, scale } from "svelte/transition";
  import { drawerStore } from "@skeletonlabs/skeleton";
  import type {
    Personality,
    Video,
    Genre,
    Rating,
    Comment,
    User,
    Role,
  } from "@prisma/client";
  import { applyAction, deserialize, enhance } from "$app/forms";
  import { format } from "date-fns";
  import StarRating from "./StarRating/StarRating.svelte";
  import { invalidateAll } from "$app/navigation";

  $: videos = ($page.data.videos || []) as (Video & {
    comments: (Comment & {
      user: User;
    })[];
    ratings: Rating[];
    creators: Personality[];
    characters: (Role & {
      actor: Personality;
    })[];
    genres: Genre[];
    userAvg: number | null;
  })[];
  $: videoId = $drawerStore.meta as string;
  $: video = videos.find((video) => video.id === videoId);
  let comment: string = "";

  async function handleRating(num: number) {
    if (!video) return;
    const response = await fetch(`videos/${video.id}/ratings`, {
      method: "POST",
      body: JSON.stringify({ note: num * 2 }),
    });

    const result = deserialize(await response.text());
    if (result) {
      await invalidateAll();
    }
    applyAction(result);
  }
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
      <div class="flex flex-col gap-8 w-full">
        <h1 in:fade={{ delay: 100 }} class=" font-bold">{video.title}</h1>
        <div
          class="flex flex-row content-between justify-between items-center align-middle mt-[-1rem]"
        >
          <div class="flex flex-col gap-2">
            <h4 in:scale={{ delay: 125 }} class="text-red-600 font-bold">
              {format(video.releaseDate, "MM/dd/yyyy")}
            </h4>
            {#if $page.data.session}
              {#key video.ratings[0]?.note}
                <StarRating
                  rating={video.ratings[0]?.note / 2}
                  onRate={handleRating}
                />
              {/key}
            {/if}
          </div>
          <div class="self-end w-fit z-[1] flex flex-col gap-1">
            <span
              class="flex gap-2 align-middle items-center bg-blue-700 w-[4.8rem] justify-center pl-3 pr-2 z-[1] rounded-3xl self-end text-white font-bold shadow-2xl text-sm "
            >
              {video.voteAverage.toFixed(2)}
              <Star fill="white" color="white" size="12" />
            </span>
            {#if video.userAvg}
              <span
                class="flex gap-2 align-middle items-center bg-primary-600 w-[4.8rem] justify-center pl-3 pr-2 z-[1] rounded-3xl self-end text-white font-bold shadow-2xl text-sm "
              >
                {video.userAvg.toFixed(2)}
                <Star fill="white" color="white" size="12" />
              </span>
            {/if}
          </div>
        </div>
        {#if video.tagline}
          <p in:fade={{ delay: 150 }} class="font-bold italic">
            "{video.tagline}"
          </p>
        {/if}
        <p in:fade={{ delay: 200 }} class=" font-light">
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

    <div class="overflow-auto overflow-y-hidden pb-4">
      <span class="font-bold"> Rôles : </span>
      <div class="grid gap-4 grid-cols-9  w-[100rem] pt-2">
        {#each video.characters as char, i}
          <a
            href={`/?searchType=actors&searchText=${char.actor.name}`}
            on:click={drawerStore.close}
            in:scale={{ delay: i * 25 }}
            class=" shadow-md card-hover flex flex-col bg-surface-700 rounded-xl w-36 align-middle items-center !no-underline !text-current"
          >
            {#if char.actor.imgUrl}
              <img
                alt={char.actor.name}
                class="rounded-t-2xl w-full"
                src={"https://image.tmdb.org/t/p/w138_and_h175_face" +
                  char.actor.imgUrl}
              />
            {:else}
              <UserIcon
                class="w-full rounded-t-2xl  h-[142px] bg-surface-100 text-surface-700"
              />
            {/if}
            <span class="px-2 text-center w-full font-light text-900">
              {char.character}
            </span>
            <span class="p-2 text-center w-full font-bold text-900">
              {char.actor.name}
            </span>
          </a>
        {/each}
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <span class="font-bold"> Commentaires ({video.comments.length}) : </span>
      <div class="flex flex-col flex-wrap  gap-8 mt-2">
        {#each video.comments as comment, i}
          <div class=" bg-surface-700 p-4 flex flex-col gap-4 rounded-2xl ">
            <div class="flex flex-row gap-2 align-middle items-center ">
              {#if comment.user?.image}
                <img
                  class="w-10 rounded-full"
                  alt="G img"
                  src={comment.user.image}
                />
              {:else}
                <User />
              {/if}
              <div class="flex flex-col">
                <p
                  class=" font-bold text-primary-500 flex justify-baseline align-baseline content-baseline"
                >
                  {comment.user.name}
                </p>
                <span class=" text-xs italic">
                  le {format(comment.createdAt, "MM/dd/yyyy")}
                </span>
              </div>
            </div>
            <hr />
            <p class="whitespace-pre-wrap">
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
          if (!video) return;
          data.append("videoId", video.id || "");
          return async ({ result }) => {
            if (result.type === "error") {
              await applyAction(result);
            } else {
              comment = "";
              await invalidateAll();
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
