import { v4 as uuidv4 } from "uuid";
import type { Message } from "~/types";

export function useChat() {
	const messages = useState<Message[]>("messages", () => []);
	const isLoading = useState<boolean>("chatLoading", () => false);
	const error = useState<string | null>("chatError", () => null);
	
	const config = useRuntimeConfig();

	const router = useRouter();

	const apiBase = config.public.apiBase;

	const { upsertConversation, setActive } = useConversations();

	const hasMessages = computed(() => messages.value.length > 0);

	function updateMessage(id: string, patch: Partial<Message>) {
		const idx = messages.value.findIndex((m) => m.id === id);

		if (idx === -1) {
			return;
		}

		messages.value.splice(idx, 1, {
			...messages.value[idx],
			...patch,
		});
	}

	async function fetchMessages(conversationId: string) {
		try {
			const res = await $fetch<
				Array<{
					id: string;
					role: string;
					content: string;
					createdAt: string;
				}>
			>(`${apiBase}/conversations/${conversationId}/messages`);

			messages.value = res.map((m) => ({
				id: m.id,
				role: m.role as "user" | "assistant",
				content: m.content,
				timestamp: new Date(m.createdAt),
			}));
		} catch (e) {
			console.error("Failed to fetch messages", e);
			messages.value = [];
		}
	}

	async function sendMessage(question: string, conversationId?: string) {
		if (!question.trim() || isLoading.value) {
			return;
		}

		error.value = null;

		messages.value.push({
			id: uuidv4(),
			role: "user",
			content: question,
			timestamp: new Date(),
		});

		const streamingId = uuidv4();

		messages.value.push({
			id: streamingId,
			role: "assistant",
			content: "",
			timestamp: new Date(),
			isStreaming: true,
		});

		isLoading.value = true;

		try {
			const response = await fetch(`${apiBase}/chat/stream`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					question,
					...(conversationId ? { conversationId } : {}),
				}),
			});

			if (!response.ok) {
				throw new Error(`${response.status}`);
			}

			if (!response.body) {
				throw new Error("No body");
			}

			const backendConversationId = response.headers.get("x-conversation-id");

			const reader = response.body.getReader();

			const decoder = new TextDecoder();

			let fullContent = "";

			while (true) {
				const { done, value } = await reader.read();

				if (done) {
					break;
				}

				fullContent += decoder.decode(value, { stream: true });

				updateMessage(streamingId, {
					content: fullContent,
				});

				await nextTick();
			}

			updateMessage(streamingId, {
				content: fullContent,
				isStreaming: false,
			});

			if (backendConversationId && !conversationId) {
				setActive(backendConversationId);

				upsertConversation({
					id: backendConversationId,
					title: question.length > 50 ? question.slice(0, 50) + "…" : question,
					createdAt: new Date().toISOString(),
				});

				await router.replace(`/chat/${backendConversationId}`);
			}
		} catch (e) {
			const idx = messages.value.findIndex((m) => m.id === streamingId);

			if (idx !== -1) {
				messages.value.splice(idx, 1);
			}

			error.value = "Failed to get a response. Please try again.";

			console.error("Stream error:", e);
		} finally {
			isLoading.value = false;
		}
	}

	function clearMessages() {
		messages.value = [];
		error.value = null;
	}

	return {
		messages,
		isLoading,
		error,
		hasMessages,
		fetchMessages,
		sendMessage,
		clearMessages,
	};
}
