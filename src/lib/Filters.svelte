<script lang="ts">
  import ExpandableFilter from "./ExpandableFilter.svelte";
  import MultiCheckboxes from "./MultiCheckboxes.svelte";
  import { Icon } from "@steeze-ui/svelte-icon";
  import InlineColorDot from "./InlineColorDot.svelte";
  import {
    CRASH_DEGREES,
    CrashDegree,
    DEGREE_COLOR_MAP,
    DEGREE_SHORTNAME_MAP,
    ROAD_USER_ICON_MAP,
    ROAD_USER_SHORTNAME_MAP,
    ROAD_USERS,
    RoadUser,
  } from "./constants";
  import type { FilterSpecification } from "maplibre-gl";

  interface Props {
    onfilterchange: (filter: FilterSpecification) => void;
  }
  const { onfilterchange }: Props = $props();

  let degrees = $state(CRASH_DEGREES);
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

  let roadUsers = $state(ROAD_USERS);
  let roadUsersDisplay = $derived(
    roadUsers.length === 0
      ? "None"
      : roadUsers.length === ROAD_USERS.length
        ? "Any road user"
        : // Filter ROAD_USERS rather than just using roadUsers so it will always display in the 'right' order
          // as MultiCheckboxes makes no guarantees around ordering
          ROAD_USERS.filter((r) => roadUsers.includes(r))
            .map((r) => ROAD_USER_SHORTNAME_MAP[r])
            .join(", "),
  );

  let maplibreFilter: FilterSpecification = $derived([
    "all",
    ["any", ...roadUsers.map((r) => ["in", r, ["get", "u"]])],
    ["in", ["get", "s"], ["literal", degrees]],
  ]);

  $effect(() => {
    onfilterchange(maplibreFilter);
  });
</script>

<div>
  <div class="flex flex-col gap-2">
    <ExpandableFilter displayName="Severity" displayValue={degreesDisplay}>
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
  </div>
</div>
