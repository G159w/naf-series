<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import VideoClubCreateModal from '$lib/components/video-club/video-club-create-modal.svelte';
  import { queryHandler } from '$lib/tanstack-query';
  import { SignIn } from '@auth/sveltekit/components';
  import { createQuery } from '@tanstack/svelte-query';
  import { BookOpenText } from 'lucide-svelte';
  import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
  import { quintOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  let { data } = $props();

  const queryOptions = queryHandler({ fetch }).videoClub.findAll();
  const query = createQuery({
    enabled: () => !!data.session,
    queryFn: queryOptions.queryFn,
    queryKey: queryOptions.queryKey
  });

  const images = [
    'https://image.tmdb.org/t/p/w500/AnsSKR9LuK0T9bAOcPVA3PUvyWj.jpg',
    'https://image.tmdb.org/t/p/w500/laCJxobHoPVaLQTKxc14Y2zV64J.jpg',
    'https://image.tmdb.org/t/p/w500/5ivqZ3VFgLJVAnbu7C7qY4RSKKi.jpg',
    'https://image.tmdb.org/t/p/w500/9OpXEvuKHOCQCssPE4c6d2evYac.jpg',
    'https://image.tmdb.org/t/p/w500/qHy7BlA1I3iUEIGp7atsMjSNJSK.jpg',
    'https://image.tmdb.org/t/p/w500/tslJx5LPn2aXX3USGYbh0KbglnB.jpg',
    'https://image.tmdb.org/t/p/w500/eFV0O3u0CbVdhEYIozea4iZRn3O.jpg',
    'https://image.tmdb.org/t/p/w500/4Tw8TB9ikrcgzJgR0LOvgfnXD74.jpg'
  ];

  let modalOpen = $state(false);

  function openCreateModal() {
    modalOpen = true;
  }
</script>

<svelte:head>
  <title>NAF Series</title>
  <meta name="home" content="NAF Series" />
  <style>
    @keyframes scroll {
      0% {
        transform: translateX(-50%);
      }
      100% {
        transform: translateX(0%);
      }
    }

    .bg-scroll {
      animation: scroll 60s linear infinite;
      width: 200%;
    }
  </style>
</svelte:head>

<div class="relative h-full w-full overflow-hidden">
  <!-- Moving background with images -->
  <div class="absolute inset-0 z-0 overflow-hidden">
    <div class="flex h-full bg-scroll">
      {#each [...images, ...images] as image, index (index)}
        <div class="relative h-full w-[300px] flex-shrink-0 p-2">
          <img
            src={image}
            alt="Background movie poster"
            class="h-full w-full object-cover opacity-10"
          />
        </div>
      {/each}
    </div>
  </div>

  <!-- Main content -->
  <div
    in:scale={{ delay: 50, duration: 600, easing: quintOut }}
    class="relative z-0 mt-16 flex h-full w-full flex-col content-center items-center gap-16 align-middle md:mt-0 md:justify-center"
  >
    <img alt="NafSeries" src="nafseries.gif" class="w-96 p-4 md:mt-[25vh]" />

    {#if data.session}
      {#if $query.data?.data && $query.data.data.length > 0}
        <div class="flex flex-col gap-4">
          <div
            class="flex w-full max-w-96 flex-col items-center gap-4 font-bold underline underline-offset-4"
          >
            Vos VideoClubs
          </div>
          <div class="flex max-w-96 flex-wrap justify-center gap-4 p-4">
            {#each $query.data.data as club (club.id)}
              <Button
                class="btn variant-filled-primary truncate"
                href={`/videoclubs/${club.id}`}
                variant="outline"
              >
                {club.name}
              </Button>
            {/each}
          </div>
        </div>
      {:else}
        <h4>Vous n'avez pas de VideoCLub</h4>
        <Button class="btn variant-filled-primary" onclick={openCreateModal}>
          Créer un nouveau VideoClub
        </Button>
      {/if}
    {:else}
      <h3>Visitez vos <b class="text-primary-500">VideoClubs</b> en ligne avec vos amis</h3>
      <SignIn provider="google">
        <Button slot="submitButton" class="btn variant-filled-primary" type="submit">
          Se connecter
        </Button>
      </SignIn>
    {/if}
    <!-- Footer -->
    <div class="m-4 mt-auto flex flex-row justify-between self-end justify-self-end">
      <Button
        variant="ghost"
        class="w-fit"
        href="https://github.com/G159w/naf-series"
        target="_blank"
      >
        <GithubLogo />
      </Button>
      <Button variant="ghost" class="w-fit" href="/api/swagger" target="_blank">
        <BookOpenText />
      </Button>
    </div>
  </div>
</div>

<VideoClubCreateModal bind:open={modalOpen} />
