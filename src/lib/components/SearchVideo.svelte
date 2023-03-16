<script lang="ts">
  import { Search } from "lucide-svelte";
  import {
    ListBox,
    ListBoxItem,
    popup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";
  import type { Genre } from "@prisma/client";
  import { page } from "$app/stores";

  export let genres: Genre[];

  let videoType: keyof typeof videoComboValues | undefined = (() => {
    const type = $page.url.searchParams.get("videoType")?.toLowerCase();
    if (!type || (type !== "movies" && type !== "series")) {
      return undefined;
    }
    return type;
  })();

  let searchType: keyof typeof searchTypeComboValues = (() => {
    const type = $page.url.searchParams.get("searchType")?.toLowerCase();
    if (!type || (type !== "title" && type !== "actor" && type !== "actor")) {
      return 'title';
    }
    return type;
  })();

  let genre: Genre | undefined = (() => {
    const paramGenre = $page.url.searchParams.get("genre")?.toLowerCase();
    return genres.find((genre) => genre.name.toLowerCase() === paramGenre)
  })();;

  const videoComboValues = {
    series: "Séries",
    movies: "Films",
  };

  const searchTypeComboValues = {
    title: "Titre",
    actor: "Acteur",
    creator: "Créateur",
  };

  const createComboBoxSettings = (name: string): PopupSettings => {
    return {
      event: "click",
      target: name,
      placement: "bottom",
      closeQuery: ".listbox-item",
    };
  };
  let videoCombobox = createComboBoxSettings("comboVideoType");
  let searchTypeCombobox = createComboBoxSettings("comboSearchType");
  let genreComboBox = createComboBoxSettings("comboGenre");
</script>

<div
  class="card w-48 shadow-xl rounded-md py-2 z-[999]"
  data-popup="comboVideoType"
>
  <ListBox rounded="rounded-none">
    <ListBoxItem bind:group={videoType} name={"Nothing"} value={undefined}>
      Tout
    </ListBoxItem>
    {#each Object.entries(videoComboValues) as [key, value]}
      <ListBoxItem bind:group={videoType} name={key} value={key}>
        {value}
      </ListBoxItem>
    {/each}
  </ListBox>
  <div class="arrow bg-surface-100-800-token" />
</div>

<div class="card w-48 shadow-xl rounded-md py-2" data-popup="comboSearchType">
  <ListBox rounded="rounded-none">
    {#each Object.entries(searchTypeComboValues) as [key, value]}
      <ListBoxItem bind:group={searchType} name={key} value={key}>
        {value}
      </ListBoxItem>
    {/each}
  </ListBox>
  <div class="arrow bg-surface-100-800-token" />
</div>

<div
  class="card w-48 shadow-xl rounded-md py-2 z-[999] max-h-72 overflow-scroll"
  data-popup="comboGenre"
>
  <ListBox rounded="rounded-none">
    <ListBoxItem bind:group={genre} name={"Nothing"} value={undefined}>
      Tout
    </ListBoxItem>
    {#each genres as genreCombo}
      <ListBoxItem bind:group={genre} name={genreCombo.id} value={genreCombo}>
        {genreCombo.name}
      </ListBoxItem>
    {/each}
  </ListBox>
  <div class="arrow bg-surface-100-800-token" />
</div>

<div class="flex flex-row input-group input-group-divider w-fit h-12">
  <button class=" ghost-filled w-24" use:popup={searchTypeCombobox}>
    {searchTypeComboValues[searchType]}
  </button>
  <input class="w-[300px]" type="search" placeholder="Recherche ..." />
  <span class="divider-vertical h-full" />
  <button
    class={` ghost-filled w-28 p-2 ${genre ? "" : " text-surface-400"}`}
    use:popup={genreComboBox}
  >
    {genre?.name || "Genre ..."}
  </button>
  <span class="divider-vertical h-full" />
  <button
    class={` ghost-filled w-24 p-2 ${videoType ? "" : " text-surface-400"}`}
    use:popup={videoCombobox}
  >
    {videoType ? videoComboValues[videoType] : "Type ..."}
  </button>
  <button class="variant-filled-primary"><Search /></button>
</div>
