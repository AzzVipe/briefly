import { prisma } from "../config/prisma";

import { extractPdfText } from "./pdf.service";

import { chunkText } from "./chunking.service";

import { createEmbedding } from "./embedding.service";

export async function processDocumentUpload(
	file: Express.Multer.File,
	conversationId?: string
) {
	let targetConversationId = conversationId;

	if (!targetConversationId) {
		const conversation = await prisma.conversation.create({
			data: {
				title: file.originalname,
			},
		});

		targetConversationId = conversation.id;
	}

	const text = await extractPdfText(file.buffer);

	const chunks = chunkText(text);

	const document = await prisma.document.create({
		data: {
			name: file.originalname,
		},
	});

	await prisma.conversationDocument.create({
		data: {
			conversationId: targetConversationId,

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

	return {
		conversationId: targetConversationId,

		chunks: chunks.length,

		document,
	};
}

export async function fetchDocuments() {
	return prisma.document.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function removeDocument(id: string) {
	return prisma.document.delete({
		where: {
			id,
		},
	});
}

export async function attachDocument(
	conversationId: string,
	documentId: string
) {
	return prisma.conversationDocument.create({
		data: {
			conversationId,
			documentId,
		},
	});
}

export async function fetchConversationDocuments(conversationId: string) {
	return prisma.conversationDocument.findMany({
		where: {
			conversationId,
		},

		include: {
			document: true,
		},
	});
}
