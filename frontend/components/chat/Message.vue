<template>
	<div class="message" :class="`message--${message.role}`">
		<!-- User Message -->
		<div v-if="message.role === 'user'" class="user-message">
			<div class="user-bubble">{{ message.content }}</div>
			<div class="message-time">{{ formatTime(message.timestamp) }}</div>
		</div>

		<!-- Assistant Message -->
		<div v-else class="assistant-message">
			<div class="assistant-avatar">
				<!-- gradient avatar mark -->
				<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
					<rect width="28" height="28" rx="8" fill="url(#avatar-grad)" />
					<path
						d="M8 14.5L11.5 18L20 10"
						stroke="white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round" />
					<defs>
						<linearGradient
							id="avatar-grad"
							x1="0"
							y1="0"
							x2="28"
							y2="28"
							gradientUnits="userSpaceOnUse">
							<stop offset="0%" stop-color="#06b6d4" />
							<stop offset="100%" stop-color="#7c3aed" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div class="assistant-content">
				<div class="assistant-header">
					<span class="assistant-name">Briefly</span>
					<span class="message-time">{{ formatTime(message.timestamp) }}</span>
				</div>
				<div class="assistant-body">
					<SharedMarkdownRenderer
						v-if="message.content"
						:content="message.content" />
					<span v-if="message.isStreaming" class="typing-cursor" />
					<div
						v-if="message.isStreaming && !message.content"
						class="typing-indicator">
						<span class="typing-dot" />
						<span class="typing-dot" />
						<span class="typing-dot" />
					</div>
				</div>
				<ChatSources
					v-if="message.sources?.length"
					:sources="message.sources" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { Message } from "~/types";

	defineProps<{ message: Message }>();

	function formatTime(date: Date): string {
		return new Date(date).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	}
</script>

<style scoped>
	.message {
		display: flex;
		flex-direction: column;
		padding: 0 0 4px;
	}

	/* User */
	.user-message {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4px;
	}
	.user-bubble {
		background: var(--user-bubble);
		color: var(--user-bubble-text);
		border-radius: var(--radius-lg) var(--radius-lg) var(--radius-xs)
			var(--radius-lg);
		padding: 10px 14px;
		font-size: 14px;
		line-height: 1.5;
		max-width: 80%;
		white-space: pre-wrap;
		word-break: break-word;
		/* subtle inner glow */
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	/* Assistant */
	.assistant-message {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.assistant-avatar {
		width: 28px;
		height: 28px;
		flex-shrink: 0;
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 2px;
	}
	.assistant-content {
		flex: 1;
		min-width: 0;
	}
	.assistant-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}
	.assistant-name {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-primary);
	}
	.assistant-body {
		position: relative;
	}
	.typing-indicator {
		display: flex;
		gap: 4px;
		align-items: center;
		padding: 4px 0;
	}
	.message-time {
		font-size: 11px;
		color: var(--text-muted);
	}
</style>
