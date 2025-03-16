<script lang="ts">
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  let { children, data } = $props();
</script>

{#if data.session?.user}
  <Sidebar.Provider>
    <AppSidebar user={data.session?.user} />
    <main class="w-full antialiased">
      <Sidebar.Trigger class="fixed z-[1] md:hidden" />
      {@render children?.()}
    </main>
  </Sidebar.Provider>
{:else}
  <div class="flex h-screen min-h-screen w-full items-center justify-center antialiased">
    {@render children?.()}
  </div>
{/if}
