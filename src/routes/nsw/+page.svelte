<script lang="ts">
  import Infobox from "$lib/Infobox.svelte";
  import Map from "$lib/Map.svelte";
  import type { Feature } from "$lib/types";
  import type { FilterSpecification } from "maplibre-gl";
  import { onMount } from "svelte";

  onMount(() => {
    // Future proof with a version so we can perform 'migrations' or show explainers
    // about a change in visualisation to users who were used to something else.
    //
    // For now, we're using the presence of this (don't care about the number) to see
    // if the user has visited the site before, so if we should start the infobox as
    // expanded or collapsed.
    //
    // This will always get set *after* the initial render (due to being in onMount).
    localStorage.setItem("lastVisitedVersion", "1");
  });

  let features: Feature[] = $state([]);
  let maplibreFilter: FilterSpecification | undefined = $state(undefined);
</script>

<main class="flex flex-col select-none">
  <Infobox
    {features}
    onfilterchange={(filter) => {
      maplibreFilter = filter;
    }}
  />
  <Map
    filter={maplibreFilter}
    onfeatures={(f) => {
      features = f;
    }}
  />
</main>

<style>
  main {
    height: 100vh;
    /* See https://web.dev/viewport-units/ */
    height: 100dvh;
  }
</style>
