import { OLLAMA_BASE_URL } from "../config/ollama";
import { env } from "../config/env";

export async function createEmbedding(text: string) {
	const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			model: env.EMBED_MODEL,
			prompt: text,
		}),
	});

	const data = await response.json();

	return data.embedding;
}
