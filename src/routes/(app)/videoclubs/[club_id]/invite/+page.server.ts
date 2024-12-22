import { prisma } from '$lib/server/api/databases/prisma';
import { getUserSession } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const { params } = event;
  const videoClub = await prisma.videoClub.findUnique({
    where: { inviteId: params.club_id }
  });

  if (!videoClub) return { message: `Ce lien d'invitation ne fonctionne pas` };

  try {
    const user = await getUserSession(event);
    await prisma.videoClub.update({
      data: {
        users: {
          connect: {
            email: user.email
          }
        }
      },
      where: { id: videoClub.id }
    });
  } catch (error: unknown) {
    console.error(error);
    return { message: `Vous n'êtes pas connecté` };
  }
  console.log('Redirecting...');
  throw redirect(302, `/videoclubs/${videoClub.id}`);
}) satisfies PageServerLoad;
