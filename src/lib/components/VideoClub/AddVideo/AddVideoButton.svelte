<script lang="ts">
	import { Clapperboard } from 'lucide-svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import AddVideoModal from './AddVideoModal.svelte';
	import FabButton from '../../common/FabButton.svelte';

	const modalComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: AddVideoModal,
		// Add the component properties as key/value pairs
		props: { background: 'bg-red-500', videoClubId: '452151' },
		// Provide a template literal for the default component slot
		slot: '<p>Skeleton</p>'
	};

	const d: ModalSettings = {
		type: 'component',
		component: modalComponent
	};
</script>

<FabButton on:click={() => modalStore.trigger(d)}>
	<span slot="description"> Ajouter un film / série </span>
	<span slot="icon">
		<Clapperboard />
	</span>
</FabButton>