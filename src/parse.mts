/**
 * Interface representing a word entry with its number, name and content lines
 */
interface WordEntry {
  number: string;
  name: string;
  contentLines: string[];
}

/**
 * Interface representing a definition with text and optional reference
 */
interface WordDefinition {
  text: string;
  reference?: string | undefined;
}

/**
 * Interface representing processed word content
 */
interface WordContent {
  definition?: string;
  alias?: string[];
  confer?: string | undefined;
  example?: string | undefined;
  note?: string | undefined;
}

/**
 * Interface representing final output word data
 */
interface Word {
  number: WordEntry["number"];
  name: WordEntry["name"];
  alias?: string[];
  definitions: WordDefinition[];
  confer?: string | undefined;
  example?: string | undefined;
  note?: string | undefined;
}

/**
 * Process definition text to extract definitions and references
 */
function processDefinitionText(definitionText: string): WordDefinition[] {
  const definitions: WordDefinition[] = [];

  // 最初の定義を検出
  if (!definitionText.startsWith("1. ")) {
    return [];
  }

  // 定義を分割（最初の定義は特別扱い）
  const parts = definitionText.split(/ (?=\d+\. )/);

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    // Remove numbering prefix
    let text = trimmedPart.replace(/^\d+\.\s+/, "");
    let reference: string | undefined;

    // Extract reference if exists
    const referenceMatch = text.match(/\[([^\]]+)\]$/);
    if (referenceMatch) {
      reference = referenceMatch[1];
      text = text.substring(0, text.length - referenceMatch[0].length).trim();
    }

    definitions.push({ text, reference });
  }

  return definitions;
}

/**
 * Combine WordEntry and WordContent into final Word format
 */
function combineWordData(entry: WordEntry, content: WordContent): Word {
  const definitions = content.definition ? processDefinitionText(content.definition) : [];

  const result: Word = {
    number: entry.number,
    name: entry.name,
    definitions,
  };

  if (content.alias !== undefined) {
    result.alias = content.alias;
  }
  if (content.confer !== undefined) {
    result.confer = content.confer;
  }
  if (content.example !== undefined) {
    result.example = content.example;
  }
  if (content.note !== undefined) {
    result.note = content.note;
  }

  return result;
}

/**
 * Process content lines according to new schema
 *
 * @param lines - Array of content lines to process
 * @returns Processed content object
 */
function processContentLines(lines: string[]): WordContent {
  const result: WordContent = {};
  let currentSection: keyof WordContent | null = null;
  let aliasLines: string[] = [];
  let definitionLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("1. ") || /^\s*\d+\.\s/.test(line)) {
      // 定義行の開始
      if (definitionLines.length > 0) {
        // 前の定義行があれば結合して保存
        result.definition = (result.definition || "") + " " + definitionLines.join(" ");
        definitionLines = [];
      }
      if (!result.definition) {
        result.definition = line;
      } else {
        result.definition = result.definition + " " + line;
      }
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
    } else if (currentSection === "definition") {
      // 定義の継続行を収集
      definitionLines.push(line);
    } else {
      // その他のセクションの継続行
      if (typeof result[currentSection] === "string") {
        const currentValue = result[currentSection] as string;
        result[currentSection] = currentValue ? `${currentValue} ${line}` : line;
      }
    }
  }

  // 残っている定義行を処理
  if (definitionLines.length > 0 && result.definition) {
    result.definition = result.definition + " " + definitionLines.join(" ");
  }

  // Set aliases only if there are any
  if (aliasLines.length > 0) {
    result.alias = aliasLines;
  }

  return result;
}

/**
 * Extract words and their content from the text.
 *
 * The text format should be:
 * 3.1
 * word_name
 * content line(s)
 * 3.2
 * word_name
 * content line(s)
 * ...
 *
 * @param text - Input text to parse
 * @returns Array of Word objects
 */
export function extractWordsAndContent(text: string): Word[] {
  const words: Word[] = [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let currentWordNumber: string | null = null;
  let currentWord: string | null = null;
  let currentContentLines: string[] = [];

  // Regex pattern for word numbers (e.g., "3.1", "3.2", etc.)
  const wordNumberPattern = /^3\.\d+$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    // Check if line matches word number pattern
    if (wordNumberPattern.test(line)) {
      // Save previous entry if exists
      if (currentWordNumber && currentWord && currentContentLines.length > 0) {
        const entry = {
          number: currentWordNumber,
          name: currentWord,
          contentLines: currentContentLines,
        };
        const content = processContentLines(currentContentLines);
        words.push(combineWordData(entry, content));
      }

      // Start new entry
      currentWordNumber = line;
      currentContentLines = [];

      // Get word from next line if available
      if (i + 1 < lines.length) {
        const nextLine = lines[++i];
        if (nextLine) {
          currentWord = nextLine;
        }
      }
    } else if (currentWordNumber && currentWord) {
      // Add to current description
      currentContentLines.push(line);
    }
  }

  // Add last entry if exists
  if (currentWordNumber && currentWord && currentContentLines.length > 0) {
    const entry = {
      number: currentWordNumber,
      name: currentWord,
      contentLines: currentContentLines,
    };
    const content = processContentLines(currentContentLines);
    words.push(combineWordData(entry, content));
  }

  console.log(`\nExtracted ${words.length} words`);
  return words;
}
