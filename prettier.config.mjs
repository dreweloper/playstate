/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  printWidth: 100,
  // Do not reformat code inside Markdown: code samples are hand-written for reading and some live
  // in accepted ADRs (e.g. the ADR-0010 example and the data model in ARCHITECTURE §5).
  embeddedLanguageFormatting: 'off',
};

export default config;
