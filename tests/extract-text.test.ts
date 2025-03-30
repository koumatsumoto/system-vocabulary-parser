import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractTextsForTranslation } from "../src/extract-text.mts";
import fs from "fs/promises";

vi.mock("fs/promises");

describe("extract-text", () => {
  const mockWords = [
    {
      number: "3.1",
      name: "test",
      definitions: [{ text: "Definition 1" }, { text: "Definition 2", reference: "Ref1" }],
      example: "Example text",
      note: "Note text",
    },
    {
      number: "3.2",
      name: "test2",
      definitions: [{ text: "Another definition" }],
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should extract texts from words correctly", async () => {
    // Mock file read
    const mockReadFile = vi.spyOn(fs, "readFile").mockResolvedValue(JSON.stringify(mockWords));

    // Mock file write
    const mockWriteFile = vi.spyOn(fs, "writeFile").mockResolvedValue();

    // Execute the function
    await extractTextsForTranslation();

    // Verify file read
    expect(mockReadFile).toHaveBeenCalledWith("data/output.json", "utf-8");

    // Verify file write
    expect(mockWriteFile).toHaveBeenCalledWith("data/output-extract-text.json", expect.any(String), "utf-8");

    // Verify written content
    const writtenContent = JSON.parse(mockWriteFile.mock.calls[0]![1] as string);
    expect(writtenContent).toEqual({
      texts: ["Another definition", "Definition 1", "Definition 2", "Example text", "Note text"],
    });
  });

  it("should handle file read errors", async () => {
    // Mock file read to throw error
    vi.spyOn(fs, "readFile").mockRejectedValue(new Error("Read error"));

    // Verify error is thrown
    await expect(extractTextsForTranslation()).rejects.toThrow("Read error");
  });

  it("should handle file write errors", async () => {
    // Mock successful read
    vi.spyOn(fs, "readFile").mockResolvedValue(JSON.stringify(mockWords));

    // Mock write to throw error
    vi.spyOn(fs, "writeFile").mockRejectedValue(new Error("Write error"));

    // Verify error is thrown
    await expect(extractTextsForTranslation()).rejects.toThrow("Write error");
  });

  it("should remove duplicates and sort texts", async () => {
    const mockWordsWithDuplicates = [
      {
        number: "3.1",
        name: "test1",
        definitions: [{ text: "Common definition" }, { text: "Unique definition" }],
        example: "Common definition",
        note: "Test note",
      },
      {
        number: "3.2",
        name: "test2",
        definitions: [{ text: "Common definition" }, { text: "Another definition" }],
      },
    ];

    vi.spyOn(fs, "readFile").mockResolvedValue(JSON.stringify(mockWordsWithDuplicates));
    const mockWriteFile = vi.spyOn(fs, "writeFile").mockResolvedValue();

    await extractTextsForTranslation();

    const writtenContent = JSON.parse(mockWriteFile.mock.calls[0]![1] as string);
    expect(writtenContent).toEqual({
      texts: ["Another definition", "Common definition", "Test note", "Unique definition"],
    });
  });

  it("should handle empty input", async () => {
    // Mock empty array
    vi.spyOn(fs, "readFile").mockResolvedValue("[]");
    const mockWriteFile = vi.spyOn(fs, "writeFile").mockResolvedValue();

    await extractTextsForTranslation();

    // Verify empty array output
    const writtenContent = JSON.parse(mockWriteFile.mock.calls[0]![1] as string);
    expect(writtenContent).toEqual({
      texts: [],
    });
  });
});
