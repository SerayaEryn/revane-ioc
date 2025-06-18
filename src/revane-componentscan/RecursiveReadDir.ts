import { promises } from "fs";
import { join } from "path";

const { stat, readdir } = promises;

export async function recursiveReaddir(path: string): Promise<string[]> {
  let list: string[] = [];
  const files = await readdir(path);

  for (const file of files) {
    const filePath = join(path, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      list = list.concat(await recursiveReaddir(filePath));
    } else {
      list.push(filePath);
    }
  }
  return list;
}
