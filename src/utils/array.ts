import { MultipartFile } from "@fastify/multipart";

export type LoadedFile = MultipartFile & { content: Buffer };

export function splitArrayIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }

  return result;
}

export async function filesGeneratorToArray(files: AsyncIterableIterator<MultipartFile>) {
  const out: LoadedFile[] = [];
  let idx = 0;
  for await (const file of files) {
    console.log(`Loading file #${++idx}...`);
    out.push({ ...file, content: await file.toBuffer() });
  }
  return out;
}
