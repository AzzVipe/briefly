import type { Conversation } from "~/types";

const conversations = ref<Conversation[]>([]);
const activeConversationId = ref<string | null>(null);
const isLoadingConversations = ref(false);

export function useConversations() {
	const config = useRuntimeConfig();
	const apiBase = config.public.apiBase;

	async function fetchConversations() {
		isLoadingConversations.value = true;
		try {
			const res = await $fetch<Conversation[]>(`${apiBase}/conversations`);
			// Sort newest first
			conversations.value = res.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		} catch (e) {
			console.error("Failed to fetch conversations", e);
		} finally {
			isLoadingConversations.value = false;
		}
	}

	function upsertConversation(conv: Conversation) {
		const idx = conversations.value.findIndex((c) => c.id === conv.id);
		if (idx === -1) conversations.value.unshift(conv);
		else conversations.value.splice(idx, 1, conv);
	}

	function setActive(id: string | null) {
		activeConversationId.value = id;
	}

	async function deleteConversation(id: string) {
		const idx = conversations.value.findIndex((c) => c.id === id);
		const removed = conversations.value[idx];
		if (idx !== -1) conversations.value.splice(idx, 1);
		if (activeConversationId.value === id) {
			activeConversationId.value = conversations.value[0]?.id ?? null;
		}
		try {
			await $fetch(`${apiBase}/conversations/${id}`, { method: "DELETE" });
		} catch (e) {
			// Restore on failure
			if (removed) conversations.value.splice(idx, 0, removed);
			console.error("Failed to delete conversation", e);
		}
	}

	return {
		conversations,
		activeConversationId,
		isLoadingConversations,
		fetchConversations,
		upsertConversation,
		setActive,
		deleteConversation,
	};
}
