# system-vocabulary-parser

This repository contains a Node.js/TypeScript program designed to parse and extract vocabulary documentation for system development. It focuses on processing structured data from documents, with PDF parsing capabilities referenced via https://github.com/koumatsumoto/iso24765-pdfium-extractor

## Execution

To run the program:

```bash
npm start
```

This command will process `data/input.txt` and generate the output at `data/output.json`.

### Data Validation

To check for data consistency issues:

```bash
node src/check.mts
```

This command will validate the generated `data/output.json` file and report any issues such as:

- Duplicate definition texts within a word
- Invalid cross-references (when a word's confer section references non-existent words)

## Development

### Testing

Run tests using:

```bash
npm test
```

Tests are executed using [Vitest](https://vitest.dev/).

### Code Formatting

Format code using:

```bash
npm run fmt
```

Code formatting is handled by [Prettier](https://prettier.io/).

## Updating data/name_ja_and_categories.json

To update the name_ja_and_categories.json file, run:

```bash
curl -o data/name_ja_and_categories.json https://raw.githubusercontent.com/koumatsumoto/study-OpenAPI-responses-20250402/refs/heads/main/data/batch_result.json
```
