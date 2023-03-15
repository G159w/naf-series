import { SvelteKitAuth } from "@auth/sveltekit"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import Google from '@auth/core/providers/google'
import { GOOGLE_ID, GOOGLE_SECRET } from "$env/static/private"
import type { Profile } from "@auth/core/types"
import type { OAuth2Config } from "@auth/core/providers"
import prisma from "$lib/server/prismadb"
import type { Adapter } from "@auth/core/adapters"

export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }) as OAuth2Config<Profile>,
  ],
})