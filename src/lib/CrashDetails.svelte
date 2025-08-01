<script lang="ts">
  import type { Feature } from "./types";
  import InlineColorDot from "./InlineColorDot.svelte";
  import { listIfExists } from "./utils";
  import { CrashDegree, DEGREE_COLOR_MAP } from "./constants";
  import { getCrashData } from "./api";

  interface Props {
    feature: Feature;
  }

  const { feature }: Props = $props();

  const isDev = window.location.hostname === "localhost";

  let crashData = $state(null) as null | Record<string, any>;
  let error = $state(false);

  $effect(() => {
    getCrashData(feature.properties.p) // Parquet row num property
      .then((data) => {
        crashData = data;
      })
      .catch((err) => {
        console.error(err);
        error = true;
      });
  });

  let crash = $derived(
    crashData
      ? ({
          ...crashData,
          id: feature.id,
          lon: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
        } as Record<string, any>)
      : null,
  );

  let streetLightingText = $derived(
    {
      On: "Street lighting on",
      Off: "Street lighting off",
      Nil: "No street lighting",
    }[crash?.streetLighting as string] ?? "Street lighting unknown",
  );
  let surfaceConditionText = $derived(
    {
      Dry: "Road surface dry",
      Wet: "Road surface wet",
      "Snow or ice": "Road surface snowy or icy",
      "Unknown / not stated": null,
    }[crash?.surfaceCondition as string] ?? "Road surface condition unknown",
  );
</script>

{#if error}
  Error: Failed to load crash details!
{:else if !crash}
  Loading crash details&hellip;
{:else}
  <div class="textual-content">
    <h3>
      Crash on {crash.streetName}, {crash.suburb} in
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
          {#if crash.fatalities}
            <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.Fatal]} />
            {crash.fatalities}
            {crash.fatalities > 1 ? " fatalities" : " fatality"} (<a
              href={`https://www.google.com/search?q=${encodeURIComponent(`Fatality ${crash.streetName} ${crash.suburb} ${crash.month} ${crash.year}`)}`}
              target="_blank">search ↗</a
            >)
          {/if}
          {#if crash.seriousInjuries}
            <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.Serious]} />
            {crash.seriousInjuries} seriously injured
          {/if}
          {#if crash.moderateInjuries}
            <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.Moderate]} />
            {crash.moderateInjuries} moderately injured
          {/if}
          {#if crash.minorInjuries}
            <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.Minor]} />
            {crash.minorInjuries} minorly injured
          {/if}
          {#if crash.fatalities + crash.seriousInjuries + crash.moderateInjuries + crash.minorInjuries === 0}
            No injuries
          {/if}
        </dd>
      </div>
      <div>
        <dt>Road user movement</dt>
        <dd>{crash.rumDescription}</dd>
      </div>
      <img
        class="rounded-lg border"
        src={`/rum/${crash.rumCode}.png`}
        alt={crash.rumDescription}
        width="141"
        height="105"
      />
    </dl>
    {#each crash.units as unit (unit.id)}
      <div class="mb-2 rounded-lg border border-gray-300 p-2">
        <h5 class="font-bold">
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
{/if}
