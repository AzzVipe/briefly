<template>
	<div class="sources">
		<button class="sources-toggle" @click="isOpen = !isOpen">
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
				<path
					d="M2 3h8M2 6h6M2 9h4"
					stroke="currentColor"
					stroke-width="1.3"
					stroke-linecap="round" />
			</svg>
			<span
				>{{ sources.length }} source{{ sources.length !== 1 ? "s" : "" }}</span
			>
			<svg
				class="chevron"
				:class="{ 'chevron--open': isOpen }"
				width="10"
				height="10"
				viewBox="0 0 10 10"
				fill="none">
				<path
					d="M2.5 3.5L5 6l2.5-2.5"
					stroke="currentColor"
					stroke-width="1.3"
					stroke-linecap="round" />
			</svg>
		</button>

		<Transition name="fade">
			<div v-if="isOpen" class="sources-list">
				<div
					v-for="(source, i) in sources"
					:key="source.id"
					class="source-item">
					<div class="source-num">{{ i + 1 }}</div>
					<div class="source-content">
						<div class="source-meta">
							<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
								<path
									d="M1.5 1.5A.5.5 0 012 1h5l2.5 2.5V9.5a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-8z"
									stroke="currentColor"
									stroke-width="1" />
							</svg>
							<span>Chunk {{ source.chunkIndex }}</span>
							<span class="source-distance"
								>· {{ (source.distance * 100).toFixed(0) }}% match</span
							>
						</div>
						<p class="source-text">{{ truncate(source.content) }}</p>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
	import type { Source } from "~/types";

	defineProps<{ sources: Source[] }>();

	const isOpen = ref(false);

	function truncate(text: string, max = 160): string {
		if (text.length <= max) return text;
		return text.slice(0, max) + "…";
	}
</script>

<style scoped>
	.sources {
		margin-top: 12px;
	}

	.sources-toggle {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 5px 10px;
		background: var(--surface-muted);
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
		font-size: 12px;
		font-weight: 500;
		color: var(--text-secondary);
		cursor: pointer;
		transition: background 0.12s, border-color 0.12s, color 0.12s;
		font-family: var(--font-sans);
	}
	.sources-toggle:hover {
		background: var(--surface-hover);
		border-color: rgba(6, 182, 212, 0.3);
		color: #22d3ee;
	}
	.chevron {
		transition: transform 0.2s;
	}
	.chevron--open {
		transform: rotate(180deg);
	}

	.sources-list {
		margin-top: 8px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.source-item {
		display: flex;
		gap: 8px;
		padding: 10px 12px;
		background: var(--surface-muted);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		transition: border-color 0.12s;
	}
	.source-item:hover {
		border-color: rgba(6, 182, 212, 0.25);
	}

	.source-num {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: rgba(6, 182, 212, 0.12);
		color: #22d3ee;
		font-size: 11px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.source-content {
		flex: 1;
		min-width: 0;
	}
	.source-meta {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		color: var(--text-muted);
		margin-bottom: 4px;
	}
	.source-distance {
		color: var(--success);
	}
	.source-text {
		font-size: 12.5px;
		color: var(--text-secondary);
		line-height: 1.5;
	}
</style>
