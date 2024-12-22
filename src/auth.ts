import { prisma } from '$lib/server/api/databases/prisma';
import Google from '@auth/core/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session }) {
      return session;
    }
  },
  providers: [Google],
  trustHost: true
});
