import { readFile } from "fs/promises";
import type { Word } from "./parse.mjs";

async function main() {
  const data = await readFile("data/output.json", "utf-8");
  const words = JSON.parse(data) as Word[];

  // Create a Set of all word names
  // If a word name contains "()" like "word name (xxx)", 
  // both "word name (xxx)" and "word name" are added to the Set
  const wordNames = new Set<string>();
  for (const word of words) {
    wordNames.add(word.name);
    
    // Handle abbreviated forms in parentheses
    const [, baseName] = word.name.match(/^(.*?)\s*\([^)]+\)\s*$/) || [];
    if (baseName) {
      wordNames.add(baseName.trim());
    }
  }

  // Check for duplicate definitions and invalid confer references
  let invalidReferenceCount = 0;
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
          invalidReferenceCount++;
        }
      }
    }
  }

  console.log(`Total invalid confer references: ${invalidReferenceCount}`);
}

main().catch(console.error);
