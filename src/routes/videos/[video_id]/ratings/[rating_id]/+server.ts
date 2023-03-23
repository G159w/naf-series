import type { RequestHandler } from './$types';
import prisma from "$lib/server/prismadb"

import { error } from '@sveltejs/kit';
import { getUserSession, type RatingUpdateOrCreate } from '$lib/server/utils';



export const GET = (async ({ params }) => {
	const rating = await prisma.rating.findFirst({
		where: {
			id: {
        equals: params.rating_id
      }
		}
	})
  if (!rating) throw error(404)
	return new Response(JSON.stringify(rating))
}) satisfies RequestHandler;


export const PATCH = (async ({ request, locals, params }) => {
  const { note } = await request.json() as RatingUpdateOrCreate;
  if (!note) throw error(403)
  const rating = await prisma.rating.findFirst({
		where: {
			id: {
        equals: params.rating_id
      }
		},
    include: {
      user: true
    }
	})
  if (!rating) throw error(404)

	const user = await getUserSession(locals);
  if (user?.email !== rating.user.email) throw error(401)

  const updatedComment = await prisma.rating.update({
    where: {
      id: params.rating_id
    },
    data: {
      note: note
    }
  })

	return new Response(JSON.stringify(updatedComment))
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals, params }) => {
  const rating = await prisma.rating.findFirst({
		where: {
			id: {
        equals: params.rating_id
      }
		},
    include: {
      user: true
    }
	})
  if (!rating) throw error(404)

	const user = await getUserSession(locals);
  if (user?.email !== rating.user.email) throw error(401)

  await prisma.rating.delete({
    where: {
      id: params.rating_id
    }
  })

	return new Response(JSON.stringify({}))
}) satisfies RequestHandler;