<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="flex h-full flex-col gap-12 align-middle">
  {#if data.session}
    Vous allez être redirigé vers le VideoClub
  {:else}
    Vous devez vous connecter afin d'accepter l'invitation
  {/if}
</div>
