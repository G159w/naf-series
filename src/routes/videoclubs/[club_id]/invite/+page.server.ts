import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prismadb';
import { getUserSession } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url, params, locals }) => {
	const videoClub = await prisma.videoClub.findUnique({
		where: { inviteId: params.club_id }
	});

	if (!videoClub) return { message: `Ce lien d'invitation ne fonctionne pas` };

	try {
		const user = await getUserSession(locals);
		await prisma.videoClub.update({
			where: { id: videoClub.id },
			data: {
				users: {
					connect: {
						email: user.email
					}
				}
			}
		});
	} catch (error: unknown) {
		return { message: `Vous n'êtes pas connecté` };
	}
	console.log('Redirecting...');
	throw redirect(302, `/videoclubs/${videoClub.id}`);
}) satisfies PageServerLoad;
