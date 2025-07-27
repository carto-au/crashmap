<script lang="ts">
  import type { Feature } from "./types";
  import InlineColorDot from "./InlineColorDot.svelte";
  import { listIfExists } from "./utils";

  interface Props {
    feature: Feature;
  }

  const { feature }: Props = $props();

  const isDev = window.location.hostname === "localhost";

  let crash = $derived(
    feature
      ? {
          ...feature.properties,
          lon: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          units: JSON.parse(feature.properties.units),
        }
      : null,
  );

  let streetLightingText = $derived(
    {
      On: "Street lighting on",
      Off: "Street lighting off",
      Nil: "No street lighting",
    }[crash.streetLighting as string] ?? "Street lighting unknown",
  );
  let surfaceConditionText = $derived(
    {
      Dry: "Road surface dry",
      Wet: "Road surface wet",
      "Snow or ice": "Road surface snowy or icy",
      "Unknown / not stated": null,
    }[crash.surfaceCondition as string] ?? "Road surface condition unknown",
  );
</script>

<div>
  <h3>
    Cycle crash on {crash.streetName}, {crash.suburb} in
    {crash.month}
    {crash.year}
  </h3>

  <h4>Conditions:</h4>
  <dl>
    <div>
      <dt>Lighting</dt>
      <dd>{crash.naturalLighting}, {streetLightingText}</dd>
    </div>

    <div>
      <dt>Time</dt>
      <dd>{crash.time} on a {crash.dayOfWeek}</dd>
    </div>

    <div>
      <dt>Weather</dt>
      <dd>{crash.weather}, {surfaceConditionText}</dd>
    </div>
  </dl>

  <h4>Location info:</h4>

  <dl>
    <div>
      <a
        href={`http://maps.google.com/maps?layer=c&cbll=${crash.lat},${crash.lon}`}
        target="_blank"
      >
        Inspect on Google Street View ↗
      </a>
    </div>

    <div>
      <dt>Location type</dt>
      <dd>{crash.locationType}</dd>
    </div>

    <div>
      <dt>Road type</dt>
      <dd>{crash.speedLimit}, {crash.roadSurface}</dd>
    </div>

    <div>
      <dt>Features involved</dt>
      <dd>
        {listIfExists([
          crash.permanentFeat,
          crash.temporaryFeat,
          crash.hazardousFeat,
        ]) || "None"}
      </dd>
    </div>
  </dl>

  <h4>Crash details:</h4>

  <dl>
    <div>
      <dt>Impact</dt>
      <dd>
        {listIfExists([
          crash.fatalities &&
            crash.fatalities +
              (crash.fatalities > 1 ? " fatalities" : " fatality"),
          crash.seriousInjuries && crash.seriousInjuries + " seriously injured",
          crash.moderateInjuries &&
            crash.moderateInjuries + " moderately injured",
          crash.minorInjuries && crash.minorInjuries + " minorly injured",
        ]) || "None"}
      </dd>
    </div>
    <div>
      <dt>Road user movement</dt>
      <dd>{crash.rumDescription}</dd>
    </div>
    <img
      class="border"
      src={`/rum/${crash.rumCode}.png`}
      alt={crash.rumDescription}
      width="141"
      height="105"
    />
  </dl>

  {#each crash.units as unit (unit.id)}
    <div class="mb-2 rounded-lg border border-gray-800 p-2">
      <h5>
        <u>Participant {unit.id}</u>
        <InlineColorDot
          color={unit.role === "Key traffic unit"
            ? "#630"
            : unit.role === "Other traffic unit"
              ? "#0066fd"
              : "transparent"}
        />
      </h5>
      <dl>
        <div>
          <dt>Type</dt>
          <dd>{unit.type}</dd>
        </div>
        <div>
          <dt>Direction prior to crash</dt>
          <dd>{unit.direction} on {unit.street}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{unit.status}</dd>
        </div>
      </dl>
    </div>
  {/each}

  {#if isDev}
    <details>
      <summary>All attributes (dev)</summary>
      <pre>{JSON.stringify(crash, null, 2)}</pre>
    </details>
  {/if}
</div>

<!-- <style lang="scss">

	.crash-details {
		pre {
			overflow-x: auto;
		}

		h3 {
			margin-top: 0;
		}

		h4 {
			font-size: 1.05rem;
			margin-bottom: 0.5rem;
		}

		h5 {
			font-size: 0.9rem;
			margin-top: 0;
			margin-bottom: 0.5em;
		}
	}
</style> -->
