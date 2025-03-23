<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { SignIn } from '@auth/sveltekit/components';

  let { data } = $props();
</script>

<svelte:head>
  <title>Rejoindre un VideoCLub</title>
  <meta name="videoclub" content="NAF Series" />
</svelte:head>

<div class="flex h-full flex-col items-center justify-center gap-12 p-8 text-center">
  {#if !data.success && data.message}
    <img alt="NafSeries" src="/nafseries.gif" class="w-96 p-4" />

    <h2 class="text-2xl font-bold">{data.message}</h2>

    {#if data.message.includes('connecter')}
      <div class="flex flex-col items-center gap-6">
        <p>Connectez-vous pour rejoindre le VideoClub</p>
        <SignIn provider="google">
          <Button slot="submitButton" class="btn variant-filled-primary" type="submit">
            Se connecter
          </Button>
        </SignIn>
      </div>
    {/if}
  {:else}
    <h2 class="text-2xl font-bold">Vous allez être redirigé vers le VideoClub...</h2>
    <div class="loader animate-spin text-primary"></div>
  {/if}
</div>

<style>
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: currentColor;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
</style>
