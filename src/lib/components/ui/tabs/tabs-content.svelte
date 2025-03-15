<script lang="ts">
  import { cn } from '$lib/utils/ui.js';
  import { Tabs as TabsPrimitive } from 'bits-ui';

  let {
    class: className,
    ref = $bindable(null),
    value,
    ...restProps
  }: TabsPrimitive.ContentProps = $props();
</script>

<TabsPrimitive.Content
  bind:ref
  class={cn(
    'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    className
  )}
  {value}
  {...restProps}
/>
