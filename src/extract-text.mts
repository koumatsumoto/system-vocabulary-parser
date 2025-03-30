import type { Word } from "./parse.mjs";
import fs from "fs/promises";

interface ExtractedText {
  texts: string[];
}

async function extractTextsForTranslation(): Promise<void> {
  try {
    // Read the input file
    const data = await fs.readFile("data/output.json", "utf-8");
    const words: Word[] = JSON.parse(data);

    const textSet = new Set<string>();

    // Extract texts from each word
    for (const word of words) {
      // Extract definition texts
      for (const def of word.definitions) {
        textSet.add(def.text);
      }

      // Extract example if exists
      if (word.example) {
        textSet.add(word.example);
      }

      // Extract note if exists
      if (word.note) {
        textSet.add(word.note);
      }
    }

    // Convert to array and sort alphabetically
    const extractedTexts = Array.from(textSet).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

    // Save extracted texts to output file
    const output: ExtractedText = {
      texts: extractedTexts,
    };

    await fs.writeFile("data/output-extract-text.json", JSON.stringify(output, null, 2), "utf-8");

    console.log(`Extracted ${extractedTexts.length} texts for translation`);
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
}

// Export for testing purposes
export { extractTextsForTranslation };
export type { ExtractedText };

// Execute main function if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await extractTextsForTranslation().catch(console.error);
}
