<script lang="ts">
  import type { User } from '@auth/core/types';

  import { page } from '$app/stores';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { queryHandler } from '$lib/tanstack-query';
  import { signOut } from '@auth/sveltekit/client';
  import { createQuery } from '@tanstack/svelte-query';
  import { BookOpenText, LogOut } from 'lucide-svelte';
  import GithubLogo from 'phosphor-svelte/lib/GithubLogo';

  import Button from './ui/button/button.svelte';
  import VideoClubCreateModal from './video-club/video-club-create-modal.svelte';

  interface Props {
    user?: User;
  }

  let { user }: Props = $props();
  let club_id = $derived($page.params.club_id);

  let modalOpen = $state(false);

  function openCreateModal() {
    modalOpen = true;
  }

  const query = createQuery(queryHandler({ fetch }).videoClubs.findAll());
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
            <Sidebar.Menu class="mt-auto">
              <Button onclick={openCreateModal}>Créer un VideoClub</Button>
            </Sidebar.Menu>
          {/if}
          {#if $query.isSuccess && $query.data.data}
            {#each $query.data.data as club (club.id)}
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
          {/if}
        </Sidebar.Menu>
        <div class="mt-auto"></div>
        {#if user}
          <Sidebar.MenuItem
            class="flex items-center justify-start gap-4 rounded-md border border-primary p-2 pl-4"
          >
            <Avatar.Root class="h-6 w-6">
              {#if user.image}
                <Avatar.Image src={user.image} alt={user.email} />
              {/if}
              <Avatar.Fallback>CN</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex w-full">
              {user.name}
            </div>
            <Button variant="ghost" onclick={() => signOut({ redirectTo: '/' })} size="sm">
              <LogOut></LogOut>
            </Button>
          </Sidebar.MenuItem>
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

<VideoClubCreateModal bind:open={modalOpen} />

<style scoped>
  .selected {
    @apply bg-primary/10 text-primary hover:text-primary;
  }
</style>
