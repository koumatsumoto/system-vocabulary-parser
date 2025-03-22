import { expect, test, vi } from "vitest";
import { main } from "../src/main";

test("main function exists", () => {
  expect(main).toBeDefined();
  expect(typeof main).toBe("function");
});

test("main function executes without errors", async () => {
  const consoleSpy = vi.spyOn(console, "log");
  await main();
  expect(consoleSpy).toHaveBeenCalledWith("Hello, world!");
  consoleSpy.mockRestore();
});
