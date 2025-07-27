<script lang="ts">
  interface Props {
    color: string;
  }

  const { color }: Props = $props();
</script>

<span style={`color: ${color}`}> ● </span>
