<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import Star from "./Star.svelte";

  // User rating states
  export let rating: number | null = null;
  export let onRate: ((rating: number) => void) | undefined;
  let hoverRating: number | null = null;

  let makeUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);
  // id for unique component is not a prop anymore

  $: base = (rating && rating > (hoverRating || 0) ? rating : hoverRating) || 0
  $: full = Math.floor(base);
  $: half = base - full;
  $: empty = Math.floor(5 - base);
  $: fullArr = Array(full).fill(1);
  $: halfArr = half !== 0 ? [half] : [];
  $: emptyArr = Array(empty).fill(0);
  $: stars = fullArr.concat(halfArr).concat(emptyArr);

</script>

<div class="flex flex-row  w-fit">
  {#each stars as star, i}
    <Star
      full={star}
      onClick={(num) => { rating = (i + 0.5 + num); onRate?.(rating) }}
      onHover={(num) => hoverRating = (i + 0.5 +  num)}
      on:mouseleave={() => hoverRating = null}
    />
  {/each}
</div>
