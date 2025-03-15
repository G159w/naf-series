<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Dialog from '$lib/components/ui/dialog';
  import { queryHandler } from '$lib/tanstack-query';
  import { createMutation, useQueryClient } from '@tanstack/svelte-query';
  import { toast } from 'svelte-sonner';

  import { Button } from '../ui/button';

  export let open: boolean;
  export let videoClubId: string;
  export let videoClubName: string;

  let isDeleting = false;

  const queryClient = useQueryClient();

  const deleteVideoClubMutation = createMutation({
    ...queryHandler({ fetch }).videoClubs.delete(),
    onError: () => {
      isDeleting = false;
      toast.error("Une erreur s'est produite lors de la suppression du VideoClub");
    },
    onSuccess: () => {
      isDeleting = false;
      open = false;
      // Invalidate the layout video clubs query
      queryClient.invalidateQueries({ queryKey: ['videoClubs', 'getAll'] });
      toast.success('VideoClub supprimé');
      goto('/');
    }
  });

  function handleDelete() {
    isDeleting = true;
    $deleteVideoClubMutation.mutate({ videoClubId });
  }

  function handleOpenChange(isOpen: boolean) {
    open = isOpen;
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Supprimer le VideoClub</Dialog.Title>
      <Dialog.Description>
        Êtes-vous sûr de vouloir supprimer le VideoClub <span class="font-bold"
          >{videoClubName}</span
        > ? Cette action est irréversible.
      </Dialog.Description>
    </Dialog.Header>
    <div class="flex justify-end gap-4 pt-6">
      <Button type="button" variant="outline" onclick={() => (open = false)}>Annuler</Button>
      <Button type="button" variant="destructive" onclick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Suppression...' : 'Supprimer'}
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
