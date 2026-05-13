export const env = {
	PORT: Number(process.env.PORT) || 5000,

	NODE_ENV: process.env.NODE_ENV || "development",

	DATABASE_URL: process.env.DATABASE_URL || "",

	OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://172.17.0.1:11434",

	CHAT_MODEL: process.env.CHAT_MODEL || "llama3",

	EMBED_MODEL: process.env.EMBED_MODEL || "nomic-embed-text",

	CHUNK_SIZE: Number(process.env.CHUNK_SIZE) || 1000,

	CHUNK_OVERLAP: Number(process.env.CHUNK_OVERLAP) || 200,

	TOP_K: Number(process.env.TOP_K) || 5,

	SIMILARITY_THRESHOLD: Number(process.env.SIMILARITY_THRESHOLD) || 0.7,
};
