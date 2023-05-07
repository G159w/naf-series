<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import AddVideoModal from './AddVideoModal.svelte';

	const modalComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: AddVideoModal,
		// Add the component properties as key/value pairs
		props: { background: 'bg-red-500' },
		// Provide a template literal for the default component slot
		slot: '<p>Skeleton</p>'
	};

	const d: ModalSettings = {
		type: 'component',
		component: modalComponent
	};
</script>

<button
	class="btn-icon p-0 variant-filled-primary btn-icon-lg"
	on:click={() => modalStore.trigger(d)}><Plus /></button
>
