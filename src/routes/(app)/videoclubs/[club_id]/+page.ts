import { queryHandler } from '$lib/tanstack-query';

export const load = async ({ fetch, params, parent, url }) => {
  const { queryClient } = await parent();

  const title = url.searchParams.get('title') ?? undefined;
  const author = url.searchParams.get('author') ?? undefined;
  const actor = url.searchParams.get('actor') ?? undefined;

  const videoClub = await queryClient.fetchQuery(
    queryHandler({ fetch }).videoClubs.findOne({
      actor: actor,
      author: author,
      title: title,
      videoClubId: params.club_id
    })
  );
  return { videoClub };
};
