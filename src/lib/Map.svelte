<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import maplibre from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import * as pmtiles from "pmtiles";
  import { DEGREE_COLOR_MAP } from "$lib/constants";
  import type { Feature } from "$lib/types";
  // Add pmtiles protocol handling
  const protocol = new pmtiles.Protocol();
  maplibre.addProtocol("pmtiles", protocol.tile);

  // TODO: Make reactive
  const filter = [
    "any",
    ["in", "keyTuType", "Pedal cycle"],
    ["in", "otherTuType", "Pedal cycle"],
  ];

  interface Props {
    onfeatures: (features: Feature[]) => void;
  }

  const { onfeatures }: Props = $props();

  let map: maplibre.Map;
  let mapContainer: HTMLDivElement;

  const handleClick = (e: any) => onfeatures(e.features ?? []);

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

    // Register this BEFORE the other click handlers so it doesn't set currentCrash to null after setting to value
    map.on("click", handleClick);

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

      Object.entries(DEGREE_COLOR_MAP).forEach(([degree, color]) => {
        map.addLayer({
          id: `crashes-${degree}`,
          type: "circle",
          source: "crashes",
          "source-layer": "crashes",
          filter: ["all", filter, ["==", "deg", degree]],
          paint: {
            "circle-radius": 10,
            "circle-color": color,
          },
        });
        map.on("click", `crashes-${degree}`, handleClick);
      });
    });
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
