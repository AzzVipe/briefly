<template>
	<div class="landing-page">
		<!-- Background glow -->
		<div class="landing-glow landing-glow--cyan" />
		<div class="landing-glow landing-glow--violet" />

		<!-- Navigation -->
		<header class="landing-header">
			<div class="landing-header-inner">
				<UiLogo :show-label="true" />

				<nav class="landing-nav">
					<a
						href="https://github.com/AzzVipe/briefly"
						target="_blank"
						rel="noopener noreferrer"
						class="nav-link">
						GitHub
					</a>

					<NuxtLink to="/chat" class="nav-cta gradient-primary">
						Open App
					</NuxtLink>
				</nav>
			</div>
		</header>

		<!-- Hero -->
		<section class="hero-section">
			<div class="hero-badge">
				<span class="hero-badge-dot" />
				Self-hosted conversational RAG workspace
			</div>

			<h1 class="hero-title">
				Chat with your PDFs
				<span class="hero-gradient-text">locally.</span>
			</h1>

			<p class="hero-description">
				Briefly is a private AI document workspace powered by Ollama, pgvector,
				and local LLMs. Upload PDFs, perform semantic search, and chat with your
				documents — without relying on cloud AI.
			</p>

			<div class="hero-actions">
				<NuxtLink to="/chat" class="hero-primary-btn gradient-primary">
					Start Chatting
				</NuxtLink>

				<a
					href="https://github.com/AzzVipe/briefly"
					target="_blank"
					rel="noopener noreferrer"
					class="hero-secondary-btn">
					View GitHub
				</a>
			</div>

			<!-- App Preview -->
			<div class="preview-shell">
				<div class="preview-topbar">
					<div class="preview-dots">
						<span />
						<span />
						<span />
					</div>

					<div class="preview-url">localhost:3000/chat</div>
				</div>

				<div class="preview-content">
					<div class="preview-sidebar">
						<div class="preview-sidebar-title">Conversations</div>

						<div class="preview-conversation preview-conversation--active">
							Transformer paper summary
						</div>

						<div class="preview-conversation">Meeting notes analysis</div>

						<div class="preview-conversation">Postgres vector search</div>
					</div>

					<div class="preview-chat">
						<div class="preview-context-bar">
							<div class="preview-chip">research-paper.pdf</div>
							<div class="preview-chip">architecture.pdf</div>
						</div>

						<div class="preview-messages">
							<div class="preview-message preview-message--user">
								What are the main findings of the paper?
							</div>

							<div class="preview-message preview-message--assistant">
								The paper introduces a retrieval-enhanced transformer
								architecture optimized for semantic search and long-context
								reasoning...
							</div>
						</div>

						<div class="preview-input">
							Ask a question about your documents...
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Features -->
		<section class="features-section">
			<div class="section-heading">
				<span class="section-label">Features</span>
				<h2>Built for local AI workflows</h2>
				<p>Everything runs on infrastructure you control.</p>
			</div>

			<div class="features-grid">
				<div class="feature-card">
					<div class="feature-icon">📄</div>
					<h3>PDF ingestion</h3>
					<p>
						Upload documents and automatically extract, chunk, and index content
						for semantic retrieval.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">🧠</div>
					<h3>Local embeddings</h3>
					<p>
						Generate embeddings locally with Ollama-powered models — no external
						AI APIs required.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">🔎</div>
					<h3>Semantic search</h3>
					<p>
						Powered by PostgreSQL + pgvector for fast, reliable vector
						similarity search.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">⚡</div>
					<h3>Streaming responses</h3>
					<p>
						Receive AI responses token-by-token with a real-time conversational
						experience.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">🐳</div>
					<h3>Dockerized stack</h3>
					<p>
						Run the full stack with Docker Compose, including Ollama,
						PostgreSQL, and the API.
					</p>
				</div>

				<div class="feature-card">
					<div class="feature-icon">🔒</div>
					<h3>Private by default</h3>
					<p>
						Your documents and conversations stay on your machine and
						infrastructure.
					</p>
				</div>
			</div>
		</section>

		<!-- Architecture -->
		<section class="architecture-section">
			<div class="section-heading">
				<span class="section-label">Architecture</span>
				<h2>Simple local-first pipeline</h2>
			</div>

			<div class="architecture-flow">
				<div class="flow-node">PDFs</div>
				<div class="flow-arrow">→</div>
				<div class="flow-node">Embeddings</div>
				<div class="flow-arrow">→</div>
				<div class="flow-node">pgvector</div>
				<div class="flow-arrow">→</div>
				<div class="flow-node">Ollama</div>
				<div class="flow-arrow">→</div>
				<div class="flow-node">Chat</div>
			</div>
		</section>

		<!-- CTA -->
		<section class="bottom-cta-section">
			<div class="bottom-cta-card">
				<h2>Start chatting with your documents</h2>

				<p>Self-hosted. Local-first. Built for developers.</p>

				<NuxtLink to="/chat" class="bottom-cta-btn gradient-primary">
					Open Briefly
				</NuxtLink>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({ layout: "blank" });

	useHead({
		title: "Briefly — Local-first conversational RAG workspace",
		meta: [
			{
				name: "description",
				content:
					"Self-hosted conversational RAG workspace for chatting with PDFs using local LLMs.",
			},
		],
	});
</script>

<style scoped>
	.landing-page {
		position: relative;
		min-height: 100vh;
		background: var(--background);
		overflow: hidden;
	}

	.landing-glow {
		position: fixed;
		border-radius: 9999px;
		filter: blur(120px);
		opacity: 0.14;
		pointer-events: none;
	}

	.landing-glow--cyan {
		width: 420px;
		height: 420px;
		background: #06b6d4;
		top: -120px;
		left: -120px;
	}

	.landing-glow--violet {
		width: 520px;
		height: 520px;
		background: #7c3aed;
		bottom: -220px;
		right: -120px;
	}

	.landing-header {
		position: sticky;
		top: 0;
		z-index: 20;
		backdrop-filter: blur(14px);
		background: rgba(15, 17, 23, 0.72);
		border-bottom: 1px solid var(--border-muted);
	}

	.landing-header-inner {
		max-width: 1180px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.landing-nav {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.nav-link {
		font-size: 13px;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.nav-link:hover {
		color: var(--text-primary);
	}

	.nav-cta {
		padding: 9px 14px;
		border-radius: var(--radius-md);
		font-size: 13px;
		font-weight: 600;
		color: white;
		text-decoration: none;
		box-shadow: var(--shadow-md);
	}

	.hero-section {
		position: relative;
		max-width: 1180px;
		margin: 0 auto;
		padding: 88px 24px 72px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 7px 12px;
		background: var(--surface-muted);
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
		font-size: 12px;
		color: var(--text-secondary);
		margin-bottom: 24px;
	}

	.hero-badge-dot {
		width: 6px;
		height: 6px;
		border-radius: 9999px;
		background: #22d3ee;
	}

	.hero-title {
		max-width: 900px;
		font-size: clamp(3rem, 7vw, 5.8rem);
		line-height: 0.95;
		letter-spacing: -0.06em;
		font-weight: 800;
		margin-bottom: 24px;
	}

	.hero-gradient-text {
		background: var(--primary-gradient);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.hero-description {
		max-width: 760px;
		font-size: 18px;
		line-height: 1.8;
		color: var(--text-secondary);
		margin-bottom: 36px;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 72px;
	}

	.hero-primary-btn,
	.bottom-cta-btn {
		padding: 13px 20px;
		border-radius: var(--radius-lg);
		font-size: 14px;
		font-weight: 600;
		color: white;
		text-decoration: none;
		box-shadow: var(--shadow-lg);
	}

	.hero-secondary-btn {
		padding: 13px 20px;
		border-radius: var(--radius-lg);
		background: var(--surface);
		border: 1px solid var(--border);
		font-size: 14px;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		transition: background 0.15s ease;
	}

	.hero-secondary-btn:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
	}

	.preview-shell {
		width: 100%;
		max-width: 1080px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid var(--border);
		border-radius: 24px;
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		backdrop-filter: blur(18px);
	}

	.preview-topbar {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 18px;
		border-bottom: 1px solid var(--border-muted);
		background: rgba(255, 255, 255, 0.02);
	}

	.preview-dots {
		display: flex;
		gap: 6px;
	}

	.preview-dots span {
		width: 8px;
		height: 8px;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.2);
	}

	.preview-url {
		font-size: 12px;
		color: var(--text-muted);
		font-family: var(--font-mono);
	}

	.preview-content {
		display: flex;
		height: 560px;
	}

	.preview-sidebar {
		width: 260px;
		padding: 18px;
		border-right: 1px solid var(--border-muted);
		background: var(--sidebar-bg);
	}

	.preview-sidebar-title {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 16px;
	}

	.preview-conversation {
		padding: 12px;
		border-radius: var(--radius-md);
		font-size: 13px;
		color: var(--text-secondary);
		margin-bottom: 8px;
		background: transparent;
		border: 1px solid transparent;
	}

	.preview-conversation--active {
		background: var(--sidebar-item-active);
		border-color: rgba(124, 58, 237, 0.22);
		color: var(--text-primary);
	}

	.preview-chat {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: var(--surface);
	}

	.preview-context-bar {
		display: flex;
		gap: 8px;
		padding: 14px 18px;
		border-bottom: 1px solid var(--border-muted);
	}

	.preview-chip {
		padding: 5px 10px;
		border-radius: var(--radius-full);
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid var(--border);
		font-size: 11px;
		color: var(--text-secondary);
	}

	.preview-messages {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: 24px;
	}

	.preview-message {
		max-width: 72%;
		padding: 14px 16px;
		border-radius: 18px;
		font-size: 13px;
		line-height: 1.7;
	}

	.preview-message--user {
		align-self: flex-end;
		background: var(--user-bubble);
		color: white;
	}

	.preview-message--assistant {
		align-self: flex-start;
		background: var(--assistant-bubble);
		border: 1px solid var(--assistant-bubble-border);
		color: var(--text-primary);
	}

	.preview-input {
		margin: 18px;
		padding: 15px 18px;
		border-radius: var(--radius-xl);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--border);
		font-size: 13px;
		color: var(--text-placeholder);
	}

	.features-section,
	.architecture-section,
	.bottom-cta-section {
		max-width: 1180px;
		margin: 0 auto;
		padding: 0 24px 120px;
	}

	.section-heading {
		max-width: 680px;
		margin-bottom: 44px;
	}

	.section-label {
		display: inline-flex;
		padding: 5px 10px;
		border-radius: var(--radius-full);
		background: var(--primary-light);
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #c4b5fd;
		margin-bottom: 16px;
	}

	.section-heading h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 1.05;
		letter-spacing: -0.04em;
		margin-bottom: 14px;
	}

	.section-heading p {
		font-size: 16px;
		line-height: 1.8;
		color: var(--text-secondary);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px;
	}

	.feature-card {
		padding: 24px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid var(--border);
		backdrop-filter: blur(14px);
	}

	.feature-icon {
		font-size: 22px;
		margin-bottom: 18px;
	}

	.feature-card h3 {
		font-size: 18px;
		margin-bottom: 10px;
	}

	.feature-card p {
		font-size: 14px;
		line-height: 1.8;
		color: var(--text-secondary);
	}

	.architecture-flow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		flex-wrap: wrap;
		padding: 40px;
		border-radius: 24px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid var(--border);
	}

	.flow-node {
		padding: 14px 20px;
		border-radius: var(--radius-lg);
		background: var(--surface-muted);
		border: 1px solid var(--border);
		font-weight: 600;
	}

	.flow-arrow {
		font-size: 20px;
		color: var(--text-muted);
	}

	.bottom-cta-card {
		padding: 64px 24px;
		border-radius: 32px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid var(--border);
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.bottom-cta-card::before {
		content: "";
		position: absolute;
		inset: 0;
		background: radial-gradient(
				circle at top left,
				rgba(6, 182, 212, 0.14),
				transparent 40%
			),
			radial-gradient(
				circle at bottom right,
				rgba(124, 58, 237, 0.14),
				transparent 40%
			);
		pointer-events: none;
	}

	.bottom-cta-card h2 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1.05;
		letter-spacing: -0.05em;
		margin-bottom: 16px;
		position: relative;
	}

	.bottom-cta-card p {
		font-size: 16px;
		line-height: 1.8;
		color: var(--text-secondary);
		margin-bottom: 28px;
		position: relative;
	}

	.bottom-cta-btn {
		display: inline-flex;
		position: relative;
	}

	@media (max-width: 1024px) {
		.preview-content {
			flex-direction: column;
			height: auto;
		}

		.preview-sidebar {
			width: 100%;
			border-right: none;
			border-bottom: 1px solid var(--border-muted);
		}

		.features-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 768px) {
		.landing-header-inner {
			padding: 14px 16px;
		}

		.hero-section {
			padding: 64px 16px 48px;
		}

		.hero-actions {
			flex-direction: column;
			width: 100%;
		}

		.hero-primary-btn,
		.hero-secondary-btn {
			width: 100%;
			justify-content: center;
		}

		.preview-shell {
			border-radius: 18px;
		}

		.preview-message {
			max-width: 90%;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.features-section,
		.architecture-section,
		.bottom-cta-section {
			padding: 0 16px 80px;
		}

		.architecture-flow {
			padding: 24px;
		}

		.flow-arrow {
			display: none;
		}

		.bottom-cta-card {
			padding: 44px 20px;
		}
	}
</style>
