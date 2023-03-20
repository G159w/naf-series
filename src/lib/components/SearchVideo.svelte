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
  import { afterNavigate, goto } from "$app/navigation";
  import { enhance } from "$app/forms";

  export let genres: Genre[];

  const getUrlVideoType = () => {
    const type = $page.url.searchParams.get("videoType")?.toLowerCase();
    if (!type || (type !== "movies" && type !== "series")) {
      return undefined;
    }
    return type;
  }
  let videoType: keyof typeof videoComboValues | undefined = getUrlVideoType();

  const getUrlSearchType = () => {
    const type = $page.url.searchParams.get("searchType")?.toLowerCase();
    if (
      !type ||
      (type !== "title" && type !== "stars" && type !== "creators")
    ) {
      return "title";
    }
    return type;
  }
  let searchType: keyof typeof searchTypeComboValues = getUrlSearchType();

  const getUrlGenre = () => {
    const paramGenre = $page.url.searchParams.get("genre")?.toLowerCase();
    return genres.find((genre) => genre.id === paramGenre);
  }
  let genre: Genre | undefined = getUrlGenre();

  const gerUrlSearchText = () => {
    return $page.url.searchParams.get("searchText") || "";
  }
  let searchText: string = gerUrlSearchText();

  afterNavigate(() => {
    genre = getUrlGenre();
    searchText = gerUrlSearchText()
    searchType = getUrlSearchType()
    videoType = getUrlVideoType()
  });

  const videoComboValues = {
    series: "Séries",
    movies: "Films",
  };

  const searchTypeComboValues = {
    title: "Titre",
    stars: "Acteur",
    creators: "Créateur",
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

<div class="card w-48 shadow-xl rounded-md py-2 z-[999]" data-popup="comboSearchType">
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

<form class="shadow-lg">
  <div class="flex flex-row input-group input-group-divider w-fit h-12">
    <button
      type="button"
      class=" ghost-filled w-24"
      use:popup={searchTypeCombobox}
    >
      {searchTypeComboValues[searchType]}
    </button>
    <input
      bind:value={searchText}
      class="w-[300px]"
      type="search"
      placeholder="Recherche ..."
    />
    <span class="divider-vertical h-full" />
    <button
      type="button"
      class={` ghost-filled w-28 p-2 ${genre ? "" : " text-surface-400"}`}
      use:popup={genreComboBox}
    >
      {genre?.name || "Genre ..."}
    </button>
    <span class="divider-vertical h-full" />
    <button
      type="button"
      class={` ghost-filled w-24 p-2 ${videoType ? "" : " text-surface-400"}`}
      use:popup={videoCombobox}
    >
      {videoType ? videoComboValues[videoType] : "Type ..."}
    </button>
    <button
      type="submit"
      class="variant-filled-primary"
      on:click={() => {
        const newUrl = new URL($page.url);
        newUrl?.searchParams?.delete("searchType");
        newUrl?.searchParams?.delete("searchText");
        newUrl?.searchParams?.delete("genre");
        newUrl?.searchParams?.delete("videoType");
        if (searchType && searchType !== "title") {
          newUrl?.searchParams?.set("searchType", searchType);
        }
        if (searchText) {
          newUrl?.searchParams?.set("searchText", searchText);
        }
        if (genre) {
          newUrl?.searchParams?.set("genre", genre.id);
        }
        if (videoType) {
          newUrl?.searchParams?.set("videoType", videoType);
        }
        setTimeout(() => goto(newUrl), 0);
      }}><Search /></button
    >
  </div>
</form>
