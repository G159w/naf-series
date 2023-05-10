import { error } from '@sveltejs/kit';

export type CommentUpdateOrCreate = {
	content: string;
};

export type RatingUpdateOrCreate = {
	note: number;
};

export const getUserSession = async (locals: App.Locals) => {
	const session = await locals.getSession();
	if (!session?.user) throw error(401, 'You need to login');
	if (!session.user?.email) throw error(403);
	return session.user as { email: string };
};

export const uuid = () => {
	return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)
};
