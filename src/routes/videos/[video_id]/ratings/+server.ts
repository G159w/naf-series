import type { RequestHandler } from './$types';
import prisma from "$lib/server/prismadb"

import { error } from '@sveltejs/kit';
import { getUserSession, type RatingUpdateOrCreate } from '$lib/server/utils';


export const GET = (async ({ params }) => {
	const comments = await prisma.rating.findMany({
		where: {
			videoId: {
				equals: params.video_id
			}
		}
	})
	return new Response(JSON.stringify(comments))
}) satisfies RequestHandler;

export const POST = (async ({ request, locals, params }) => {
	const { note } = await request.json() as RatingUpdateOrCreate;
  if (!note) throw error(400)

	const userSession = await getUserSession(locals);
	if (!userSession?.email) throw error(403)
	const user = await prisma.user.findUnique({ where: { email: userSession.email }})
	if (!user) throw error(403)
	const comment = await prisma.rating.upsert({
		where: {
			userId_videoId: {
				videoId: params.video_id,
				userId: user.id
			}
		},
		create: {
			video: { connect: { id: params.video_id }},
			user: { connect: { id: user.id } },
			note: note
		},
		update: {
			note: note
		},
		include: {
			user: true
		}
	})
	return new Response(JSON.stringify(comment))
}) satisfies RequestHandler;