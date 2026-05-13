import { Request, Response } from "express";

import { createEmbedding } from "../services/embedding.service";
import { searchSimilarChunks } from "../services/retrieval.service";
import { generateAnswer, streamAnswer } from "../services/ai.service";
import {
	saveMessage,
	createConversation,
	getConversationMessages,
} from "../services/conversation.service";

export async function askQuestion(req: Request, res: Response) {
	try {
		const { question, conversationId } = req.body;

		if (!question) {
			return res.status(400).json({
				message: "Question is required",
			});
		}

		let activeConversationId = conversationId;

		if (!activeConversationId) {
			console.log("Creating conversation...");

			const conversation = await createConversation();

			activeConversationId = conversation.id;
		}

		console.log("Saving user message...");

		await saveMessage(activeConversationId, "user", question);

		console.log("Loading conversation history...");

		const messages = await getConversationMessages(activeConversationId);

		console.log("Creating question embedding...");

		const questionEmbedding = await createEmbedding(question);

		console.log("Searching similar chunks...");

		const chunks = await searchSimilarChunks(
			questionEmbedding,
			activeConversationId
		);

		if (chunks.length === 0) {
			return res.json({
				answer:
					"I could not find any relevant information in the attached documents.",

				sources: [],
			});
		}

		const context = chunks.map((chunk: any) => chunk.content).join("\n\n");

		console.log("Generating AI answer...");

		const answer = await generateAnswer(question, context, messages);

		console.log("Saving assistant response...");

		await saveMessage(activeConversationId, "assistant", answer);

		return res.json({
			conversationId: activeConversationId,

			answer,

			sources: chunks,
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to process question",
		});
	}
}

export async function streamQuestion(req: Request, res: Response) {
	try {
		const { question, conversationId } = req.body;

		if (!question) {
			return res.status(400).json({
				message: "Question is required",
			});
		}

		let activeConversationId = conversationId;

		if (!activeConversationId) {
			const conversation = await createConversation();

			activeConversationId = conversation.id;
		}

		res.setHeader("x-conversation-id", activeConversationId);

		await saveMessage(activeConversationId, "user", question);

		const messages = await getConversationMessages(activeConversationId);

		const questionEmbedding = await createEmbedding(question);

		const chunks = await searchSimilarChunks(
			questionEmbedding,
			activeConversationId
		);

		if (chunks.length === 0) {
			res.write(
				"I could not find any relevant information in the attached documents."
			);

			return res.end();
		}

		const context = chunks.map((chunk: any) => chunk.content).join("\n\n");

		const ollamaResponse = await streamAnswer(question, context, messages);

		if (!ollamaResponse.body) {
			throw new Error("No response body from Ollama");
		}

		res.setHeader("Content-Type", "text/plain");

		res.setHeader("Transfer-Encoding", "chunked");

		const reader = ollamaResponse.body.getReader();

		const decoder = new TextDecoder();

		let finalAnswer = "";

		while (true) {
			const { done, value } = await reader.read();

			if (done) break;

			const chunk = decoder.decode(value);

			const lines = chunk.split("\n").filter(Boolean);

			for (const line of lines) {
				const parsed = JSON.parse(line);

				const token = parsed.response || "";

				finalAnswer += token;

				res.write(token);
			}
		}

		await saveMessage(activeConversationId, "assistant", finalAnswer);

		res.end();
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Failed to stream response",
		});
	}
}
