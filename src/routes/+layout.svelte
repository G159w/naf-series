<script lang="ts">
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { userState } from '$lib/components/utils.svelte';

  import '../app.css';

  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

  const { children, data } = $props();

  $effect(() => {
    const session = (() => userState.session)();
    if (data.session !== session) {
      userState.session = data.session;
    }
  });
</script>

<QueryClientProvider client={data.queryClient}>
  <Toaster />
  <main class="antialiased">
    {@render children()}
  </main>
  <SvelteQueryDevtools />
</QueryClientProvider>
