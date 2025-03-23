<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';

  type Props = {
    inviteId: string;
    open?: boolean;
    videoClubId: string;
  };

  let { inviteId, open = $bindable(false), videoClubId }: Props = $props();

  // Generate the invitation URL
  const inviteUrl = $derived(`${$page.url.origin}/videoclubs/${videoClubId}/invite/${inviteId}`);

  // Function to copy the invitation URL to clipboard
  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Lien d'invitation copié dans le presse-papier");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de copier le lien d'invitation");
    } finally {
      open = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Inviter des amis au VideoClub</Dialog.Title>
      <Dialog.Description>
        Partagez ce lien avec vos amis pour les inviter à rejoindre votre VideoClub.
      </Dialog.Description>
    </Dialog.Header>
    <div class="my-4">
      <div class="flex items-center rounded-md border p-2">
        <span class="w-80 flex-1 truncate">{inviteUrl}</span>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (open = false)}>Annuler</Button>
      <Button onclick={copyInviteLink}>Copier le lien</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
