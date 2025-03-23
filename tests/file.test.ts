import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs/promises";
import { readTextFile, writeJsonFile } from "../src/file.mts";

vi.mock("fs/promises");

describe("File operations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("readTextFile", () => {
    test("reads file content successfully", async () => {
      const mockContent = "test content";
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      const result = await readTextFile("test.txt");

      expect(result).toBe(mockContent);
      expect(fs.readFile).toHaveBeenCalledWith("test.txt", "utf-8");
    });

    test("throws error when file read fails", async () => {
      const error = new Error("File read error");
      vi.mocked(fs.readFile).mockRejectedValue(error);

      await expect(readTextFile("test.txt")).rejects.toThrow("File read error");
    });
  });

  describe("writeJsonFile", () => {
    test("writes JSON data to file successfully", async () => {
      const testData = { key: "value" };
      vi.mocked(fs.writeFile).mockResolvedValue();

      await writeJsonFile("test.json", testData);

      expect(fs.writeFile).toHaveBeenCalledWith("test.json", JSON.stringify(testData, null, 2), "utf-8");
    });

    test("throws error when file write fails", async () => {
      const error = new Error("File write error");
      vi.mocked(fs.writeFile).mockRejectedValue(error);

      await expect(writeJsonFile("test.json", {})).rejects.toThrow("File write error");
    });
  });
});
