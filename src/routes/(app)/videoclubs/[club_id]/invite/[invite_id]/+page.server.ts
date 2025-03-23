import { getUserSession } from '$lib/server/utils';
import { queryHandler } from '$lib/tanstack-query';
import { redirect } from '@sveltejs/kit';
import { QueryClient } from '@tanstack/svelte-query';

export const load = async ({ fetch, locals, params }) => {
  const queryClient = new QueryClient();

  const user = await getUserSession(locals);

  if (!user) {
    console.error('User not found in session');
    return { message: `Vous devez vous connecter pour rejoindre ce VideoClub`, success: false };
  }

  // If user exists, join the video club
  const queryOptions = queryHandler({ fetch }).videoClub.join({
    inviteId: params.invite_id,
    videoClubId: params.club_id
  });

  const result = await queryClient.fetchQuery({
    queryFn: () => queryOptions.mutationFn(),
    queryKey: [queryOptions.mutationKey]
  });

  if (result.error) {
    console.error('Error joining video club:', result.error);
    return { message: `Erreur lors de la tentative de rejoindre le VideoClub`, success: false };
  }

  // Redirect to the video club page
  throw redirect(302, `/videoclubs/${params.club_id}`);
};
