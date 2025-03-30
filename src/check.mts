import { readFile } from "fs/promises";
import type { Word } from "./parse.mjs";

async function main() {
  const data = await readFile("data/output.json", "utf-8");
  const words = JSON.parse(data) as Word[];

  // Create a Set of all word names
  const wordNames = new Set<string>();
  for (const word of words) {
    wordNames.add(word.name);
  }

  // Check for duplicate definitions and invalid confer references
  for (const word of words) {
    // Check for duplicate definitions
    const texts = new Set<string>();
    for (const definition of word.definitions) {
      if (texts.has(definition.text)) {
        console.log(`Word ${word.number} has duplicate definition text: ${definition.text}`);
      }
      texts.add(definition.text);
    }

    // Check for invalid confer references
    if (word.confer) {
      for (const conferValue of word.confer) {
        if (!wordNames.has(conferValue)) {
          console.log(`Word ${word.number} has invalid confer reference: ${conferValue}`);
        }
      }
    }
  }
}

main().catch(console.error);
