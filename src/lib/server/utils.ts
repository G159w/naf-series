import { type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';

export type CommentUpdateOrCreate = {
  content: string;
};

export type RatingUpdateOrCreate = {
  note: number;
};

export const getUserSession = async (locals: (RequestEvent | ServerLoadEvent)['locals']) => {
  const session = await locals.auth();
  if (!session?.user) return undefined;
  if (!session.user?.email) return undefined;
  return session.user as { email: string };
};

export const uuid = () => {
  return (
    Date.now().toString(36) +
    Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)
  );
};
