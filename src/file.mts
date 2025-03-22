import * as fs from "node:fs/promises";

/**
 * Read text content from a file
 * @param path - Path to the file to read
 * @returns Promise that resolves to the file content as string
 */
export async function readTextFile(path: string): Promise<string> {
  return fs.readFile(path, "utf-8");
}

/**
 * Write data to a JSON file
 * @param path - Path to the file to write
 * @param data - Data to write
 */
export async function writeJsonFile<T>(path: string, data: T): Promise<void> {
  await fs.writeFile(path, JSON.stringify(data, null, 2), "utf-8");
}
