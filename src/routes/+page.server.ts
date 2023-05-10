import prisma from '$lib/server/prismadb';
import { getUserSession, uuid } from '$lib/server/utils';
import { Timer } from 'timer-node';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

export const load = (async ({ locals }) => {
	try {
		const session = await getUserSession(locals);
		const clubs = await prisma.videoClub.findMany({
			where: {
				users: {
					some: {
						email: {
							equals: session.email
						}
					}
				}
			}
		});
		return { videoClubs: clubs };
	} catch (error: unknown) {
		return { videoClubs: [] };
	}
}) satisfies PageServerLoad;

const createVideoClubSchema = z.object({
	name: z.string()
});

const deleteVideoClubSchema = z.object({
	clubId: z.string()
});

export const actions: Actions = {
	createVideoClub: async ({ request, locals }) => {
		const user = await getUserSession(locals);
		const timer = new Timer();
		timer.start();
		try {
			const formData = Object.fromEntries(await request.formData());
			const { name } = createVideoClubSchema.parse(formData);

			const videoClub = await prisma.videoClub.create({
				data: {
					name: name,
					watchId: uuid(),
					inviteId: uuid(),
					users: {
						connect: { email: user.email }
					}
				}
			});

			console.log(timer.time(), videoClub);
			return videoClub;
		} catch (error) {
			console.log(timer.time(), error);
			return 'KO';
		}
	},
	deleteVideClub: async ({ request, locals }) => {
		const user = await getUserSession(locals);
		const timer = new Timer();
		timer.start();
		try {
			const formData = Object.fromEntries(await request.formData());
			const { clubId } = deleteVideoClubSchema.parse(formData);

			const videoClub = await prisma.videoClub.update({
				where: {
					id: clubId,
					users: {
						some: {
							email: user.email
						}
					}
				},
				data: {
					users: {
						disconnect: { email: user.email }
					}
				},
				include: {
					_count: {
						select: {
							users: true
						}
					}
				}
			});

			if (videoClub._count.users === 0) {
				await prisma.videoClub.delete({ where: { id: clubId } });
			}

			console.log(timer.time(), videoClub);
			return videoClub;
		} catch (error) {
			console.log(timer.time(), error);
			return 'KO';
		}
	}
};
