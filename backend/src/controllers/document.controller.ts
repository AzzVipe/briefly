import { Request, Response } from "express";

import {
	processDocumentUpload,
	fetchDocuments,
	removeDocument,
	attachDocument,
	fetchConversationDocuments,
} from "../services/document.service";

export async function uploadDocument(req: Request, res: Response) {
	try {
		if (!req.file) {
			return res.status(400).json({
				message: "No file uploaded",
			});
		}

		const { conversationId } = req.body;

		const result = await processDocumentUpload(req.file, conversationId);

		return res.status(201).json({
			message: "Document uploaded successfully",

			...result,
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to upload document",
		});
	}
}

export async function getDocuments(_req: Request, res: Response) {
	try {
		const documents = await fetchDocuments();

		return res.json(documents);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to fetch documents",
		});
	}
}

export async function deleteDocument(req: Request, res: Response) {
	try {
		const id = req.params.id as string;

		await removeDocument(id);

		return res.json({
			message: "Document deleted",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to delete document",
		});
	}
}

export async function attachDocumentToConversation(
	req: Request,
	res: Response
) {
	try {
		const id = req.params.id as string;

		const { documentId } = req.body;

		if (!documentId) {
			return res.status(400).json({
				message: "Document ID is required",
			});
		}

		const relation = await attachDocument(id, documentId);

		return res.json(relation);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to attach document",
		});
	}
}

export async function getConversationDocuments(req: Request, res: Response) {
	try {
		const id = req.params.id as string;

		const documents = await fetchConversationDocuments(id);

		return res.json(documents);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to fetch conversation documents",
		});
	}
}
