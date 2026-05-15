import type { Conversation } from "~/types";

export function useConversations() {
	const conversations = useState<Conversation[]>("conversations", () => []);

	const activeConversationId = useState<string | null>(
		"activeConversationId",
		() => null
	);

	const isLoadingConversations = useState<boolean>(
		"isLoadingConversations",
		() => false
	);

	const hasFetchedConversations = useState<boolean>(
		"hasFetchedConversations",
		() => false
	);

	const config = useRuntimeConfig();

	const apiBase = config.public.apiBase;

	async function fetchConversations(force = false) {
		if (hasFetchedConversations.value && !force) {
			return;
		}

		isLoadingConversations.value = true;

		try {
			const res = await $fetch<Conversation[]>(`${apiBase}/conversations`);

			conversations.value = res.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);

			hasFetchedConversations.value = true;
		} catch (e) {
			console.error("Failed to fetch conversations", e);
		} finally {
			isLoadingConversations.value = false;
		}
	}

	function upsertConversation(conv: Conversation) {
		const idx = conversations.value.findIndex((c) => c.id === conv.id);

		if (idx === -1) {
			conversations.value.unshift(conv);
		} else {
			conversations.value.splice(idx, 1);
			conversations.value.unshift(conv);
		}
	}

	function setActive(id: string | null) {
		activeConversationId.value = id;
	}

	async function deleteConversation(id: string) {
		const idx = conversations.value.findIndex((c) => c.id === id);

		if (idx !== -1) {
			conversations.value.splice(idx, 1);
		}

		if (activeConversationId.value === id) {
			activeConversationId.value = null;
		}

		try {
			await $fetch(`${apiBase}/conversations/${id}`, {
				method: "DELETE",
			});
		} catch (e) {
			console.error("Failed to delete conversation", e);
		}
	}

	async function updateConversation(id: string, title: string) {
		try {
			await $fetch(`${apiBase}/conversations/${id}`, {
				method: "PATCH",
				body: {
					title,
				},
			});
			const idx = conversations.value.findIndex((c) => c.id === id);
			if (conversations.value[idx]) conversations.value[idx].title = title;
		} catch (e) {
			console.error("Failed to update conversation", e);
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
		updateConversation,
	};
}
