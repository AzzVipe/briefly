<template>
	<div class="docs-layout">
		<!-- Main -->
		<div class="docs-main">
			<SharedAppHeader
				:show-sidebar-toggle="true"
				@toggle-sidebar="sidebarOpen = !sidebarOpen">
				<template #left>
					<div class="breadcrumb">
						<NuxtLink to="/chat" class="breadcrumb-link">Chat</NuxtLink>
						<span class="breadcrumb-sep">/</span>
						<span class="breadcrumb-current">Documents</span>
					</div>
				</template>
				<template #right>
					<div class="doc-stats">
						<span class="stat-badge"
							>{{ documents.length }} document{{
								documents.length !== 1 ? "s" : ""
							}}</span
						>
					</div>
				</template>
			</SharedAppHeader>

			<div class="docs-content">
				<div class="docs-inner">
					<!-- Page title -->
					<div class="page-header">
						<div>
							<h1 class="page-title">Documents</h1>
							<p class="page-desc">
								Upload PDF files to chat with their content using AI.
							</p>
						</div>
					</div>

					<!-- Upload zone -->
					<DocumentsUploadDropzone
						:upload-state="uploadState"
						@upload="handleUpload" />

					<!-- Upload alert -->
					<Transition name="fade">
						<div v-if="uploadState.status === 'error'" class="upload-error">
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
								<circle
									cx="7"
									cy="7"
									r="6"
									stroke="currentColor"
									stroke-width="1.2" />
								<path
									d="M7 4.5v3M7 9v.5"
									stroke="currentColor"
									stroke-width="1.2"
									stroke-linecap="round" />
							</svg>
							{{ uploadState.error }}
						</div>
					</Transition>

					<!-- Document list -->
					<div class="docs-list-section">
						<div class="list-header">
							<h2 class="list-title">Uploaded documents</h2>
							<div class="list-count">{{ documents.length }}</div>
						</div>
						<DocumentsList :documents="documents" @delete="handleDelete" />
					</div>

					<!-- Tips -->
					<div class="tips-section">
						<div class="tip-card">
							<div class="tip-icon">💡</div>
							<div>
								<div class="tip-title">Best results</div>
								<div class="tip-desc">
									Smaller, focused documents provide better answers than large,
									general files. Each document is split into chunks for
									retrieval.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useWindowSize } from "@vueuse/core";

	const {
		documents,
		uploadState,
		uploadDocument,
		deleteDocument,
		fetchDocuments,
	} = useDocuments();

	const sidebarOpen = ref(true);
	const { width } = useWindowSize();

	onMounted(async () => {
		await fetchDocuments();
	});

	async function handleUpload(file: File) {
		await uploadDocument(file);
	}

	async function handleDelete(id: string) {
		await deleteDocument(id);
	}

	useHead({ title: "Documents - Briefly" });
</script>

<style scoped>
	.docs-layout {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: 100vh;
		overflow: hidden;
	}
	.docs-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.docs-content {
		flex: 1;
		overflow-y: auto;
		padding: 24px;
	}
	.docs-inner {
		max-width: 680px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* Header */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
	}
	.breadcrumb-link {
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.12s;
	}
	.breadcrumb-link:hover {
		color: var(--text-primary);
	}
	.breadcrumb-sep {
		color: var(--text-muted);
	}
	.breadcrumb-current {
		color: var(--text-primary);
		font-weight: 500;
	}
	.stat-badge {
		padding: 4px 10px;
		background: var(--surface-muted);
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
		font-size: 12px;
		color: var(--text-secondary);
	}

	/* Page header */
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}
	.page-title {
		font-size: 22px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.3px;
		margin-bottom: 4px;
	}
	.page-desc {
		font-size: 13.5px;
		color: var(--text-muted);
	}

	/* Error */
	.upload-error {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		background: var(--error-light);
		border: 1px solid #fca5a5;
		border-radius: var(--radius-md);
		font-size: 13px;
		color: var(--error);
	}

	/* List */
	.docs-list-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.list-header {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.list-title {
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);
	}
	.list-count {
		width: 22px;
		height: 22px;
		background: var(--surface-muted);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	/* Tips */
	.tips-section {
		padding-bottom: 24px;
	}
	.tip-card {
		display: flex;
		gap: 12px;
		padding: 14px 16px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
	}
	.tip-icon {
		font-size: 18px;
		flex-shrink: 0;
	}
	.tip-title {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 3px;
	}
	.tip-desc {
		font-size: 12.5px;
		color: var(--text-muted);
		line-height: 1.5;
	}
</style>
