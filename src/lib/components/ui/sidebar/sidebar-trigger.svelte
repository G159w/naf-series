<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils/ui.js';
  import PanelLeft from 'lucide-svelte/icons/panel-left';

  import { useSidebar } from './context.svelte.js';

  let {
    class: className,
    onclick,
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof Button> & {
    onclick?: (e: MouseEvent) => void;
  } = $props();

  const sidebar = useSidebar();
</script>

<Button
  type="button"
  onclick={(e) => {
    onclick?.(e);
    sidebar.toggle();
  }}
  data-sidebar="trigger"
  variant="ghost"
  size="icon"
  class={cn('h-7 w-7', className)}
  {...restProps}
>
  <PanelLeft />
  <span class="sr-only">Toggle Sidebar</span>
</Button>
