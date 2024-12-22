<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import { signIn } from '@auth/sveltekit/client';
  import { quintOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  let { data } = $props();
</script>

<svelte:head>
  <title>NAF Series</title>
  <meta name="home" content="NAF Series" />
</svelte:head>

<div
  in:scale={{ delay: 50, duration: 600, easing: quintOut }}
  class="  flex h-full w-full flex-col content-center items-center justify-center gap-16 align-middle"
>
  <img alt="NafSeries" src="nafseries.gif" class=" w-96" />

  {#if data.session}
    <!-- {#if (data.videoClubs?.data?.length || 0) > 0}
      <div class=" flex w-96 flex-col items-center gap-4">Vos derniers visionnages:</div>
    {:else}
      <h4>Vous n'avez pas de VideoCLub</h4>
      <Button class="btn  variant-filled-primary " onclick={() => 0}>
        Créer un nouveau VideoClub
      </Button>
    {/if} -->
  {:else}
    <h3>Visitez vos <b class="text-primary-500">VideoClubs</b> en ligne avec vos amis</h3>
    <Button class="btn variant-filled-primary" onclick={() => signIn('google')}>
      Se connecter
    </Button>
  {/if}
</div>
