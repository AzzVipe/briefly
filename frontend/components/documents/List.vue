<template>
	<div class="doc-list">
		<TransitionGroup name="fade">
			<DocumentsCard
				v-for="doc in documents"
				:key="doc.id"
				:document="doc"
				@delete="$emit('delete', $event)" />
		</TransitionGroup>
		<SharedEmptyState
			v-if="!documents.length"
			title="No documents yet"
			description="Upload a PDF to get started. You can then ask questions about its content.">
			<template #icon>
				<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
					<path
						d="M6 4a2 2 0 012-2h9l6 6v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4z"
						stroke="currentColor"
						stroke-width="1.5" />
					<path d="M17 2v6h6" stroke="currentColor" stroke-width="1.5" />
				</svg>
			</template>
		</SharedEmptyState>
	</div>
</template>

<script setup lang="ts">
	import type { Document } from "~/types";

	defineProps<{ documents: Document[] }>();
	defineEmits<{ delete: [id: string] }>();
</script>

<style scoped>
	.doc-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
