export interface Document {
	id: string;
	name: string;
	createdAt: string;
	size?: number;
	chunks?: number;
}

export interface ConversationDocument {
	id: string;
	conversationId: string;
	documentId: string;
	document: Document;
}

export interface Source {
	id: string;
	content: string;
	documentId: string;
	chunkIndex: number;
	distance: number;
}

export interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	sources?: Source[];
	timestamp: Date;
	isStreaming?: boolean;
}

export interface Conversation {
	id: string;
	title: string;
	createdAt: string;
	updatedAt?: string;
	messageCount?: number;
}

export interface ChatResponse {
	conversationId: string;
	answer: string;
	sources: Source[];
}

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadState {
	status: UploadStatus;
	progress: number;
	error?: string;
	document?: Document;
}
