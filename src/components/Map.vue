<template>
  <div class="map" ref="mapContainer"></div>
</template>

<script>
import {
  Map,
  addProtocol,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
} from "maplibre-gl";
import { Protocol } from "pmtiles";
import { toRaw } from "vue";
import { DEGREE_COLOR_MAP } from "../constants";

let protocol = new Protocol();
addProtocol("pmtiles", protocol.tile);

export default {
  name: "Map",
  data() {
    return {
      map: null,
      filter: [
        "any",
        ["in", "keyTuType", "Pedal cycle"],
        ["in", "otherTuType", "Pedal cycle"],
      ],
    };
  },
  mounted() {
    const handleClick = this.handleClick;
    const filter = this.filter;
    // console.log("F",filter.join(","))

    const initialState = {};

    this.map = new Map({
      container: this.$refs.mapContainer,
      style: "https://styles.carto.au/basemap.json",
      center: [
        /* Centre of Sydney from OpenStreetMap https://www.openstreetmap.org/node/13766899 */
        151.2082848,
        -33.8698439,
      ],
      zoom: 13,
      minZoom: 6,
      maxZoom: 20,
      attributionControl: {
        compact: true,
        customAttribution:
          "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      },
    }).on("load", (e) => {
      const map = e.target;

      // Register this BEFORE the other click handlers so it doesn't set currentCrash to null after setting to value
      map.on("click", handleClick);

      map.addControl(new NavigationControl({}));
      map.addControl(new ScaleControl({}));
      map.addControl(
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
      );

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
          filter: ["all", toRaw(filter), ["==", "deg", degree]],
          paint: {
            "circle-radius": 10,
            "circle-color": color,
          },
        });
        map.on("click", `crashes-${degree}`, handleClick);
      });
    });
  },
  methods: {
    handleClick(e) {
      const feature = e.features?.[0];
      console.log("F", feature);
      if (feature) {
        console.log("Y");
        this.$store.commit("setCurrentCrash", feature);
      } else {
        console.log("N");
        this.$store.commit("setCurrentCrash", null);
      }
    },
  },
};
</script>

<style>
@import "maplibre-gl/dist/maplibre-gl.css";
</style>
