import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import type { Word as BaseWord, WordDefinition } from "./parse.mjs";
import { readTextFile, writeJsonFile } from "./file.mts";

interface TranslatedWordDefinition extends WordDefinition {
  textJa?: string | undefined;
}

interface Word extends BaseWord {
  definitions: TranslatedWordDefinition[];
  exampleJa?: string | undefined;
  noteJa?: string | undefined;
}

interface Translation {
  text_en: string;
  text_ja: string;
}

/**
 * CSVファイルから翻訳マップを作成する
 */
function createTranslationMap(csvPath: string): Map<string, string> {
  const content = readFileSync(csvPath, "utf-8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
  }) as Translation[];

  return new Map(records.map((record) => [record.text_en, record.text_ja]));
}

/**
 * 単語データに日本語訳を追加する
 */
function addTranslations(word: BaseWord, translationMap: Map<string, string>): Word {
  // Deep clone to avoid mutating the original object
  const translatedWord = JSON.parse(JSON.stringify(word)) as Word;

  // Add translations for definitions
  translatedWord.definitions = word.definitions.map((def) => ({
    ...def,
    textJa: translationMap.get(def.text),
  }));

  // Add translation for example if exists
  if (word.example) {
    translatedWord.exampleJa = translationMap.get(word.example);
  }

  // Add translation for note if exists
  if (word.note) {
    translatedWord.noteJa = translationMap.get(word.note);
  }

  return translatedWord;
}

/**
 * 単語リストに日本語訳を追加する
 */
export function translateWords(words: BaseWord[], csvPath: string): Word[] {
  const translationMap = createTranslationMap(csvPath);
  return words.map((word) => addTranslations(word, translationMap));
}

/**
 * メイン処理：output.jsonからデータを読み込み、翻訳を追加して保存する
 */
async function main() {
  const words = JSON.parse(await readTextFile("data/output.json")) as BaseWord[];
  const translated = translateWords(words, "data/text_en_ja.csv");
  await writeJsonFile("data/output-translated.json", translated);
  console.log("Translation completed. Output saved to data/output-translated.json");
}

// Execute main function if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await main().catch(console.error);
}
