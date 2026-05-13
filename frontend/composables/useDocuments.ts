import type { Document, UploadState } from "~/types";

const documents = ref<Document[]>([]);

export function useDocuments() {
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;

	const uploadState = ref<UploadState>({ status: "idle", progress: 0 });

	async function fetchDocuments() {
		try {
			const res = await $fetch<Document[]>(`${apiBase}/documents`);
			documents.value = res;
		} catch (e) {
			console.error("Failed to fetch documents", e);
		}
	}

	async function uploadDocument(
		file: File,
		conversationId?: string
	): Promise<{ document: Document; conversationId: string } | null> {
		if (!file || file.type !== "application/pdf") {
			uploadState.value = {
				status: "error",
				progress: 0,
				error: "Only PDF files are supported.",
			};
			return null;
		}

		uploadState.value = { status: "uploading", progress: 0 };
		const formData = new FormData();
		formData.append("file", file);
		if (conversationId) formData.append("conversationId", conversationId);

		const interval = setInterval(() => {
			if (uploadState.value.progress < 85)
				uploadState.value.progress = Math.min(
					85,
					uploadState.value.progress + Math.random() * 15
				);
		}, 200);

		try {
			const res = await $fetch<{
				message: string;
				chunks: number;
				document: Document;
				conversationId: string;
			}>(`${apiBase}/documents/upload`, { method: "POST", body: formData });
			clearInterval(interval);
			uploadState.value = {
				status: "success",
				progress: 100,
				document: res.document,
			};
			documents.value.unshift({ ...res.document, chunks: res.chunks });
			setTimeout(() => {
				uploadState.value = { status: "idle", progress: 0 };
			}, 2500);
			return { document: res.document, conversationId: res.conversationId };
		} catch {
			clearInterval(interval);
			uploadState.value = {
				status: "error",
				progress: 0,
				error: "Upload failed. Please try again.",
			};
			return null;
		}
	}

	async function deleteDocument(id: string) {
		const idx = documents.value.findIndex((d) => d.id === id);
		if (idx !== -1) documents.value.splice(idx, 1);
		try {
			await $fetch(`${apiBase}/documents/${id}`, { method: "DELETE" });
		} catch (e) {
			console.error("Failed to delete document", e);
		}
	}

	return {
		documents,
		uploadState,
		fetchDocuments,
		uploadDocument,
		deleteDocument,
	};
}
