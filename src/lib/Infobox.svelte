<script lang="ts">
  import { Panel } from "@carto-au/svelte";
  import type { Feature, FilterSpecification } from "maplibre-gl";
  import WelcomeContent from "./WelcomeContent.svelte";
  import CrashDetails from "./CrashDetails.svelte";
  import Filters from "./Filters.svelte";

  interface Props {
    features: Feature[];
    onfilterchange: (filter: FilterSpecification) => void;
  }

  let { features, onfilterchange }: Props = $props();

  // Only start expanded if they've never visited the site before (or not since the latest update)
  const showHideableInitially =
    localStorage.getItem("lastVisitedVersion") !== "1";

  let showCrashDetails = $state(false);

  $effect(() => {
    showCrashDetails = features.length > 0;
    // Run when features array changes.
    // Since it gets set in a callback from the map, the actual array reference WILL change so no issues.
    features;
  });
</script>

<Panel
  hideableName="more information"
  {showHideableInitially}
  showCloseable={showCrashDetails}
  onCloseableClose={() => {
    showCrashDetails = false;
  }}
>
  {#snippet staticHeader()}
    <div class="p-3 sm:pb-0">
      <h1 class="text-3xl font-bold">
        CrashMap<span class="text-base">NSW</span>
      </h1>
    </div>
  {/snippet}

  {#snippet staticFooter()}
    <div class="px-3 py-1.5 sm:pb-3">
      <div class="mb-3 text-xs">
        Built by <a href="https://carto.au" target="_blank">Carto Australia</a>.
        Data from
        <a
          href="https://opendata.transport.nsw.gov.au/dataset/nsw-crash-data"
          target="_blank">Transport NSW</a
        >. In beta 🚧
      </div>
      <Filters {onfilterchange} />
    </div>
  {/snippet}

  {#snippet hideable()}
    <div class="p-3">
      <WelcomeContent />
    </div>
  {/snippet}

  {#snippet closeable()}
    {#if features[0]}
      <div class="p-3">
        <CrashDetails feature={features[0]} />
      </div>
    {/if}
  {/snippet}
</Panel>
