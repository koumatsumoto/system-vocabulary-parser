import { beforeEach, describe, expect, it, vi } from "vitest";
import { translateWords } from "../src/translate.mjs";
import type { Word } from "../src/parse.mjs";
import * as fs from "fs";

vi.mock("fs", () => ({
  readFileSync: vi.fn(),
}));

describe("translate", () => {
  beforeEach(() => {
    // モックCSVデータの設定
    const mockCsvContent =
      "text_en,text_ja\n" + "This is a test,これはテストです\n" + "Example text,例文です\n" + "Note text,注釈です";

    vi.mocked(fs.readFileSync).mockReturnValue(mockCsvContent);
  });

  it("should translate words correctly", () => {
    const words: Word[] = [
      {
        number: "3.1",
        name: "test",
        definitions: [
          {
            text: "This is a test",
            reference: "ref1",
          },
        ],
        example: "Example text",
        note: "Note text",
      },
    ];

    const translated = translateWords(words, "dummy/path.csv");

    // 翻訳が正しく追加されていることを確認
    expect(translated[0]?.definitions[0]?.textJa).toBe("これはテストです");
    expect(translated[0]?.exampleJa).toBe("例文です");
    expect(translated[0]?.noteJa).toBe("注釈です");

    // 元のプロパティが保持されていることを確認
    expect(translated[0]?.definitions[0]?.text).toBe("This is a test");
    expect(translated[0]?.definitions[0]?.reference).toBe("ref1");
    expect(translated[0]?.example).toBe("Example text");
    expect(translated[0]?.note).toBe("Note text");
  });
});
