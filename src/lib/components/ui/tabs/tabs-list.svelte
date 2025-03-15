<script lang="ts">
  import { cn } from '$lib/utils/ui.js';
  import { Tabs as TabsPrimitive } from 'bits-ui';

  let { class: className, ref = $bindable(null), ...restProps }: TabsPrimitive.ListProps = $props();
</script>

<TabsPrimitive.List
  bind:ref
  class={cn(
    'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
    className
  )}
  {...restProps}
/>
