<template>
	<div class="empty-state">
		<div class="empty-icon">
			<slot name="icon">
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
					<path
						d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z"
						stroke="currentColor"
						stroke-width="1.5" />
					<path
						d="M16 11v6M16 20v1"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round" />
				</svg>
			</slot>
		</div>
		<h3 class="empty-title">{{ title }}</h3>
		<p v-if="description" class="empty-description">{{ description }}</p>
		<div v-if="$slots.action" class="empty-action">
			<slot name="action" />
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		title: string;
		description?: string;
	}>();
</script>

<style scoped>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 24px;
		text-align: center;
	}
	.empty-icon {
		width: 56px;
		height: 56px;
		border-radius: var(--radius-lg);
		background: var(--surface-muted);
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
	}
	.empty-title {
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 6px;
	}
	.empty-description {
		font-size: 13px;
		color: var(--text-muted);
		max-width: 280px;
		line-height: 1.5;
	}
	.empty-action {
		margin-top: 20px;
	}
</style>
