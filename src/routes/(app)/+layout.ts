import { queryHandler } from '$lib/tanstack-query';

export const load = async ({ fetch, parent }) => {
  const { queryClient, session } = await parent();

  if (!session?.user) {
    return {};
  }
  const queryOptions = queryHandler({ fetch }).videoClub.findAll();

  await queryClient.prefetchQuery({
    queryFn: queryOptions.queryFn,
    queryKey: queryOptions.queryKey
  });
};
