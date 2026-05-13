<template>
	<div class="loading-state">
		<div class="loading-dots">
			<span class="typing-dot" />
			<span class="typing-dot" />
			<span class="typing-dot" />
		</div>
		<p v-if="label" class="loading-label">{{ label }}</p>
	</div>
</template>

<script setup lang="ts">
	defineProps<{ label?: string }>();
</script>

<style scoped>
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 32px;
	}
	.loading-dots {
		display: flex;
		gap: 5px;
		align-items: center;
	}
	.loading-label {
		font-size: 13px;
		color: var(--text-muted);
	}
</style>
