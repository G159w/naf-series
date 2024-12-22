import { queryHandler } from '$lib/tanstack-query';

export const load = async ({ fetch, parent }) => {
  const { queryClient } = await parent();
  const videoClubs = await queryClient.fetchQuery(queryHandler({ fetch }).videoClubs.findAll());
  return { videoClubs };
};
