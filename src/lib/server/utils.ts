import { error } from "@sveltejs/kit";
import { z } from "zod";

export type CommentUpdateOrCreate = {
	content: string
}

export const getUserSession = async (locals: App.Locals) => {
	const session = await locals.getSession();
	if (!session?.user) throw error(401, 'You need to login') 
  if (!session.user?.email) throw error(403)
	return session.user;
}