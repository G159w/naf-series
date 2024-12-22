<script lang="ts">
  import { cn } from '$lib/utils/ui.js';
  import { Avatar as AvatarPrimitive } from 'bits-ui';

  let {
    alt,
    class: className,
    ref = $bindable(null),
    src,
    ...restProps
  }: AvatarPrimitive.ImageProps = $props();
</script>

<AvatarPrimitive.Image
  bind:ref
  {src}
  {alt}
  class={cn('aspect-square h-full w-full', className)}
  {...restProps}
/>
