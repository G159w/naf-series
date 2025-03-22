<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Dialog from '$lib/components/ui/dialog';
  import { queryHandler } from '$lib/tanstack-query';
  import { createMutation, useQueryClient } from '@tanstack/svelte-query';
  import { toast } from 'svelte-sonner';

  import { Button } from '../ui/button';

  export let open: boolean;

  let name = '';
  let isSubmitting = false;
  let error = '';

  const queryClient = useQueryClient();

  const createVideoClubMutation = createMutation({
    ...queryHandler({ fetch }).videoClub.create(),
    onError: () => {
      error = "Une erreur s'est produite lors de la création du VideoClub";
      isSubmitting = false;
      toast.error(error);
    },
    onSuccess: (data) => {
      isSubmitting = false;
      open = false;
      toast.success('✅ VideoClub créé');

      // Invalidate the layout video clubs query
      queryClient.refetchQueries({
        queryKey: queryHandler({ fetch }).videoClub.findAll().queryKey
      });
      if (data.data) {
        goto(`/videoclubs/${data.data.id}`);
      }
    }
  });

  function handleSubmit() {
    if (!name) {
      error = 'Le nom du VideoClub est obligatoire';
      return;
    }

    error = '';
    isSubmitting = true;

    $createVideoClubMutation.mutate({ name: name });
  }

  function handleOpenChange(isOpen: boolean) {
    open = isOpen;
    if (!isOpen) {
      name = '';
      error = '';
    }
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Créer un VideoClub</Dialog.Title>
      <Dialog.Description>
        Créez un nouvel espace pour partager et découvrir des films et séries avec vos amis.
      </Dialog.Description>
    </Dialog.Header>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="name" class="text-right"> Nom </label>
          <input
            id="name"
            bind:value={name}
            class="col-span-3 h-10 rounded-md border border-input px-3 py-2"
            placeholder="Nom du VideoClub"
            type="text"
          />
        </div>
        {#if error}
          <p class="text-sm text-red-500">{error}</p>
        {/if}
      </div>
      <Dialog.Footer>
        <Button type="button" variant="outline" onclick={() => (open = false)}>Annuler</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer'}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
