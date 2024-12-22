<script lang="ts">
  import type { AllVideoClubsResponse } from '$lib/tanstack-query/video-clubs';
  import type { User } from '@auth/core/types';

  import { page } from '$app/stores';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { signOut } from '@auth/sveltekit/client';
  import { BookOpenText, LogOut } from 'lucide-svelte';
  import GithubLogo from 'phosphor-svelte/lib/GithubLogo';

  import Button from './ui/button/button.svelte';

  interface Props {
    user?: User;
    videoClubs: NonNullable<AllVideoClubsResponse>;
  }

  let { user, videoClubs }: Props = $props();
  let club_id = $derived($page.params.club_id);
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <a href="/">
      <img alt="NafSeries" src="/nafseries.gif" class=" w-96 p-6" />
    </a>
    <Sidebar.Group class="h-full">
      <Sidebar.GroupContent class="flex h-full flex-1 flex-col">
        <Sidebar.Menu>
          {#if user}
            <Sidebar.MenuItem class="mb-4 flex items-center justify-center gap-4">
              <Avatar.Root>
                {#if user.image}
                  <Avatar.Image src={user.image} alt={user.email} />
                {/if}
                <Avatar.Fallback>CN</Avatar.Fallback>
              </Avatar.Root>
              <div>
                {user.name}
              </div>

              <Button variant="ghost" onclick={signOut}>
                <LogOut></LogOut>
              </Button>
            </Sidebar.MenuItem>
          {/if}
          {#each videoClubs as club (club.id)}
            <Sidebar.MenuItem class="mt-2">
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a
                    href={`/videoclubs/${club.id}`}
                    {...props}
                    class:selected={club_id === club.id}
                  >
                    <span>{club.name}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
        <div class="mt-auto"></div>
        {#if user}
          <Sidebar.Menu class="mt-auto">
            <Button>Créer un VideoClub</Button>
          </Sidebar.Menu>
        {/if}
        <Sidebar.Menu class="mt-4 flex flex-row justify-between">
          <Button
            variant="ghost"
            class="w-fit"
            href="https://github.com/G159w/naf-series"
            target="_blank"
          >
            <GithubLogo />
          </Button>
          <Button variant="ghost" class="w-fit" href="/api/swagger" target="_blank">
            <BookOpenText />
          </Button>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>

<style scoped>
  .selected {
    @apply bg-primary/10 text-primary hover:text-primary;
  }
</style>
