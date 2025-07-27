export const listIfExists = (items: unknown[]) =>
  items.filter((x) => !!x).join(", ");
