import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

export const load = async ({ data }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });

  return {
    queryClient,
    session: data?.session
  };
};
