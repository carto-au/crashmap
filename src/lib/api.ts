import { unzip, HTTPRangeReader, type ZipEntry } from "unzipit";

// This download is about 8MB so persist for the entire browser session
let zipEntriesIndex: Record<string, ZipEntry> | null = null;

async function getZipEntriesIndex() {
  const reader = new HTTPRangeReader("https://src.carto.au/crashes.api.zip");
  const { entries } = await unzip(reader);
  return entries;
}

export async function getCrashData(crashId: number) {
  if (!zipEntriesIndex) zipEntriesIndex = await getZipEntriesIndex();

  const encodedCrashId = Number(crashId).toString(36); // ZIP API stores crash IDs in b36 to save central dir space

  const json = await zipEntriesIndex[encodedCrashId].json();
  return json;
}
