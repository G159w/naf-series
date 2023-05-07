import type { RequestHandler } from './$types';
import prisma from '$lib/server/prismadb';

import { error } from '@sveltejs/kit';
import { getUserSession, type CommentUpdateOrCreate } from '$lib/server/utils';

export const GET = (async ({ params }) => {
	const comments = await prisma.comment.findMany({
		where: {
			videoId: {
				equals: params.video_id
			}
		}
	});
	return new Response(JSON.stringify(comments));
}) satisfies RequestHandler;

export const POST = (async ({ request, locals, params }) => {
	const { content } = (await request.json()) as CommentUpdateOrCreate;
	if (!content) throw error(400);

	const user = await getUserSession(locals);
	if (!user?.email) throw error(403);

	const comment = await prisma.comment.create({
		data: {
			video: { connect: { id: params.video_id } },
			user: { connect: { email: user.email } },
			content: content
		},
		include: {
			user: true
		}
	});
	return new Response(JSON.stringify(comment));
}) satisfies RequestHandler;
