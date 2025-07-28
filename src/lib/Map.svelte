<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import maplibre, { type FilterSpecification } from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import * as pmtiles from "pmtiles";
  import { DEGREE_COLOR_MAP } from "$lib/constants";
  import type { Feature } from "$lib/types";
  // Add pmtiles protocol handling
  const protocol = new pmtiles.Protocol();
  maplibre.addProtocol("pmtiles", protocol.tile);

  interface Props {
    filter: FilterSpecification | undefined;
    onfeatures: (features: Feature[]) => void;
  }

  const { filter, onfeatures }: Props = $props();

  let map: maplibre.Map;
  let mapContainer: HTMLDivElement;

  onMount(() => {
    map = new maplibre.Map({
      container: mapContainer,
      style: "https://styles.carto.au/basemap.json",
      center: [
        /* Centre of Sydney from OpenStreetMap https://www.openstreetmap.org/node/13766899 */
        151.2082848,
        -33.8698439,
      ],
      zoom: 13,
      minZoom: 6,
      maxZoom: 20,
      pitch: 48,
      // hash:true,
      attributionControl: {
        compact: true,
        customAttribution:
          "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      },
    });

    // Register this BEFORE the other click handlers so it doesn't set features to [] AFTER setting to a real value
    map.on("click", () => onfeatures([]));

    // Add controls
    map.addControl(new maplibre.NavigationControl({}));
    map.addControl(new maplibre.ScaleControl({}));
    map.addControl(
      new maplibre.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
    );

    map.on("load", () => {
      map.addSource("crashes", {
        type: "vector",
        url: "pmtiles://https://src.carto.au/crashes.pmtiles",
      });

      map.addLayer({
        id: "crashes",
        type: "circle",
        source: "crashes",
        "source-layer": "crashes",
        filter,
        paint: {
          "circle-radius": 10,
          "circle-opacity": 0.8,
          "circle-color": [
            "match",
            ["get", "s"],
            ...Object.entries(DEGREE_COLOR_MAP).flatMap(([degree, color]) => [
              Number(degree),
              color,
            ]),
            "black",
          ],
        },
      });
      map.on("click", "crashes", (e) => onfeatures(e.features ?? []));
    });
  });

  $effect(() => {
    if (map.loaded()) map.setFilter("crashes", filter);
    filter; // Needed for Svelte to detect dependency
  });

  onDestroy(() => {
    map.remove();
  });
</script>

<div class="map" id="map" bind:this={mapContainer} />

<style>
  .map {
    position: relative;
    flex-grow: 1;
  }
</style>
