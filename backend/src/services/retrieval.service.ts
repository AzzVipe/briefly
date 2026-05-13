import { prisma } from "../config/prisma";
import { env } from "../config/env";

export async function searchSimilarChunks(
	embedding: number[],
	conversationId: string
) {
	const embeddingString = `[${embedding.join(",")}]`;

	const similarityThreshold = env.SIMILARITY_THRESHOLD;

	const result = await prisma.$queryRaw`
    SELECT
      dc.id,
      dc.content,
      dc."documentId",
      dc."chunkIndex",

      d.name as "documentName",

      dc.embedding <=> ${embeddingString}::vector AS distance

    FROM "DocumentChunk" dc

    INNER JOIN "ConversationDocument" cd
      ON cd."documentId" = dc."documentId"

    INNER JOIN "Document" d
      ON d.id = dc."documentId"

    WHERE
      cd."conversationId" = ${conversationId}

      AND
      dc.embedding <=> ${embeddingString}::vector < ${similarityThreshold}

    ORDER BY distance ASC

    LIMIT ${env.TOP_K}  
  `;

	return result as any[];
}
