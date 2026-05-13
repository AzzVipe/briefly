import type { ConversationDocument, Document } from "~/types";

// Scoped to active conversation
const attachedDocs = ref<ConversationDocument[]>([]);
const isLoadingDocs = ref(false);

export function useConversationDocuments() {
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;

	async function fetchAttachedDocs(conversationId: string) {
		isLoadingDocs.value = true;
		try {
			const res = await $fetch<ConversationDocument[]>(
				`${apiBase}/documents/conversations/${conversationId}`
			);
			attachedDocs.value = res;
		} catch (e) {
			console.error("Failed to fetch conversation documents", e);
			attachedDocs.value = [];
		} finally {
			isLoadingDocs.value = false;
		}
	}

	async function attachDocument(conversationId: string, documentId: string) {
		try {
			const res = await $fetch<ConversationDocument>(
				`${apiBase}/documents/conversations/${conversationId}`,
				{ method: "POST", body: { documentId } }
			);
			// Avoid duplicates
			if (!attachedDocs.value.find((d) => d.documentId === documentId)) {
				attachedDocs.value.push(res);
			}
		} catch (e) {
			console.error("Failed to attach document", e);
			throw e;
		}
	}

	function clearAttachedDocs() {
		attachedDocs.value = [];
	}

	return {
		attachedDocs,
		isLoadingDocs,
		fetchAttachedDocs,
		attachDocument,
		clearAttachedDocs,
	};
}
