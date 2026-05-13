<template>
	<aside class="sidebar" :class="{ 'sidebar--collapsed': !isOpen }">
		<div class="sidebar-inner">
			<!-- Logo -->
			<div class="sidebar-logo">
				<div class="logo-mark">
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<rect width="18" height="18" rx="5" fill="var(--primary)" />
						<path
							d="M5 9.5L7.5 12L13 6"
							stroke="white"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round" />
					</svg>
				</div>
				<span class="logo-text">Briefly</span>
			</div>

			<!-- New Chat -->
			<button class="new-chat-btn" @click="$emit('new-chat')">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path
						d="M7 1v12M1 7h12"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round" />
				</svg>
				New conversation
			</button>

			<!-- Search -->
			<div class="search-wrapper">
				<svg
					class="search-icon"
					width="13"
					height="13"
					viewBox="0 0 13 13"
					fill="none">
					<circle
						cx="5.5"
						cy="5.5"
						r="4"
						stroke="currentColor"
						stroke-width="1.3" />
					<path
						d="M8.5 8.5L11 11"
						stroke="currentColor"
						stroke-width="1.3"
						stroke-linecap="round" />
				</svg>
				<input
					v-model="searchQuery"
					class="search-input"
					placeholder="Search conversations..."
					type="text" />
			</div>

			<!-- Conversations -->
			<div class="sidebar-section">
				<div class="section-label">Recent</div>
				<ChatConversationList
					:conversations="filteredConversations"
					:active-id="activeConversationId"
					@select="$emit('select-conversation', $event)"
					@delete="$emit('delete-conversation', $event)" />
			</div>

			<!-- Footer -->
			<div class="sidebar-footer">
				<div class="user-area">
					<div class="avatar">U</div>
					<div class="user-info">
						<div class="user-name">User</div>
						<div class="user-plan">Free plan</div>
					</div>
				</div>
			</div>
		</div>
	</aside>
</template>

<script setup lang="ts">
	import type { Conversation } from "~/types";

	const props = defineProps<{
		conversations: Conversation[];
		activeConversationId: string | null;
		isOpen: boolean;
	}>();

	defineEmits<{
		"new-chat": [];
		"select-conversation": [id: string];
		"delete-conversation": [id: string];
	}>();

	const searchQuery = ref("");

	const filteredConversations = computed(() => {
		if (!searchQuery.value) return props.conversations;
		const q = searchQuery.value.toLowerCase();
		return props.conversations.filter((c) => c.title.toLowerCase().includes(q));
	});
</script>

<style scoped>
	.sidebar {
		width: var(--sidebar-width);
		height: 100vh;
		background: var(--sidebar-bg);
		border-right: 1px solid var(--sidebar-border);
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		transition: width 0.25s ease, opacity 0.25s ease;
		overflow: hidden;
		position: relative;
	}
	.sidebar--collapsed {
		width: 0;
		border-right: none;
	}
	.sidebar-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		width: var(--sidebar-width);
	}

	/* Logo */
	.sidebar-logo {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 14px 12px;
		flex-shrink: 0;
	}
	.logo-mark {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.logo-text {
		font-size: 15px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.3px;
	}

	/* New Chat */
	.new-chat-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 10px 8px;
		padding: 8px 12px;
		background: var(--primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
		font-family: var(--font-sans);
	}
	.new-chat-btn:hover {
		background: var(--primary-hover);
	}

	/* Search */
	.search-wrapper {
		position: relative;
		margin: 0 10px 10px;
	}
	.search-icon {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}
	.search-input {
		width: 100%;
		padding: 7px 10px 7px 30px;
		background: var(--surface-muted);
		border: 1px solid var(--border-muted);
		border-radius: var(--radius-sm);
		font-size: 12.5px;
		color: var(--text-primary);
		font-family: var(--font-sans);
		transition: border-color 0.15s, background 0.15s;
	}
	.search-input:focus {
		border-color: var(--primary);
		background: var(--surface);
	}
	.search-input::placeholder {
		color: var(--text-placeholder);
	}

	/* Sections */
	.sidebar-section {
		flex: 1;
		overflow-y: auto;
		padding: 0 6px;
		min-height: 0;
	}
	.section-label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.6px;
		padding: 8px 6px 4px;
	}
	.docs-link {
		font-size: 11px;
		font-weight: 500;
		color: var(--primary);
		text-decoration: none;
		text-transform: none;
		letter-spacing: 0;
	}

	/* Doc List */

	/* Footer */
	.sidebar-footer {
		border-top: 1px solid var(--sidebar-border);
		padding: 8px 6px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.user-area {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 7px 10px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.12s;
	}
	.user-area:hover {
		background: var(--sidebar-item-hover);
	}
	.avatar {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--primary);
		color: white;
		font-size: 11px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.user-info {
		min-width: 0;
	}
	.user-name {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-primary);
		line-height: 1.2;
	}
	.user-plan {
		font-size: 11px;
		color: var(--text-muted);
	}
</style>
