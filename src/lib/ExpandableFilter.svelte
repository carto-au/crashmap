<script lang="ts">
  import type { Snippet } from "svelte";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { ChevronDown } from "@steeze-ui/heroicons";
  import { cn, transitions } from "@carto-au/svelte";

  interface Props {
    displayName: string;
    displayValue: string;
    children: Snippet;
  }

  let { displayName, displayValue, children }: Props = $props();

  let expanded = $state(false);
</script>

<div>
  <button
    class="flex w-full cursor-pointer items-center gap-1 text-left opacity-80"
    onclick={() => {
      expanded = !expanded;
    }}
  >
    <div class="w-30 shrink-0 font-semibold">
      {displayName}
    </div>
    <div class="grow truncate font-medium">
      {displayValue}
    </div>
    <div>
      <Icon
        src={ChevronDown}
        theme="micro"
        class={cn(
          "size-6 origin-center transition-transform",
          expanded ? "rotate-180" : "rotate-0",
        )}
      />
    </div>
  </button>
  {#if expanded}
    <div transition:transitions.expand>
      <div class="pt-1">{@render children()}</div>
    </div>
  {/if}
</div>
