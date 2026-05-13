import { Request, Response } from "express";

import { prisma } from "../config/prisma";

import { extractPdfText } from "../services/pdf.service";
import { chunkText } from "../services/chunking.service";
import { createEmbedding } from "../services/embedding.service";

export async function uploadDocument(req: Request, res: Response) {
	try {
		if (!req.file) {
			return res.status(400).json({
				message: "No file uploaded",
			});
		}

		let { conversationId } = req.body;

		if (!conversationId) {
			const conversation = await prisma.conversation.create({
				data: {
					title: req.file.originalname,
				},
			});

			conversationId = conversation.id;
		}

		const text = await extractPdfText(req.file.buffer);

		const chunks = chunkText(text);

		const document = await prisma.document.create({
			data: {
				name: req.file.originalname,
			},
		});

		await prisma.conversationDocument.create({
			data: {
				conversationId,
				documentId: document.id,
			},
		});

		for (let i = 0; i < chunks.length; i++) {
			const embedding = await createEmbedding(chunks[i]);

			await prisma.$executeRawUnsafe(`
        INSERT INTO "DocumentChunk"
        (
          id,
          "documentId",
          content,
          "chunkIndex",
          embedding
        )
        VALUES
        (
          gen_random_uuid(),
          '${document.id}',
          $$${chunks[i]}$$,
          ${i},
          '[${embedding.join(",")}]'
        )
      `);
		}

		return res.status(201).json({
			message: "Document uploaded successfully",
			conversationId,
			chunks: chunks.length,
			document,
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
		const documents = await prisma.document.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

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

		await prisma.document.delete({
			where: {
				id,
			},
		});

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

		const relation = await prisma.conversationDocument.create({
			data: {
				conversationId: id,
				documentId,
			},
		});

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

		const documents = await prisma.conversationDocument.findMany({
			where: {
				conversationId: id,
			},

			include: {
				document: true,
			},
		});

		return res.json(documents);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to fetch conversation documents",
		});
	}
}
