/**
 * Interface representing a word entry with its number, name and description
 */
interface WordEntry {
  word_number: string;
  word: string;
  description: string;
}

/**
 * Process description lines according to joining rules.
 *
 * @param descriptionLines - Array of description lines to process
 * @returns Processed description string with appropriate line joining
 */
function processDescriptionLines(descriptionLines: string[]): string {
  const specialPrefixes = ["cf. ", "EXAMPLE: ", "Note 1 to entry: "];

  return descriptionLines.reduce((processedDescription: string, line: string) => {
    // Check if line starts with any special prefix
    const hasSpecialPrefix = specialPrefixes.some((prefix) => line.startsWith(prefix));

    // Add newline for special prefixes, space for normal lines
    if (processedDescription === "") {
      return line;
    } else if (hasSpecialPrefix) {
      return `${processedDescription}\n${line}`;
    } else {
      return `${processedDescription} ${line}`;
    }
  }, "");
}

/**
 * Extract words and their descriptions from the text.
 *
 * The text format should be:
 * 3.1
 * word_name
 * description line(s)
 * 3.2
 * word_name
 * description line(s)
 * ...
 *
 * @param text - Input text to parse
 * @returns Array of WordEntry objects containing word_number, word, and description
 */
export function extractWordsAndDescriptions(text: string): WordEntry[] {
  const result: WordEntry[] = [];
  const lines = text.split("\n");

  let currentWordNumber: string | null = null;
  let currentWord: string | null = null;
  let currentDescriptionLines: string[] = [];

  // Regex pattern for word numbers (e.g., "3.1", "3.2", etc.)
  const wordNumberPattern = /^3\.\d+$/;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i]?.trim() ?? "";

    // Check if line matches word number pattern
    if (wordNumberPattern.test(line)) {
      // Save previous entry if exists
      if (currentWordNumber && currentWord && currentDescriptionLines.length > 0) {
        result.push({
          word_number: currentWordNumber,
          word: currentWord,
          description: processDescriptionLines(currentDescriptionLines),
        });
      }

      // Start new entry
      currentWordNumber = line;
      currentDescriptionLines = [];

      // Get word from next non-empty line
      i++;
      while (i < lines.length) {
        const nextLine = lines[i]?.trim() ?? "";
        if (nextLine) {
          currentWord = nextLine;
          break;
        }
        i++;
      }
      i++;
    } else {
      // Add to current description if we have both number and word
      if (currentWordNumber && currentWord) {
        // Only add non-empty lines to description
        if (line) {
          currentDescriptionLines.push(line);
        }
      }
      i++;
    }
  }

  // Add last entry if exists - only consider non-empty description lines
  if (currentWordNumber && currentWord && currentDescriptionLines.length > 0) {
    result.push({
      word_number: currentWordNumber,
      word: currentWord,
      description: processDescriptionLines(currentDescriptionLines),
    });
  }

  console.log(`\nExtracted ${result.length} words`);
  return result;
}
