import type { RequestHandler } from './$types';
import prisma from "$lib/server/prismadb"

import { error } from '@sveltejs/kit';
import { getUserSession, type CommentUpdateOrCreate } from '$lib/server/utils';



export const GET = (async ({ params }) => {
	const comment = await prisma.comment.findFirst({
		where: {
			id: {
        equals: params.comment_id
      }
		}
	})
  if (!comment) throw error(404)
	return new Response(JSON.stringify(comment))
}) satisfies RequestHandler;


export const PATCH = (async ({ request, locals, params }) => {
  const data = await request.json() as CommentUpdateOrCreate;
  if (!data.content) throw error(403)
  const comment = await prisma.comment.findFirst({
		where: {
			id: {
        equals: params.comment_id
      }
		},
    include: {
      user: true
    }
	})
  if (!comment) throw error(404)

	const user = await getUserSession(locals);
  if (user?.email !== comment.user.email) throw error(401)

  const updatedComment = await prisma.comment.update({
    where: {
      id: params.comment_id
    },
    data: {
      content: data.content
    }
  })

	return new Response(JSON.stringify(updatedComment))
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals, params }) => {
  const comment = await prisma.comment.findFirst({
		where: {
			id: {
        equals: params.comment_id
      }
		},
    include: {
      user: true
    }
	})
  if (!comment) throw error(404)

	const user = await getUserSession(locals);
  if (user?.email !== comment.user.email) throw error(401)

  await prisma.comment.delete({
    where: {
      id: params.comment_id
    }
  })

	return new Response()
}) satisfies RequestHandler;