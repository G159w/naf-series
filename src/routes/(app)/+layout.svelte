<script lang="ts">
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';

  let { children, data } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar user={data.session?.user} />
  <main class="w-full antialiased">
    <Sidebar.Trigger class="fixed" />
    {@render children?.()}
  </main>
</Sidebar.Provider>
