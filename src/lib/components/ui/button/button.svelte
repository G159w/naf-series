<script lang="ts" module>
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  import { tv, type VariantProps } from 'tailwind-variants';

  export const buttonVariants = tv({
    base: 'focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    defaultVariants: {
      size: 'default',
      variant: 'default'
    },
    variants: {
      size: {
        default: 'h-9 px-4 py-2',
        icon: 'h-9 w-9',
        lg: 'h-10 rounded-md px-8',
        sm: 'h-8 rounded-md px-3 text-xs'
      },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        outline:
          'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm'
      }
    }
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
  export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

  export type ButtonProps = WithElementRef<HTMLAnchorAttributes> &
    WithElementRef<HTMLButtonAttributes> & {
      size?: ButtonSize;
      variant?: ButtonVariant;
    };
</script>

<script lang="ts">
  import { cn } from '$lib/utils/ui.js';

  let {
    children,
    class: className,
    href = undefined,
    ref = $bindable(null),
    size = 'default',
    type = 'button',
    variant = 'default',
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a bind:this={ref} class={cn(buttonVariants({ size, variant }), className)} {href} {...restProps}>
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    class={cn(buttonVariants({ size, variant }), className)}
    {type}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
