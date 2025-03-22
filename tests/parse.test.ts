import { expect, test, describe } from "vitest";
import { extractWordsAndDescriptions } from "../src/parse";

describe("extractWordsAndDescriptions", () => {
  test("extracts single word entry correctly", () => {
    const input = `3.1
test word
This is a description`;

    const result = extractWordsAndDescriptions(input);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      word_number: "3.1",
      word: "test word",
      description: "This is a description"
    });
  });

  test("extracts multiple word entries correctly", () => {
    const input = `3.1
first word
This is first description
3.2
second word
This is second description`;

    const result = extractWordsAndDescriptions(input);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      word_number: "3.1",
      word: "first word",
      description: "This is first description"
    });
    expect(result[1]).toEqual({
      word_number: "3.2",
      word: "second word",
      description: "This is second description"
    });
  });

  test("handles empty lines correctly", () => {
    const input = `3.1

test word

This is a description

3.2

another word

Another description`;

    const result = extractWordsAndDescriptions(input);
    expect(result).toHaveLength(2);
  });

  test("handles special prefixes in descriptions correctly", () => {
    const input = `3.1
test word
Basic description
cf. Reference note
EXAMPLE: This is an example
Note 1 to entry: Additional note`;

    const result = extractWordsAndDescriptions(input);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe(
      "Basic description\ncf. Reference note\nEXAMPLE: This is an example\nNote 1 to entry: Additional note"
    );
  });

  test("handles multiple description lines correctly", () => {
    const input = `3.1
test word
First line of description
Second line continues here
Third line adds more detail`;

    const result = extractWordsAndDescriptions(input);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe(
      "First line of description Second line continues here Third line adds more detail"
    );
  });

  test("handles invalid input gracefully", () => {
    const input = "";
    const result = extractWordsAndDescriptions(input);
    expect(result).toHaveLength(0);

    const invalidInput = `not a word number
some text
more text`;
    const invalidResult = extractWordsAndDescriptions(invalidInput);
    expect(invalidResult).toHaveLength(0);
  });
});
