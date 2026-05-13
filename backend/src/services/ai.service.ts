import { OLLAMA_BASE_URL } from "../config/ollama";
import { env } from "../config/env";

type Message = {
	role: string;
	content: string;
};

export async function generateAnswer(
	question: string,
	context: string,
	messages: Message[]
) {
	const history = messages
		.map((message) => `${message.role}: ${message.content}`)
		.join("\n");

	const prompt = `
  You are an AI assistant.

  Answer ONLY using the provided context.

  If the answer does not exist in the context,
  say you do not know.

  Conversation History:
  ${history}

  Context:
  ${context}

  Question:
  ${question}
`;

	const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			model: env.CHAT_MODEL,
			prompt,
			stream: false,
		}),
	});

	const data = await response.json();

	return data.response;
}

export async function streamAnswer(
	question: string,
	context: string,
	messages: Message[]
) {
	const history = messages
		.map((message) => `${message.role}: ${message.content}`)
		.join("\n");

	const prompt = `
You are an AI assistant.

Answer ONLY using the provided context.

If the answer does not exist in the context,
say you do not know.

Conversation History:
${history}

Context:
${context}

Question:
${question}
`;

	const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			model: env.CHAT_MODEL,
			prompt,
			stream: true,
		}),
	});

	return response;
}
