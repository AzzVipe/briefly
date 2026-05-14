<template>
	<div class="app-layout">
		<ChatSidebar
			:conversations="conversations"
			:active-conversation-id="activeConversationId"
			:is-open="sidebarOpen"
			@new-chat="handleNewChat"
			@select-conversation="handleSelectConversation"
			@delete-conversation="handleDeleteConversation" />

		<div
			v-if="sidebarOpen && isMobile"
			class="sidebar-overlay"
			@click="sidebarOpen = false" />

		<div class="main-area">
			<!-- Header -->
			<SharedAppHeader
				:show-sidebar-toggle="true"
				@toggle-sidebar="sidebarOpen = !sidebarOpen">
				<template #left>
					<span class="header-conv-title">{{
						activeConversation?.title || "New conversation"
					}}</span>
				</template>
				<template #right>
					<NuxtLink to="/documents" class="header-action-btn">
						<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
							<path
								d="M2.5 1.5h5.5L11 4v7.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5z"
								stroke="currentColor"
								stroke-width="1.2" />
							<path d="M8 1.5V4.5h3" stroke="currentColor" stroke-width="1.2" />
						</svg>
						Documents
					</NuxtLink>
					<div class="model-badge">RAG</div>
				</template>
			</SharedAppHeader>

			<!-- Attached docs bar -->
			<div class="context-bar">
				<div class="context-bar-left">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
						<path
							d="M2 1.5h5L10 4.5v6a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5z"
							stroke="currentColor"
							stroke-width="1.1" />
					</svg>
					<span class="context-label">Context</span>
					<div class="doc-chips">
						<span v-if="isLoadingDocs" class="chip chip--loading"
							>Loading…</span
						>
						<template v-else-if="attachedDocs.length">
							<span v-for="ad in attachedDocs" :key="ad.id" class="chip">
								{{ ad.document.name }}
							</span>
						</template>
						<span v-else class="context-empty">No documents attached</span>
					</div>
				</div>
				<div class="context-bar-right">
					<!-- Upload directly to this conversation -->
					<label class="ctx-btn" title="Upload PDF to this conversation">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
							<path
								d="M6 1v7M3 4l3-3 3 3"
								stroke="currentColor"
								stroke-width="1.3"
								stroke-linecap="round"
								stroke-linejoin="round" />
							<path
								d="M1.5 9.5v1a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-1"
								stroke="currentColor"
								stroke-width="1.3"
								stroke-linecap="round" />
						</svg>
						Upload
						<input
							type="file"
							accept=".pdf"
							class="file-input-hidden"
							@change="handleInlineUpload" />
					</label>
					<!-- Attach existing doc -->
					<button
						class="ctx-btn"
						:disabled="!activeConversationId"
						@click="showAttachModal = true"
						title="Attach existing document">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
							<path
								d="M2 6h8M6 2v8"
								stroke="currentColor"
								stroke-width="1.3"
								stroke-linecap="round" />
						</svg>
						Attach
					</button>
				</div>
			</div>

			<!-- Messages -->
			<div class="messages-area" ref="messagesAreaRef">
				<!-- Welcome -->
				<Transition name="fade">
					<div v-if="!hasMessages && !isLoadingMessages" class="welcome-area">
						<div class="welcome-content">
							<div class="welcome-logo">
								<Logo />
							</div>
							<h1 class="welcome-title">
								{{
									activeConversationId
										? "Ready to chat"
										: "Start a conversation"
								}}
							</h1>
							<p class="welcome-desc">
								<template v-if="!activeConversationId">
									Send a message to create a new conversation. Upload PDFs to
									add context.
								</template>
								<template v-else-if="!attachedDocs.length">
									No documents attached yet. Upload or attach PDFs above to
									scope retrieval to this conversation.
								</template>
								<template v-else>
									{{ attachedDocs.length }} document{{
										attachedDocs.length !== 1 ? "s" : ""
									}}
									attached. Ask anything about them.
								</template>
							</p>
							<div
								v-if="activeConversationId && attachedDocs.length"
								class="starter-prompts">
								<button
									v-for="p in starterPrompts"
									:key="p"
									class="starter-btn"
									@click="handleSend(p)">
									{{ p }}
								</button>
							</div>
						</div>
					</div>
				</Transition>

				<!-- Loading messages skeleton -->
				<div v-if="isLoadingMessages" class="messages-skeleton">
					<div class="skeleton-msg skeleton-msg--assistant" />
					<div class="skeleton-msg skeleton-msg--user" />
					<div class="skeleton-msg skeleton-msg--assistant" />
				</div>

				<!-- Messages list -->
				<div v-if="hasMessages" class="messages-list">
					<TransitionGroup name="message">
						<ChatMessage v-for="msg in messages" :key="msg.id" :message="msg" />
					</TransitionGroup>
				</div>

				<!-- Error -->
				<Transition name="fade">
					<div v-if="error" class="error-banner">
						<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
							<circle
								cx="6.5"
								cy="6.5"
								r="5.5"
								stroke="currentColor"
								stroke-width="1.2" />
							<path
								d="M6.5 4v3M6.5 8.5v.5"
								stroke="currentColor"
								stroke-width="1.2"
								stroke-linecap="round" />
						</svg>
						{{ error }}
					</div>
				</Transition>
				<div ref="scrollAnchorRef" />
			</div>

			<ChatInput
				:disabled="isLoading"
				:placeholder="inputPlaceholder"
				@send="handleSend" />
		</div>

		<!-- Attach existing doc modal -->
		<Teleport to="body">
			<Transition name="fade">
				<div
					v-if="showAttachModal"
					class="modal-backdrop"
					@click.self="showAttachModal = false">
					<div class="modal">
						<div class="modal-header">
							<span class="modal-title">Attach documents</span>
							<button class="modal-close" @click="showAttachModal = false">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
									<path
										d="M2 2l10 10M12 2L2 12"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round" />
								</svg>
							</button>
						</div>
						<p class="modal-desc">
							Select documents to attach to this conversation.
						</p>
						<div class="modal-list">
							<div v-if="!availableToAttach.length" class="modal-empty">
								No documents available.
								<NuxtLink to="/documents" @click="showAttachModal = false"
									>Upload some first →</NuxtLink
								>
							</div>
							<label
								v-for="doc in availableToAttach"
								:key="doc.id"
								class="modal-doc-item"
								:class="{
									'modal-doc-item--selected': pendingAttach.has(doc.id),
									'modal-doc-item--attached': isAlreadyAttached(doc.id),
								}">
								<input
									type="checkbox"
									class="modal-checkbox"
									:checked="
										pendingAttach.has(doc.id) || isAlreadyAttached(doc.id)
									"
									:disabled="isAlreadyAttached(doc.id)"
									@change="togglePending(doc.id)" />
								<div class="modal-doc-icon">
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
										<path
											d="M3 2A1 1 0 014 1h6l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V2z"
											stroke="var(--error)"
											stroke-width="1.1" />
										<path
											d="M10 1v3h3"
											stroke="var(--error)"
											stroke-width="1.1" />
									</svg>
								</div>
								<span class="modal-doc-name">{{ doc.name }}</span>
								<span
									v-if="isAlreadyAttached(doc.id)"
									class="modal-attached-badge"
									>attached</span
								>
							</label>
						</div>
						<div class="modal-footer">
							<button class="modal-cancel" @click="showAttachModal = false">
								Cancel
							</button>
							<button
								class="modal-confirm"
								:disabled="!pendingAttach.size || isAttaching"
								@click="confirmAttach">
								{{
									isAttaching
										? "Attaching…"
										: `Attach${
												pendingAttach.size ? ` (${pendingAttach.size})` : ""
										  }`
								}}
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
	import { useWindowSize } from "@vueuse/core";

	const {
		messages,
		isLoading,
		hasMessages,
		error,
		sendMessage,
		clearMessages,
		fetchMessages,
	} = useChat();
	const {
		conversations,
		activeConversationId,
		fetchConversations,
		setActive,
		deleteConversation,
		upsertConversation,
	} = useConversations();
	const { documents, fetchDocuments, uploadDocument } = useDocuments();
	const {
		attachedDocs,
		isLoadingDocs,
		fetchAttachedDocs,
		attachDocument,
		clearAttachedDocs,
	} = useConversationDocuments();

	const sidebarOpen = ref(true);
	const messagesAreaRef = ref<HTMLElement | null>(null);
	const scrollAnchorRef = ref<HTMLElement | null>(null);
	const isLoadingMessages = ref(false);
	const showAttachModal = ref(false);
	const pendingAttach = ref(new Set<string>());
	const isAttaching = ref(false);

	const { width } = useWindowSize();
	const isMobile = computed(() => width.value < 768);
	watch(
		isMobile,
		(v) => {
			sidebarOpen.value = !v;
		},
		{ immediate: true }
	);

	const activeConversation = computed(() =>
		conversations.value.find((c) => c.id === activeConversationId.value)
	);

	const inputPlaceholder = computed(() => {
		if (isLoading.value) return "Generating response…";
		if (activeConversationId.value && !attachedDocs.value.length)
			return "Attach documents above to enable scoped retrieval…";
		return "Ask a question about your documents…";
	});

	const starterPrompts = [
		"Summarize the key points",
		"What are the main findings?",
		"Explain the technical details",
		"What are the recommendations?",
	];

	// Documents not yet attached to this conversation
	const availableToAttach = computed(() => documents.value);

	function isAlreadyAttached(docId: string) {
		return attachedDocs.value.some((d) => d.documentId === docId);
	}

	function togglePending(docId: string) {
		const s = new Set(pendingAttach.value);
		if (s.has(docId)) s.delete(docId);
		else s.add(docId);
		pendingAttach.value = s;
	}

	async function confirmAttach() {
		if (!activeConversationId.value) return;
		isAttaching.value = true;
		try {
			for (const docId of pendingAttach.value) {
				await attachDocument(activeConversationId.value, docId);
			}
		} finally {
			isAttaching.value = false;
			pendingAttach.value = new Set();
			showAttachModal.value = false;
		}
	}

	async function handleInlineUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const result = await uploadDocument(
			file,
			activeConversationId.value ?? undefined
		);
		if (result) {
			// If there was no active conversation, backend created one — activate it
			if (!activeConversationId.value) {
				setActive(result.conversationId);
				upsertConversation({
					id: result.conversationId,
					title: result.document.name,
					createdAt: new Date().toISOString(),
				});
			}
			await fetchAttachedDocs(result.conversationId);
		}
		(e.target as HTMLInputElement).value = "";
	}

	async function handleSend(text: string) {
		if (!text.trim()) return;
		await sendMessage(text, activeConversationId.value ?? undefined);
		if (isMobile.value) sidebarOpen.value = false;
	}

	async function handleNewChat() {
		setActive(null);
		clearMessages();
		clearAttachedDocs();
		if (isMobile.value) sidebarOpen.value = false;
	}

	async function handleSelectConversation(id: string) {
		if (id === activeConversationId.value) return;
		setActive(id);
		clearMessages();
		clearAttachedDocs();
		isLoadingMessages.value = true;
		await Promise.all([fetchMessages(id), fetchAttachedDocs(id)]);
		isLoadingMessages.value = false;
		if (isMobile.value) sidebarOpen.value = false;
	}

	async function handleDeleteConversation(id: string) {
		await deleteConversation(id);
		if (activeConversationId.value === id) {
			clearMessages();
			clearAttachedDocs();
		}
	}

	// Auto-scroll
	watch(
		messages,
		async () => {
			await nextTick();
			scrollAnchorRef.value?.scrollIntoView({ behavior: "smooth" });
		},
		{ deep: true }
	);

	// Reset pending when modal closes
	watch(showAttachModal, (open) => {
		if (!open) pendingAttach.value = new Set();
	});

	onMounted(async () => {
		await Promise.all([fetchConversations(), fetchDocuments()]);
	});

	useHead({ title: "Briefly — Chat" });
</script>

<style scoped>
	.app-layout {
		display: flex;
		height: 100vh;
		overflow: hidden;
	}

	.sidebar-overlay {
		position: fixed;
		inset: 0;
		background: rgb(0 0 0 / 0.2);
		z-index: 20;
	}

	.main-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		background: var(--surface);
		overflow: hidden;
	}

	/* Header */
	.header-conv-title {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 280px;
	}
	.header-action-btn {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 5px 10px;
		background: var(--surface-muted);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: 12px;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		transition: background 0.12s;
	}
	.header-action-btn:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}
	.model-badge {
		padding: 3px 8px;
		background: var(--primary-light);
		color: var(--primary);
		border-radius: var(--radius-full);
		font-size: 11px;
		font-weight: 600;
	}

	/* Context bar */
	.context-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 7px 16px;
		border-bottom: 1px solid var(--border-muted);
		background: var(--surface-muted);
		min-height: 38px;
		flex-shrink: 0;
	}
	.context-bar-left {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
		flex: 1;
		color: var(--text-muted);
	}
	.context-label {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		flex-shrink: 0;
		color: var(--text-muted);
	}
	.doc-chips {
		display: flex;
		align-items: center;
		gap: 5px;
		flex-wrap: wrap;
		min-width: 0;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		padding: 2px 8px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
		font-size: 11.5px;
		color: var(--text-secondary);
		white-space: nowrap;
		max-width: 160px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.chip--loading {
		background: var(--surface-muted);
		color: var(--text-muted);
		animation: pulse 1.5s ease infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
	.context-empty {
		font-size: 12px;
		color: var(--text-muted);
		font-style: italic;
	}
	.context-bar-right {
		display: flex;
		gap: 5px;
		flex-shrink: 0;
	}
	.ctx-btn {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 9px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: 11.5px;
		font-weight: 500;
		color: var(--text-secondary);
		cursor: pointer;
		transition: background 0.12s, color 0.12s;
		position: relative;
		font-family: var(--font-sans);
	}
	.ctx-btn:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}
	.ctx-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}
	.file-input-hidden {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	/* Messages */
	.messages-area {
		flex: 1;
		overflow-y: auto;
		padding: 20px 0 8px;
	}
	.messages-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 720px;
		margin: 0 auto;
		padding: 0 24px;
	}

	/* Skeleton */
	.messages-skeleton {
		max-width: 720px;
		margin: 24px auto;
		padding: 0 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.skeleton-msg {
		height: 56px;
		border-radius: var(--radius-md);
		background: linear-gradient(
			90deg,
			var(--surface-muted) 25%,
			var(--surface-hover) 50%,
			var(--surface-muted) 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.4s ease infinite;
	}
	.skeleton-msg--user {
		width: 55%;
		align-self: flex-end;
	}
	.skeleton-msg--assistant {
		width: 80%;
	}
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Welcome */
	.welcome-area {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 70%;
		padding: 24px;
	}
	.welcome-content {
		max-width: 480px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.welcome-logo {
		margin-bottom: 4px;
	}
	.welcome-title {
		font-size: 20px;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.3px;
	}
	.welcome-desc {
		font-size: 13.5px;
		color: var(--text-muted);
		line-height: 1.6;
		max-width: 380px;
	}
	.starter-prompts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 7px;
		width: 100%;
		margin-top: 6px;
	}
	.starter-btn {
		padding: 9px 13px;
		background: var(--surface-muted);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		font-size: 12px;
		color: var(--text-secondary);
		cursor: pointer;
		text-align: left;
		transition: background 0.12s, color 0.12s;
		font-family: var(--font-sans);
		line-height: 1.4;
	}
	.starter-btn:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}

	/* Error */
	.error-banner {
		display: flex;
		align-items: center;
		gap: 8px;
		max-width: 720px;
		margin: 12px auto;
		padding: 10px 14px;
		background: var(--error-light);
		border: 1px solid #fca5a5;
		border-radius: var(--radius-md);
		font-size: 13px;
		color: var(--error);
	}

	/* Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgb(0 0 0 / 0.3);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	}
	.modal {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		width: 100%;
		max-width: 420px;
		box-shadow: var(--shadow-lg);
		overflow: hidden;
	}
	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 18px 12px;
	}
	.modal-title {
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);
	}
	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border: none;
		background: none;
		color: var(--text-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.12s;
	}
	.modal-close:hover {
		background: var(--surface-muted);
		color: var(--text-primary);
	}
	.modal-desc {
		font-size: 12.5px;
		color: var(--text-muted);
		padding: 0 18px 12px;
	}
	.modal-list {
		max-height: 260px;
		overflow-y: auto;
		padding: 4px 10px 8px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.modal-empty {
		padding: 16px;
		text-align: center;
		font-size: 13px;
		color: var(--text-muted);
	}
	.modal-empty a {
		color: var(--primary);
		text-decoration: none;
	}
	.modal-doc-item {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 9px 10px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.12s;
	}
	.modal-doc-item:hover {
		background: var(--surface-muted);
	}
	.modal-doc-item--selected {
		background: var(--primary-light);
	}
	.modal-checkbox {
		width: 14px;
		height: 14px;
		accent-color: var(--primary);
		flex-shrink: 0;
		cursor: pointer;
	}
	.modal-doc-icon {
		flex-shrink: 0;
	}
	.modal-doc-name {
		font-size: 13px;
		color: var(--text-primary);
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.modal-attached-badge {
		font-size: 10px;
		font-weight: 500;
		color: var(--success);
		background: var(--success-light);
		padding: 2px 6px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}
	.modal-footer {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
		padding: 12px 18px;
		border-top: 1px solid var(--border);
	}
	.modal-cancel {
		padding: 7px 14px;
		background: none;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: 13px;
		color: var(--text-secondary);
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.12s;
	}
	.modal-cancel:hover {
		background: var(--surface-muted);
	}
	.modal-confirm {
		padding: 7px 16px;
		background: var(--primary);
		border: none;
		border-radius: var(--radius-sm);
		font-size: 13px;
		font-weight: 500;
		color: white;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.12s;
	}
	.modal-confirm:hover:not(:disabled) {
		background: var(--primary-hover);
	}
	.modal-confirm:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.modal-doc-item--attached {
		opacity: 0.5;
		cursor: default;
	}

	@media (max-width: 768px) {
		.starter-prompts {
			grid-template-columns: 1fr;
		}
		.messages-list {
			padding: 0 16px;
		}
		.context-bar {
			flex-wrap: wrap;
			gap: 6px;
		}
	}
</style>
