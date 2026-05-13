const pdf = require("pdf-parse");

export async function extractPdfText(buffer: Buffer) {
  const data = await pdf(buffer);

  return data.text;
}