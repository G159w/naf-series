<script lang="ts">
  import type { Genre, Personality, Rating, User, Video } from '@prisma/client';

  import { applyAction, deserialize } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { drawerStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import { format } from 'date-fns';
  import { Star } from 'lucide-svelte';
  import { fade, scale, slide } from 'svelte/transition';

  import StarRating from './StarRating/StarRating.svelte';

  export let video: Video & {
    creators: Personality[];
    genres: Genre[];
    ratings: (Rating & {
      user: User;
    })[];
    userAvg: null | number;
  };

  async function handleRating(num: number) {
    if (!video) return;
    const response = await fetch(`/videos/${video.id}/ratings`, {
      body: JSON.stringify({ note: num * 2 }),
      method: 'POST'
    });

    const result = deserialize(await response.text());
    if (result) {
      await invalidateAll();
    }
    applyAction(result);
  }

  $: myRating = video?.ratings.find(
    (rating) => rating.user.email === $page.data.session?.user?.email
  );

  async function deleteRating(ratingId: string) {
    if (!video) return;
    const response = await fetch(`/videos/${video.id}/ratings/${ratingId}`, {
      method: 'DELETE'
    });

    const result = deserialize(await response.text());
    await invalidateAll();
    applyAction(result);
  }

  const popupHover: PopupSettings = {
    event: 'hover',
    placement: 'bottom',
    target: 'popupHover'
  };
</script>

<div class="card variant-filled-surface p-4" data-popup="popupHover">
  <ul class="list">
    {#each video.ratings as rating}
      <li>
        <span
          class="bg-surface-700 flex h-8 w-8 items-center justify-center rounded-full text-center"
          >{rating.note}</span
        >
        <span class="flex-auto">{rating.user.name}</span>
      </li>
      <hr class="last:hidden" />
    {/each}

    <!-- ... -->
  </ul>
</div>

<div class=" flex flex-row gap-8">
  <div class="">
    <img
      in:fade={{ delay: 100 }}
      alt="movie"
      class="w-[300px] max-w-[300px] rounded-3xl"
      src={'https://image.tmdb.org/t/p/w500' + video.posterPath}
    />
  </div>
  <div class="flex w-full flex-col gap-8">
    <h1 in:fade={{ delay: 100 }} class=" font-bold">{video.title}</h1>
    <div class="mt-[-1rem] flex flex-row content-between items-center justify-between align-middle">
      <div class="flex flex-col gap-3">
        <h4 in:scale={{ delay: 125 }} class="font-bold text-red-600">
          {format(video.releaseDate, 'dd/MM/yyyy')}
        </h4>
        {#if $page.data.session}
          <div class="flex flex-col items-center">
            <StarRating rating={myRating ? myRating.note / 2 : undefined} onRate={handleRating} />
            {#if myRating}
              <div
                on:keypress
                transition:slide={{ duration: 200 }}
                on:click={() => deleteRating(myRating?.id || '')}
                class=" text-primary-500 cursor-pointer text-xs underline"
              >
                Supprimer ma note
              </div>
            {/if}
          </div>
        {/if}
      </div>
      <div class="flex flex-row gap-8">
        <div
          class="z-[1] flex w-fit flex-col content-center items-center justify-center gap-1 self-end p-2 align-middle"
        >
          <div class="text-sm font-bold">Avis des délus</div>
          <div
            class="z-[1] flex w-[5rem] items-center justify-center gap-2 rounded-3xl border-2 border-blue-600 bg-white pl-3 pr-2 align-middle text-sm font-bold text-blue-600 shadow-2xl"
          >
            {video.voteAverage.toFixed(2)}
            <Star fill="blue" color="blue" size="12" />
          </div>
          <div class="text-xs italic">
            votes : {video.voteCount}
          </div>
        </div>
        {#if video.userAvg}
          <button
            use:popup={popupHover}
            class="card-hover bg-surface-700 z-[2] flex w-fit flex-col content-center items-center justify-center gap-1 self-end rounded-xl p-2 align-middle shadow-md [&>*]:pointer-events-none"
          >
            <div class="text-sm font-bold">Vos avis</div>
            <div
              class="text-primary-600 border-primary-600 flex w-[5rem] items-center justify-center gap-2 rounded-3xl border-2 bg-white pl-3 pr-2 align-middle text-sm font-bold shadow-2xl"
            >
              {video.userAvg.toFixed(2)}
              <Star fill="red" color="red" size="12" />
            </div>
            <div class="text-xs italic">
              votes : {video.ratings.length}
            </div>
          </button>
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
          <a href={`/?searchType=creators&searchText=${creator.name}`} on:click={drawerStore.close}>
            {creator.name}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
