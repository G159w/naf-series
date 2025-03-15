import { queryHandler } from '$lib/tanstack-query';

export const load = async ({ fetch, parent }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery(queryHandler({ fetch }).videoClubs.findAll());
};
