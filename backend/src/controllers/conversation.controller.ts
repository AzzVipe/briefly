import { Request, Response } from "express";

import {
	fetchConversations,
	fetchConversationMessages,
	renameConversation,
	removeConversation,
} from "../services/conversation.service";

export async function getConversations(_req: Request, res: Response) {
	try {
		const conversations = await fetchConversations();

		return res.json(conversations);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to fetch conversations",
		});
	}
}

export async function getConversationMessages(req: Request, res: Response) {
	try {
		const id = req.params.id as string;

		const messages = await fetchConversationMessages(id);

		return res.json(messages);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to fetch messages",
		});
	}
}

export async function updateConversation(req: Request, res: Response) {
	try {
		const id = req.params.id as string;

		const { title } = req.body;

		if (!title?.trim()) {
			return res.status(400).json({
				message: "Title is required",
			});
		}

		if (title.length > 100) {
			return res.status(400).json({
				message: "Title too long",
			});
		}

		const conversation = await renameConversation(id, title.trim());

		return res.json({
			message: "Conversation renamed successfully",

			conversation,
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to rename conversation",
		});
	}
}

export async function deleteConversation(req: Request, res: Response) {
	try {
		const id = req.params.id as string;

		await removeConversation(id);

		return res.json({
			message: "Conversation deleted",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to delete conversation",
		});
	}
}
