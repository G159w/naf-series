<script lang="ts">
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  import { cn } from '$lib/utils/ui.js';

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement> = $props();
</script>

<li
  bind:this={ref}
  data-sidebar="menu-item"
  class={cn('group/menu-item relative', className)}
  {...restProps}
>
  {@render children?.()}
</li>
