<template>
	<div
		class="dropzone"
		:class="{
			'dropzone--dragging': isDragging,
			'dropzone--uploading': uploadState.status === 'uploading',
			'dropzone--success': uploadState.status === 'success',
			'dropzone--error': uploadState.status === 'error',
		}"
		@dragover.prevent="isDragging = true"
		@dragleave.prevent="isDragging = false"
		@drop.prevent="handleDrop"
		@click="triggerFileInput">
		<input
			ref="fileInputRef"
			type="file"
			accept=".pdf"
			class="file-input"
			@change="handleFileChange" />

		<!-- Idle state -->
		<div v-if="uploadState.status === 'idle'" class="dropzone-content">
			<div
				class="dropzone-icon"
				:class="{ 'dropzone-icon--dragging': isDragging }">
				<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
					<path
						d="M14 4v14M8 10l6-6 6 6"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round" />
					<path
						d="M4 20v1.5A2.5 2.5 0 006.5 24h15a2.5 2.5 0 002.5-2.5V20"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round" />
				</svg>
			</div>
			<div class="dropzone-title">
				{{ isDragging ? "Drop PDF here" : "Upload a PDF document" }}
			</div>
			<div class="dropzone-desc">Drag & drop or click to browse · PDF only</div>
		</div>

		<!-- Uploading -->
		<div
			v-else-if="uploadState.status === 'uploading'"
			class="dropzone-content"
			@click.stop>
			<div class="upload-progress-icon">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					class="spin">
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="var(--border)"
						stroke-width="2" />
					<path
						d="M12 2a10 10 0 019.6 7.2"
						stroke="var(--primary)"
						stroke-width="2"
						stroke-linecap="round" />
				</svg>
			</div>
			<div class="dropzone-title">Uploading...</div>
			<div class="progress-bar-wrapper">
				<div class="progress-bar">
					<div
						class="progress-fill"
						:style="{ width: `${uploadState.progress}%` }" />
				</div>
				<span class="progress-text"
					>{{ Math.round(uploadState.progress) }}%</span
				>
			</div>
		</div>

		<!-- Success -->
		<div
			v-else-if="uploadState.status === 'success'"
			class="dropzone-content"
			@click.stop>
			<div class="status-icon status-icon--success">
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
					<path
						d="M4 11.5l5 5L18 7"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round" />
				</svg>
			</div>
			<div class="dropzone-title">Uploaded successfully!</div>
			<div class="dropzone-desc">{{ uploadState.document?.name }}</div>
		</div>

		<!-- Error -->
		<div v-else-if="uploadState.status === 'error'" class="dropzone-content">
			<div class="status-icon status-icon--error">
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
					<path
						d="M11 7v5M11 15v1"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round" />
				</svg>
			</div>
			<div class="dropzone-title">Upload failed</div>
			<div class="dropzone-desc error-text">{{ uploadState.error }}</div>
			<div class="dropzone-retry">Click to try again</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { UploadState } from "~/types";

	defineProps<{
		uploadState: UploadState;
	}>();

	const emit = defineEmits<{
		upload: [file: File];
	}>();

	const isDragging = ref(false);
	const fileInputRef = ref<HTMLInputElement | null>(null);

	function triggerFileInput() {
		fileInputRef.value?.click();
	}

	function handleDrop(e: DragEvent) {
		isDragging.value = false;
		const file = e.dataTransfer?.files[0];
		if (file) emit("upload", file);
	}

	function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) emit("upload", file);
		// Reset input
		if (fileInputRef.value) fileInputRef.value.value = "";
	}
</script>

<style scoped>
	.dropzone {
		border: 2px dashed var(--border-strong);
		border-radius: var(--radius-lg);
		padding: 40px 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		position: relative;
		background: var(--surface);
	}
	.dropzone:hover {
		border-color: var(--primary);
		background: var(--primary-light);
	}
	.dropzone--dragging {
		border-color: var(--primary);
		background: var(--primary-light);
	}
	.dropzone--uploading,
	.dropzone--success {
		cursor: default;
	}
	.dropzone--error {
		border-color: var(--error);
		background: var(--error-light);
	}
	.dropzone--success {
		border-color: var(--success);
		background: var(--success-light);
	}
	.file-input {
		display: none;
	}
	.dropzone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-align: center;
	}
	.dropzone-icon {
		width: 56px;
		height: 56px;
		border-radius: var(--radius-lg);
		background: var(--surface-muted);
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s, color 0.15s;
	}
	.dropzone-icon--dragging {
		background: var(--primary-muted);
		color: var(--primary);
	}
	.dropzone-title {
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);
	}
	.dropzone-desc {
		font-size: 13px;
		color: var(--text-muted);
	}
	.error-text {
		color: var(--error);
	}
	.dropzone-retry {
		font-size: 12px;
		color: var(--primary);
		margin-top: 4px;
	}

	/* Progress */
	.upload-progress-icon .spin {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.progress-bar-wrapper {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 220px;
	}
	.progress-bar {
		flex: 1;
		height: 4px;
		background: var(--surface-muted);
		border-radius: 99px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: var(--primary);
		border-radius: 99px;
		transition: width 0.3s ease;
	}
	.progress-text {
		font-size: 12px;
		color: var(--text-muted);
		min-width: 30px;
	}

	/* Status icons */
	.status-icon {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.status-icon--success {
		background: var(--success-light);
		color: var(--success);
	}
	.status-icon--error {
		background: var(--error-light);
		color: var(--error);
	}
</style>
