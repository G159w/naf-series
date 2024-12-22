import { z } from 'zod';

export const envsDto = z.object({
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  AUTH_SECRET: z.string(),
  DATABASE_URL: z.string(),
  MOVIE_DB_KEY: z.string()
});

export type EnvsDto = z.infer<typeof envsDto>;
