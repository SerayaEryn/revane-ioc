import { stat, readdir } from "node:fs/promises";
import { join } from "node:path";

export async function recursiveReaddir(path: string): Promise<string[]> {
  let list: string[] = [];
  const files = await readdir(path);

  await Promise.all(
    files.map(async (file: string) => {
      const filePath = join(path, file);
      const stats = await stat(filePath);

      if (stats.isDirectory()) {
        return list.concat(await recursiveReaddir(filePath));
      } else {
        return [filePath];
      }
    })
  )
  return list;
}
