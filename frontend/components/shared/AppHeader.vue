<template>
	<header class="app-header">
		<div class="header-left">
			<button
				v-if="showSidebarToggle"
				class="sidebar-toggle"
				@click="$emit('toggle-sidebar')"
				title="Toggle sidebar">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<rect
						x="2"
						y="3.5"
						width="12"
						height="1.5"
						rx="0.75"
						fill="currentColor" />
					<rect
						x="2"
						y="7.25"
						width="8"
						height="1.5"
						rx="0.75"
						fill="currentColor" />
					<rect
						x="2"
						y="11"
						width="12"
						height="1.5"
						rx="0.75"
						fill="currentColor" />
				</svg>
			</button>
			<slot name="left" />
		</div>
		<div class="header-center">
			<slot name="center" />
		</div>
		<div class="header-right">
			<slot name="right" />
		</div>
	</header>
</template>

<script setup lang="ts">
	defineProps<{
		showSidebarToggle?: boolean;
	}>();
	defineEmits<{
		"toggle-sidebar": [];
	}>();
</script>

<style scoped>
	.app-header {
		height: var(--header-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
		position: sticky;
		top: 0;
		z-index: 10;
	}
	.header-left,
	.header-right {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}
	.header-center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 12px;
	}
	.sidebar-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: none;
		color: var(--text-secondary);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.sidebar-toggle:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}
</style>
