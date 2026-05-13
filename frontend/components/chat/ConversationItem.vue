<template>
	<div
		class="conv-item"
		:class="{ 'conv-item--active': isActive }"
		@click="$emit('select')">
		<div class="conv-icon">
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
				<path
					d="M2 2h8a1 1 0 011 1v5a1 1 0 01-1 1H5l-3 2V3a1 1 0 011-1z"
					stroke="currentColor"
					stroke-width="1.1" />
			</svg>
		</div>
		<div class="conv-content">
			<div class="conv-title">{{ conversation.title }}</div>
			<div class="conv-meta">{{ timeAgo(conversation.createdAt) }}</div>
		</div>
		<button class="conv-delete" @click.stop="$emit('delete')" title="Delete">
			<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
				<path
					d="M2 2l7 7M9 2L2 9"
					stroke="currentColor"
					stroke-width="1.3"
					stroke-linecap="round" />
			</svg>
		</button>
	</div>
</template>

<script setup lang="ts">
	import type { Conversation } from "~/types";

	defineProps<{
		conversation: Conversation;
		isActive: boolean;
	}>();

	defineEmits<{ select: []; delete: [] }>();

	function timeAgo(date: Date): string {
		const diff = Date.now() - new Date(date).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return "Just now";
		if (mins < 60) return `${mins}m ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h ago`;
		return `${Math.floor(hrs / 24)}d ago`;
	}
</script>

<style scoped>
	.conv-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 8px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.12s;
		group: true;
	}
	.conv-item:hover {
		background: var(--sidebar-item-hover);
	}
	.conv-item--active {
		background: var(--sidebar-item-active);
	}
	.conv-item--active .conv-title {
		color: var(--text-primary);
		font-weight: 500;
	}
	.conv-icon {
		color: var(--text-muted);
		flex-shrink: 0;
		margin-top: 1px;
	}
	.conv-item--active .conv-icon {
		color: var(--primary);
	}
	.conv-content {
		flex: 1;
		min-width: 0;
	}
	.conv-title {
		font-size: 12.5px;
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.3;
	}
	.conv-meta {
		font-size: 11px;
		color: var(--text-muted);
		margin-top: 1px;
	}
	.conv-delete {
		display: none;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border: none;
		background: none;
		color: var(--text-muted);
		border-radius: var(--radius-xs);
		cursor: pointer;
		flex-shrink: 0;
		transition: background 0.12s, color 0.12s;
	}
	.conv-item:hover .conv-delete {
		display: flex;
	}
	.conv-delete:hover {
		background: var(--error-light);
		color: var(--error);
	}
</style>
