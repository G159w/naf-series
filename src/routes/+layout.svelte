<script lang="ts">
  import "@skeletonlabs/skeleton/themes/theme-crimson.css";
  import "@skeletonlabs/skeleton/styles/all.css";
  import "../app.postcss";
  
  import {
    computePosition,
    autoUpdate,
    flip,
    shift,
    offset,
    arrow,
  } from "@floating-ui/dom";
  import { Drawer, Modal, storePopup, drawerStore } from "@skeletonlabs/skeleton";
  import {
    AppShell,
    AppBar,
    popup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";
  import { Github, User, LogOut } from "lucide-svelte";
  import { page } from "$app/stores";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import MovieDrawer from "$lib/components/VideoDrawer.svelte";

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  let popupMenu: PopupSettings = {
    event: "click",
    target: "loginOption",
    placement: "bottom",
    // Close the popup when the item is clicked
    closeQuery: ".listbox-item",
  };
</script>

<svelte:head>
	<title>NAF Series</title>
	<meta name="home" content="NAF Series" />
</svelte:head>

<div class="card w-48 shadow-xl py-4  z-[999]" data-popup="loginOption">
  <ul>
    <li class="hover:brightness-[80%]">
      <button
        type="button"
        class="w-full p-2 px-4 flex gap-2 align-middle"
        on:click={() => signOut()}
      >
        <LogOut class="w-6" />
        Déconnexion
      </button>
    </li>
  </ul>
</div>

<Modal />

<Drawer>
	<MovieDrawer />
</Drawer>
<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <a href="/" class="text-xl uppercase text-red-600 font-bold"
          >NAF Series</a
        >
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <button type="button" class="btn-icon p-0 "><Github /></button>
        {#if $page.data.session}
          <button type="button" class="btn-icon p-0 " use:popup={popupMenu}>
            {#if $page.data.session.user?.image}
              <img
                class="w-8 rounded-full"
                alt="G img"
                src={$page.data.session.user.image}
              />
            {:else}
              <User />
            {/if}
          </button>
        {:else}
          <button
            type="button"
            class="btn-icon p-0"
            on:click={() => signIn("google")}
          >
            <img alt="logout" class=" w-6" src="google.svg" />
          </button>
        {/if}
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <!-- Page Route Content -->
  <div class="p-10 h-full">
    <slot />
  </div>
</AppShell>
