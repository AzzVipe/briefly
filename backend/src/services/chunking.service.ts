import { env } from "../config/env";

export function chunkText(
	text: string,
	chunkSize = env.CHUNK_SIZE,
	overlap = env.CHUNK_OVERLAP
) {
	if (overlap >= chunkSize) {
		throw new Error("Chunk overlap must be smaller than chunk size");
	}

	const chunks: string[] = [];

	let start = 0;

	while (start < text.length) {
		const end = start + chunkSize;

		chunks.push(text.slice(start, end));

		start += chunkSize - overlap;
	}

	return chunks;
}
