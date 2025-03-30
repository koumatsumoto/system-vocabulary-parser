import { readFile } from "fs/promises";
import type { Word } from "./parse.mjs";

async function main() {
  const data = await readFile("data/output.json", "utf-8");
  const words = JSON.parse(data) as Word[];

  for (const word of words) {
    const texts = new Set<string>();
    for (const definition of word.definitions) {
      if (texts.has(definition.text)) {
        console.log(`Word ${word.number} has duplicate definition text: ${definition.text}`);
      }
      texts.add(definition.text);
    }
  }
}

main().catch(console.error);
