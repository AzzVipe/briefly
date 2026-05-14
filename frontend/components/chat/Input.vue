<template>
	<div class="input-area">
		<div class="input-wrapper" :class="{ 'input-wrapper--focused': isFocused }">
			<textarea
				ref="textareaRef"
				v-model="inputText"
				class="chat-textarea"
				:placeholder="placeholder"
				rows="1"
				:disabled="disabled"
				@focus="isFocused = true"
				@blur="isFocused = false"
				@keydown.enter.exact.prevent="handleSend"
				@input="autoResize" />
			<div class="input-actions">
				<div class="input-hint">
					<kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
				</div>
				<button
					class="send-btn"
					:class="{ 'send-btn--active': canSend }"
					:disabled="!canSend"
					@click="handleSend">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path d="M12 7L2 2l2.5 5L2 12l10-5z" fill="currentColor" />
					</svg>
				</button>
			</div>
		</div>
		<div class="input-footer">
			Briefly can make mistakes. Verify important information.
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps<{
		disabled?: boolean;
		placeholder?: string;
	}>();

	const emit = defineEmits<{
		send: [message: string];
	}>();

	const inputText = ref("");
	const isFocused = ref(false);
	const textareaRef = ref<HTMLTextAreaElement | null>(null);

	const canSend = computed(
		() => inputText.value.trim().length > 0 && !props.disabled
	);

	function handleSend() {
		if (!canSend.value) return;
		const text = inputText.value.trim();
		inputText.value = "";
		nextTick(() => {
			if (textareaRef.value) textareaRef.value.style.height = "auto";
		});
		emit("send", text);
	}

	function autoResize() {
		const el = textareaRef.value;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 200) + "px";
	}
</script>

<style scoped>
	.input-area {
		padding: 12px 20px 16px;
		background: var(--surface);
		border-top: 1px solid var(--border);
		/* subtle glass */
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}
	.input-wrapper {
		display: flex;
		flex-direction: column;
		background: var(--surface-muted);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: border-color 0.15s, box-shadow 0.15s;
	}
	.input-wrapper--focused {
		border-color: rgba(6, 182, 212, 0.5);
		box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.08);
	}
	.chat-textarea {
		width: 100%;
		padding: 12px 14px 0;
		background: transparent;
		border: none;
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--text-primary);
		resize: none;
		min-height: 44px;
		max-height: 200px;
		overflow-y: auto;
		line-height: 1.5;
	}
	.chat-textarea::placeholder {
		color: var(--text-placeholder);
	}
	.chat-textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 10px 8px 14px;
	}
	.input-hint {
		font-size: 11px;
		color: var(--text-muted);
	}
	.input-hint kbd {
		display: inline-block;
		padding: 1px 5px;
		background: var(--surface-active);
		border: 1px solid var(--border);
		border-radius: 4px;
		font-family: var(--font-sans);
		font-size: 10px;
		color: var(--text-secondary);
	}
	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-sm);
		border: none;
		background: var(--surface-active);
		color: var(--text-muted);
		cursor: not-allowed;
		transition: opacity 0.15s;
	}
	/* gradient send button when active */
	.send-btn--active {
		background: var(--primary-gradient);
		color: white;
		cursor: pointer;
	}
	.send-btn--active:hover {
		opacity: 0.85;
	}

	.input-footer {
		text-align: center;
		font-size: 11px;
		color: var(--text-muted);
		margin-top: 8px;
	}
</style>
