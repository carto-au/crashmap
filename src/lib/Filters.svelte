<script lang="ts">
  import ExpandableFilter from "./ExpandableFilter.svelte";
  import MultiCheckboxes from "./MultiCheckboxes.svelte";
  import { Icon } from "@steeze-ui/svelte-icon";
  import RangeSlider from "svelte-range-slider-pips";
  import InlineColorDot from "./InlineColorDot.svelte";
  import {
    CRASH_DEGREES,
    CrashDegree,
    DEGREE_COLOR_MAP,
    DEGREE_SHORTNAME_MAP,
    MAX_YEAR,
    MIN_YEAR,
    ROAD_USER_ICON_MAP,
    ROAD_USER_SHORTNAME_MAP,
    ROAD_USERS,
    RoadUser,
    RoadUsersMode,
  } from "./constants";
  import type { FilterSpecification } from "maplibre-gl";

  interface Props {
    onfilterchange: (filter: FilterSpecification) => void;
  }
  const { onfilterchange }: Props = $props();

  let degrees = $state([CrashDegree.Fatal, CrashDegree.Serious]);
  let degreesDisplay = $derived(
    degrees.length === 0
      ? "None"
      : degrees.length === CRASH_DEGREES.length
        ? "Any severity"
        : // Filter CRASH_DEGREES rather than just using degrees so it will always display in the 'right' order
          // as MultiCheckboxes makes no guarantees around ordering
          CRASH_DEGREES.filter((d) => degrees.includes(d))
            .map((d) => DEGREE_SHORTNAME_MAP[d])
            .join(", "),
  );

  let roadUsersMode = $state(RoadUsersMode.Or) as RoadUsersMode;
  let roadUsers = $state(ROAD_USERS);
  let roadUsersDisplay = $derived(
    roadUsers.length === 0
      ? "None"
      : roadUsers.length === ROAD_USERS.length
        ? roadUsersMode === RoadUsersMode.And
          ? "All road users"
          : "Any road user"
        : // Filter ROAD_USERS rather than just using roadUsers so it will always display in the 'right' order
          // as MultiCheckboxes makes no guarantees around ordering
          ROAD_USERS.filter((r) => roadUsers.includes(r))
            .map((r) => ROAD_USER_SHORTNAME_MAP[r])
            .join(roadUsersMode === RoadUsersMode.And ? " & " : ", "),
  );

  let dateRange = $state([MIN_YEAR, MAX_YEAR]);
  let dateRangeDisplay = $derived(
    dateRange[0] === dateRange[1]
      ? dateRange[0].toString()
      : dateRange.join("-"),
  );

  let maplibreFilter: FilterSpecification = $derived([
    "all",
    // Injury type filter
    ["in", ["get", "s"], ["literal", degrees]],
    // Road users filter
    [
      roadUsersMode === RoadUsersMode.And ? "all" : "any",
      ...roadUsers.map((r) => ["in", r, ["get", "u"]]),
    ],
    // Date range filter
    [
      "all",
      ["<=", dateRange[0], ["get", "y"]],
      [">=", dateRange[1], ["get", "y"]],
    ],
  ]);

  $effect(() => {
    onfilterchange(maplibreFilter);
  });
</script>

<div>
  <div class="flex flex-col gap-2">
    <ExpandableFilter displayName="Injury type" displayValue={degreesDisplay}>
      <MultiCheckboxes
        options={CRASH_DEGREES}
        onchange={(values) => {
          degrees = values as CrashDegree[];
        }}
        initialValues={degrees}
      >
        {#snippet displayOption(option)}
          <InlineColorDot color={DEGREE_COLOR_MAP[option as CrashDegree]} />
          {DEGREE_SHORTNAME_MAP[option as CrashDegree]}
        {/snippet}
      </MultiCheckboxes>
    </ExpandableFilter>
    <ExpandableFilter displayName="Involving" displayValue={roadUsersDisplay}>
      <fieldset class="mb-1">
        <label>
          <input
            type="radio"
            name="mode"
            onchange={(e) => {
              if (e.currentTarget.checked) roadUsersMode = RoadUsersMode.Or;
            }}
            checked
          /> Any of
        </label>
        &nbsp;
        <label>
          <input
            type="radio"
            name="mode"
            onchange={(e) => {
              if (e.currentTarget.checked) roadUsersMode = RoadUsersMode.And;
            }}
          /> All of
        </label>
      </fieldset>
      <MultiCheckboxes
        options={ROAD_USERS}
        onchange={(values) => {
          roadUsers = values as RoadUser[];
        }}
        initialValues={roadUsers}
      >
        {#snippet displayOption(option)}
          <div class="inline-flex items-center gap-1">
            <Icon
              src={ROAD_USER_ICON_MAP[option as RoadUser]}
              theme="rounded"
              class="size-4"
            />
            {ROAD_USER_SHORTNAME_MAP[option as RoadUser]}
          </div>
        {/snippet}
      </MultiCheckboxes>
    </ExpandableFilter>
    <ExpandableFilter displayName="Date range" displayValue={dateRangeDisplay}>
      <RangeSlider
        min={MIN_YEAR}
        max={MAX_YEAR}
        range
        float
        values={[MIN_YEAR, MAX_YEAR]}
        on:stop={(e) => {
          console.log("E", JSON.stringify(e.detail));
          dateRange = e.detail.values;
        }}
      />
    </ExpandableFilter>
  </div>
</div>
