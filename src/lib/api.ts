import {
  asyncBufferFromUrl,
  parquetReadObjects,
  type AsyncBuffer,
} from "hyparquet";

const API_FILE_URL = "https://src.carto.au/crashes.parquet";

// Cache file object within session to save HEAD on requests
let file: AsyncBuffer | null = null;

export async function getCrashData(parquetRowNum: number) {
  if (!file) file = await asyncBufferFromUrl({ url: API_FILE_URL });

  const rows = await parquetReadObjects({
    file,
    columns: ["data"],
    rowStart: parquetRowNum,
    rowEnd: parquetRowNum + 1,
  });

  const parsedData = JSON.parse(rows[0].data);

  return parsedData;
}
