<script lang="ts">
  import type { Snippet } from "svelte";
  import { SvelteSet } from "svelte/reactivity";

  interface Props {
    initialValues: unknown[];
    options: unknown[];
    displayOption: Snippet<[unknown]>;
    onchange: (values: unknown[]) => void;
  }

  let { initialValues, options, displayOption, onchange }: Props = $props();

  let values = $state(new SvelteSet(initialValues));

  $effect(() => {
    onchange(Array.from(values));
    values; // Needed to get Svelte dependency detected
  });
</script>

<div class="grid grid-cols-2">
  {#each options as option}
    <label>
      <input
        type="checkbox"
        onchange={(e) => {
          e.currentTarget.checked ? values.add(option) : values.delete(option);
        }}
        checked={values.has(option)}
      />
      {@render displayOption(option)}
    </label>
  {/each}
</div>
