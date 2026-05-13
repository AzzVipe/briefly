<template>
	<div class="conv-list">
		<TransitionGroup name="slide-left">
			<ChatConversationItem
				v-for="conv in conversations"
				:key="conv.id"
				:conversation="conv"
				:is-active="conv.id === activeId"
				@select="$emit('select', conv.id)"
				@delete="$emit('delete', conv.id)" />
		</TransitionGroup>
		<div v-if="!conversations.length" class="conv-empty">
			No conversations yet
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { Conversation } from "~/types";

	defineProps<{
		conversations: Conversation[];
		activeId: string | null;
	}>();

	defineEmits<{
		select: [id: string];
		delete: [id: string];
	}>();
</script>

<style scoped>
	.conv-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.conv-empty {
		font-size: 12px;
		color: var(--text-muted);
		padding: 6px 6px;
	}
</style>
