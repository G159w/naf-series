<script lang="ts">
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/ui.js';

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  class={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
  {...restProps}
>
  {@render children?.()}
</div>
