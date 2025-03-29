# system-vocabulary-parser

This repository contains a Node.js/TypeScript program designed to parse and extract vocabulary documentation for system development. It focuses on processing structured data from documents, with PDF parsing capabilities referenced via https://github.com/koumatsumoto/iso24765-pdfium-extractor

## Execution

To run the program:

```bash
npm start
```

This command will process `data/input.txt` and generate the output at `data/output.json`.

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
