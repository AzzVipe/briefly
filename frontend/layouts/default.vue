<template>
	<div class="app-layout">
		<ChatSidebar
			:conversations="conversations"
			:active-conversation-id="activeConversationId"
			:is-open="sidebarOpen"
			@new-chat="handleNewChat"
			@select-conversation="handleSelectConversation"
			@delete-conversation="handleDeleteConversation" />

		<div
			v-if="sidebarOpen && isMobile"
			class="sidebar-overlay"
			@click="sidebarOpen = false" />

		<div class="main-content">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useWindowSize } from "@vueuse/core";

	const route = useRoute();
	const router = useRouter();

	const {
		conversations,
		activeConversationId,
		fetchConversations,
		setActive,
		deleteConversation,
	} = useConversations();

	const sidebarOpen = ref(true);

	const { width } = useWindowSize();

	const isMobile = computed(() => width.value < 768);

	onMounted(async () => {
		await fetchConversations();

		if (isMobile.value) {
			sidebarOpen.value = false;
		}
	});

	watch(
		() => route.params.id,
		(id) => {
			if (typeof id === "string") {
				setActive(id);
			} else {
				setActive(null);
			}
		},
		{ immediate: true }
	);

	function handleNewChat() {
		setActive(null);
		router.push("/chat");
	}

	function handleSelectConversation(id: string) {
		setActive(id);
		router.push(`/chat/${id}`);
	}

	async function handleDeleteConversation(id: string) {
		await deleteConversation(id);

		if (route.params.id === id) {
			router.push("/chat");
		}
	}
</script>

<style scoped>
	.app-layout {
		display: flex;
		height: 100vh;
		overflow: hidden;
		background: var(--background);
	}

	.main-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.sidebar-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 40;
	}
</style>
