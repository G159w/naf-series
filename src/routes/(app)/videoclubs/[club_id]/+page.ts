import { queryHandler } from '$lib/tanstack-query';
import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch, params, parent, url }) => {
  const { queryClient } = await parent();

  const title = url.searchParams.get('title') ?? undefined;
  const author = url.searchParams.get('author') ?? undefined;
  const actor = url.searchParams.get('actor') ?? undefined;

  const queryOptions = queryHandler({ fetch }).videoClub.findOne({
    actor: actor,
    author: author,
    title: title,
    videoClubId: params.club_id
  });

  const response = await queryClient.fetchQuery({
    queryFn: queryOptions.queryFn,
    queryKey: queryOptions.queryKey
  });

  if (response.error || !response.data) {
    console.error('Video club not found or not accessible:', response.error.value.message);
    throw redirect(302, '/');
  }
  return { videoClub: response.data };
};
