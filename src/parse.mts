/**
 * Interface representing a word entry with its number, name and description lines
 */
interface WordEntry {
  number: string;
  name: string;
  descriptionLines: string[];
}

/**
 * Interface representing processed word description
 */
interface WordDescription {
  definition?: string;
  alias?: string;
  confer?: string;
  example?: string;
  note?: string;
}

/**
 * Interface representing final output word data
 */
interface Word {
  number: WordEntry["number"];
  name: WordEntry["name"];
  description: WordDescription;
}

/**
 * Combine WordEntry and WordDescription into final Word format
 */
function combineWordData(entry: WordEntry, description: WordDescription): Word {
  return {
    number: entry.number,
    name: entry.name,
    description,
  };
}

/**
 * Process description lines according to new schema
 *
 * @param lines - Array of description lines to process
 * @returns Processed description object
 */
function processDescriptionLines(lines: string[]): WordDescription {
  const result: WordDescription = {};
  let currentSection: keyof WordDescription | null = null;
  let aliasLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("1. ")) {
      result.definition = line; // "1. " を含めて保存
      currentSection = "definition";
    } else if (line.startsWith("cf. ")) {
      result.confer = line.substring(4); // プレフィックスを削除
      currentSection = "confer";
    } else if (line.startsWith("EXAMPLE: ")) {
      result.example = line.substring(9); // プレフィックスを削除
      currentSection = "example";
    } else if (line.startsWith("Note 1 to entry: ")) {
      result.note = line.substring(17); // プレフィックスを削除
      currentSection = "note";
    } else if (!currentSection) {
      // Lines before any special prefix are aliases
      aliasLines.push(line);
    } else {
      // Append to current section with a space if currentSection exists
      if (currentSection && typeof result[currentSection] === "string") {
        const currentValue = result[currentSection] as string;
        result[currentSection] = currentValue ? `${currentValue} ${line}` : line;
      }
    }
  }

  // Join aliases with spaces if any exist
  if (aliasLines.length > 0) {
    result.alias = aliasLines.join(" ");
  }

  return result;
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
 * @returns Tuple of WordEntry array and WordDescription array
 */
export function extractWordsAndDescriptions(text: string): Word[] {
  const words: Word[] = [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let currentWordNumber: string | null = null;
  let currentWord: string | null = null;
  let currentDescriptionLines: string[] = [];

  // Regex pattern for word numbers (e.g., "3.1", "3.2", etc.)
  const wordNumberPattern = /^3\.\d+$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    // Check if line matches word number pattern
    if (wordNumberPattern.test(line)) {
      // Save previous entry if exists
      if (currentWordNumber && currentWord && currentDescriptionLines.length > 0) {
        const entry = {
          number: currentWordNumber,
          name: currentWord,
          descriptionLines: currentDescriptionLines,
        };
        const description = processDescriptionLines(currentDescriptionLines);
        words.push(combineWordData(entry, description));
      }

      // Start new entry
      currentWordNumber = line;
      currentDescriptionLines = [];

      // Get word from next line if available
      if (i + 1 < lines.length) {
        const nextLine = lines[++i];
        if (nextLine) {
          currentWord = nextLine;
        }
      }
    } else if (currentWordNumber && currentWord) {
      // Add to current description
      currentDescriptionLines.push(line);
    }
  }

  // Add last entry if exists
  if (currentWordNumber && currentWord && currentDescriptionLines.length > 0) {
    const entry = {
      number: currentWordNumber,
      name: currentWord,
      descriptionLines: currentDescriptionLines,
    };
    const description = processDescriptionLines(currentDescriptionLines);
    words.push(combineWordData(entry, description));
  }

  console.log(`\nExtracted ${words.length} words`);
  return words;
}
