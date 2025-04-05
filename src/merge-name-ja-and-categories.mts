import { readFile, writeFile } from "fs/promises";
import path from "path";

interface TranslatedWordDefinition {
  definition: string;
  definitionJa: string | undefined;
}

interface WordEntry {
  number: string;
  name: string;
  alias?: [string, ...string[]];
  definitions: TranslatedWordDefinition[];
  confer?: [string, ...string[]];
  example?: string;
  note?: string;
  exampleJa?: string;
  noteJa?: string;
}

interface NameJaAndCategories {
  number: string;
  name_ja: string;
  categories: string[];
}

interface MergedWordEntry extends WordEntry {
  name_ja: string;
  categories: string[];
}

async function main() {
  // データファイルのパスを設定
  const translatedPath = path.join("data", "output-translated.json");
  const nameJaPath = path.join("data", "name_ja_and_categories.json");
  const outputPath = path.join("data", "output-merged.json");

  try {
    // ファイルを読み込む
    const translatedData = JSON.parse(await readFile(translatedPath, "utf-8")) as WordEntry[];
    const nameJaData = JSON.parse(await readFile(nameJaPath, "utf-8")) as NameJaAndCategories[];

    // デバッグ情報を出力
    console.log("Translated data entries:", translatedData.length);
    console.log("Name JA data entries:", nameJaData.length);

    // number をキーとして name_ja と categories のマップを作成
    const nameJaMap = new Map(
      nameJaData.map((entry) => [entry.number, { name_ja: entry.name_ja, categories: entry.categories }]),
    );

    // 不足エントリの数を集計
    const missingEntries: string[] = [];
    translatedData.forEach((entry) => {
      if (!nameJaMap.has(entry.number)) {
        missingEntries.push(entry.number);
      }
    });

    if (missingEntries.length > 0) {
      console.log(`Found ${missingEntries.length} entries missing in name_ja_and_categories.json`);
      console.log("Missing entries:", missingEntries);
      console.log("Using default values (empty name_ja and categories) for these entries");
    }

    // データをマージ（不足エントリにはデフォルト値を設定）
    const mergedData = translatedData.map<MergedWordEntry>((entry) => {
      const nameJaInfo = nameJaMap.get(entry.number);
      return {
        ...entry,
        name_ja: nameJaInfo?.name_ja ?? "", // デフォルト値：空文字列
        categories: nameJaInfo?.categories ?? [], // デフォルト値：空配列
      };
    });

    // 結果を保存
    await writeFile(outputPath, JSON.stringify(mergedData, null, 2), "utf-8");
    console.log("Merged data has been saved to:", outputPath);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
