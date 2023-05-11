<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { Drawer, Modal, storePopup } from '@skeletonlabs/skeleton';
	import { AppShell, AppBar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { User, LogOut } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { onMount } from 'svelte';
	import LottieGithub from '$lib/assets/lottie/github.json';
	import lottie from 'lottie-web';
	import VideoDrawer from '$lib/components/VideoDrawer/VideoDrawer.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	let popupMenu: PopupSettings = {
		event: 'click',
		target: 'loginOption',
		placement: 'bottom',
		// Close the popup when the item is clicked
		closeQuery: '.listbox-item'
	};

	let animationContainer: HTMLElement;

	onMount(() => {
		lottie.loadAnimation({
			container: animationContainer,
			animationData: LottieGithub,
			loop: true,
			autoplay: true
		});
	});
</script>

<svelte:head>
	<title>NAF Series</title>
	<meta name="home" content="NAF Series" />
</svelte:head>

<div class="card w-48 shadow-xl py-4 z-[999]" data-popup="loginOption">
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
	<VideoDrawer />
</Drawer>
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" class="pl-10 text-xl uppercase text-red-600 font-bold">
					<img alt="NafSeries" src="/nafseries.gif" class=" w-36" />
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a bind:this={animationContainer} href="https://github.com/G159w/naf-series" type="button" class="btn btn-icon w-8">
				</a>
				{#if $page.data.session}
					<button type="button" class="btn-icon p-0" use:popup={popupMenu}>
						{#if $page.data.session.user?.image}
							<img class="w-8 rounded-full" alt="G img" src={$page.data.session.user.image} />
						{:else}
							<User />
						{/if}
					</button>
				{:else}
					<button type="button" class="btn-icon p-0" on:click={() => signIn('google')}>
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
