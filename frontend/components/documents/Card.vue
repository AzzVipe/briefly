<template>
	<div class="doc-card">
		<div class="doc-card-icon">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M5 3a1.5 1.5 0 000 3h10a1.5 1.5 0 000-3H5z"
					fill="var(--error)"
					opacity="0.15" />
				<path
					d="M3 3.5A1.5 1.5 0 014.5 2h7l4 4v10.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 013 16.5v-13z"
					stroke="var(--error)"
					stroke-width="1.3" />
				<path d="M11.5 2v4.5H16" stroke="var(--error)" stroke-width="1.3" />
				<path
					d="M7 10h6M7 13h4"
					stroke="var(--error)"
					stroke-width="1.1"
					stroke-linecap="round"
					opacity="0.6" />
			</svg>
		</div>
		<div class="doc-card-info">
			<div class="doc-card-name" :title="document.name">
				{{ document.name }}
			</div>
			<div class="doc-card-meta">
				<span v-if="document.chunks">{{ document.chunks }} chunks</span>
				<span v-if="document.chunks">·</span>
				<span>{{ formatDate(document.createdAt) }}</span>
			</div>
		</div>
		<button
			class="doc-delete-btn"
			@click="$emit('delete', document.id)"
			title="Delete document">
			<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
				<path
					d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v4M7.5 6v4M3.5 3.5l.5 7a.5.5 0 00.5.5h4a.5.5 0 00.5-.5l.5-7"
					stroke="currentColor"
					stroke-width="1.1"
					stroke-linecap="round" />
			</svg>
		</button>
	</div>
</template>

<script setup lang="ts">
	import type { Document } from "~/types";

	defineProps<{ document: Document }>();
	defineEmits<{ delete: [id: string] }>();

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString([], {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}
</script>

<style scoped>
	.doc-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		transition: border-color 0.15s, box-shadow 0.15s;
	}
	.doc-card:hover {
		border-color: var(--border-strong);
		box-shadow: var(--shadow-sm);
	}
	.doc-card-icon {
		width: 36px;
		height: 36px;
		background: var(--error-light);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.doc-card-info {
		flex: 1;
		min-width: 0;
	}
	.doc-card-name {
		font-size: 13.5px;
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 2px;
	}
	.doc-card-meta {
		font-size: 12px;
		color: var(--text-muted);
		display: flex;
		gap: 5px;
		align-items: center;
	}
	.doc-delete-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		background: none;
		color: var(--text-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.12s, color 0.12s;
		flex-shrink: 0;
	}
	.doc-delete-btn:hover {
		background: var(--error-light);
		color: var(--error);
	}
</style>
