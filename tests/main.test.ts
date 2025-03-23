import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { main } from "../src/main.mts";
import { readTextFile, writeJsonFile } from "../src/file.mts";
import { extractWordsAndDescriptions } from "../src/parse.mts";

// Mock the file operations and parse function
vi.mock("../src/file.mts");
vi.mock("../src/parse.mts");

describe("main function", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("exists and is a function", () => {
    expect(main).toBeDefined();
    expect(typeof main).toBe("function");
  });

  test("processes files and saves output correctly", async () => {
    // Mock input data and processing result
    const mockInput = "3.1\nword1\n1. definition1";
    const mockWords = [
      {
        number: "3.1",
        name: "word1",
        description: {
          definition: "1. definition1",
        },
      },
    ];

    // Setup mocks
    vi.mocked(readTextFile).mockResolvedValue(mockInput);
    vi.mocked(writeJsonFile).mockResolvedValue();
    vi.mocked(extractWordsAndDescriptions).mockReturnValue(mockWords);
    const consoleSpy = vi.spyOn(console, "log");

    // Execute main
    await main();

    // Verify file operations
    expect(readTextFile).toHaveBeenCalledWith(expect.stringContaining("input.txt"));
    expect(writeJsonFile).toHaveBeenCalledWith(expect.stringContaining("output.json"), mockWords);
    expect(extractWordsAndDescriptions).toHaveBeenCalledWith(mockInput);
    expect(consoleSpy).toHaveBeenCalledWith("Successfully processed 1 words and saved to output.json");
  });

  test("handles errors appropriately", async () => {
    // Mock error
    const error = new Error("File read error");
    vi.mocked(readTextFile).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");

    // Execute and verify error handling
    await expect(main()).rejects.toThrow("File read error");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error processing file:", error);
  });
});
