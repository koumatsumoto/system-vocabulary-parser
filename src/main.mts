import { extractWordsAndDescriptions } from "./parse.mts";
import { readTextFile, writeJsonFile } from "./file.mts";
import path from "path";

export async function main(): Promise<void> {
  try {
    // Read input file
    const inputText = await readTextFile(path.join("data", "input.txt"));

    // Process the text
    const words = extractWordsAndDescriptions(inputText);

    // Write output to JSON file
    await writeJsonFile(path.join("data", "output.json"), words);

    console.log(`Successfully processed ${words.length} words and saved to output.json`);
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
}

// Execute main function if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await main().catch(console.error);
}
