import { expect, test, describe } from "vitest";
import { extractWordsAndDescriptions } from "../src/parse.mts";

describe("extractWordsAndDescriptions", () => {
  test("extracts single word entry correctly", () => {
    const input = `3.1
test word
1. This is a description`;

    const words = extractWordsAndDescriptions(input);
    expect(words).toHaveLength(1);
    expect(words[0]).toEqual({
      number: "3.1",
      name: "test word",
      description: {
        definition: "1. This is a description",
      },
    });
  });

  test("extracts multiple word entries correctly", () => {
    const input = `3.1
first word
1. This is first description
3.2
second word
1. This is second description`;

    const words = extractWordsAndDescriptions(input);
    expect(words).toHaveLength(2);
    expect(words[0]).toEqual({
      number: "3.1",
      name: "first word",
      description: {
        definition: "1. This is first description",
      },
    });
    expect(words[1]).toEqual({
      number: "3.2",
      name: "second word",
      description: {
        definition: "1. This is second description",
      },
    });
  });

  test("handles empty lines correctly", () => {
    const input = `3.1

test word

1. This is a description

3.2

another word

1. Another description`;

    const words = extractWordsAndDescriptions(input);
    expect(words).toHaveLength(2);
  });

  test("handles special prefixes in descriptions correctly", () => {
    const input = `3.1
test word
alternative name
1. Basic description
cf. Reference note
EXAMPLE: This is an example
Note 1 to entry: Additional note`;

    const words = extractWordsAndDescriptions(input);
    expect(words).toHaveLength(1);
    expect(words[0].description).toEqual({
      definition: "1. Basic description",
      alias: "alternative name",
      confer: "Reference note",
      example: "This is an example",
      note: "Additional note",
    });
  });

  test("handles multiple description lines correctly", () => {
    const input = `3.1
test word
alternative name 1
alternative name 2
1. First line of definition
Second line continues definition
Third line adds more detail`;

    const words = extractWordsAndDescriptions(input);
    expect(words).toHaveLength(1);
    expect(words[0].description).toEqual({
      definition: "1. First line of definition Second line continues definition Third line adds more detail",
      alias: "alternative name 1 alternative name 2",
    });
  });

  test("handles invalid input gracefully", () => {
    const input = "";
    const words = extractWordsAndDescriptions(input);
    expect(words).toHaveLength(0);

    const invalidInput = `not a word number
some text
more text`;
    const invalidWords = extractWordsAndDescriptions(invalidInput);
    expect(invalidWords).toHaveLength(0);
  });
});
