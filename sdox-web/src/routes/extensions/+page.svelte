<script lang="ts">
	import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>Extensions - SDOX</title>
	<meta
		name="description"
		content="Download official extensions and tools for Scalable Document (SDOX)."
	/>
</svelte:head>

<div class="extensions-page">
	<div class="header-section" in:fly={{ y: 20, duration: 600, delay: 100 }}>
		<h1 class="page-title">Extensions & Tooling</h1>
		<p class="page-desc">
			Supercharge your SDOX workflow with official browser and editor extensions.
		</p>
	</div>

	<div class="extensions-grid" in:fade={{ duration: 800, delay: 200 }}>
		<!-- Chrome Extension Card -->
		<div class="extension-card chrome-ext">
			<div class="ext-icon-wrapper">
				<img src="/favicon.svg" alt="SDOX Chrome Extension" class="ext-logo" />
				<div class="glow-effect"></div>
			</div>

			<div class="ext-content">
				<div class="ext-badges">
					<span class="badge status-released">Released v0.2.0</span>
					<span class="badge platform-chrome">Chrome / Edge</span>
				</div>

				<h2 class="ext-title">SDOX Viewer for Chrome</h2>
				<p class="ext-description">
					Instantly preview `.sdox` files natively in your browser. Features offline rendering, AST
					parsing, and built-in hot-toggling between Raw Syntax and Live Preview modes.
				</p>

				<div class="ext-actions">
					<a
						href="https://github.com/firzaelbuho/scalable-document-sdox/releases/download/0.2.0/sdox-chrome-extension.0.2.0.zip"
						download="sdox-chrome-extension-v0.2.0.zip"
						rel="external"
						class="btn btn-primary"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="7 10 12 15 17 10"></polyline>
							<line x1="12" y1="15" x2="12" y2="3"></line>
						</svg>
						Download Release (.zip)
					</a>
				</div>

				<div class="ext-instructions">
					<h3>Installation Guide</h3>
					<ol>
						<li>Extract the downloaded <code>.zip</code> file to a folder.</li>
						<li>Open Google Chrome and navigate to <code>chrome://extensions/</code>.</li>
						<li>Enable <strong>Developer mode</strong> in the top right corner.</li>
						<li>Click <strong>Load unpacked</strong> and select the extracted folder.</li>
						<li>
							<strong>Important:</strong> Click "Details" on the extension and enable
							<em>"Allow access to file URLs"</em> so it can read local `.sdox` files.
						</li>
					</ol>
				</div>
			</div>
		</div>

		<!-- VS Code Extension Card (Coming Soon) -->
		<div class="extension-card vscode-ext disabled">
			<div class="ext-icon-wrapper">
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="ext-logo vscode-icon"
				>
					<path d="M4 18l-2-2 2-2M20 6l2 2-2 2M14 2l4 4M10 22l-4-4"></path>
					<path d="M14 2v20M10 2v20"></path>
				</svg>
			</div>

			<div class="ext-content">
				<div class="ext-badges">
					<span class="badge status-upcoming">Coming Soon</span>
					<span class="badge platform-vscode">VS Code</span>
				</div>

				<h2 class="ext-title">SDOX Language Server</h2>
				<p class="ext-description">
					The official VS Code extension for SDOX. Will feature advanced syntax highlighting, tag
					autocompletion, real-time AST linting, and side-by-side Live Preview.
				</p>

				<div class="ext-actions">
					<button class="btn btn-secondary" disabled> In Development </button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.extensions-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-12) var(--space-4) var(--space-20);
	}

	.header-section {
		text-align: center;
		margin-bottom: var(--space-12);
	}

	.page-title {
		font-size: var(--text-4xl);
		font-weight: 800;
		color: var(--color-text-primary);
		letter-spacing: var(--tracking-tight);
		margin-bottom: var(--space-4);
		background: var(--color-accent-gradient-text);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.page-desc {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		max-width: 600px;
		margin: 0 auto;
		line-height: var(--leading-relaxed);
	}

	.extensions-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}

	.extension-card {
		display: flex;
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
		transition: all var(--transition-base);
	}

	.extension-card:not(.disabled):hover {
		border-color: var(--color-accent-primary);
		box-shadow: var(--shadow-glow);
		transform: translateY(-2px);
	}

	.extension-card.disabled {
		opacity: 0.7;
		background: rgba(10, 14, 23, 0.4);
	}

	.ext-icon-wrapper {
		width: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.02);
		border-right: 1px solid var(--color-border);
		position: relative;
	}

	.ext-logo {
		width: 80px;
		height: 80px;
		position: relative;
		z-index: 2;
	}

	.vscode-icon {
		color: #3b82f6;
		filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.5));
	}

	.glow-effect {
		position: absolute;
		width: 100px;
		height: 100px;
		background: var(--color-accent-primary);
		filter: blur(40px);
		opacity: 0.15;
		z-index: 1;
	}

	.ext-content {
		flex: 1;
		padding: var(--space-8);
		display: flex;
		flex-direction: column;
	}

	.ext-badges {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.badge {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		padding: 4px 10px;
		border-radius: var(--radius-full);
		border: 1px solid;
	}

	.status-released {
		color: var(--color-accent-primary);
		background: var(--color-accent-glow);
		border-color: rgba(56, 189, 248, 0.3);
	}

	.status-upcoming {
		color: #fbbf24;
		background: rgba(251, 191, 36, 0.1);
		border-color: rgba(251, 191, 36, 0.3);
	}

	.platform-chrome {
		color: #a8b3cf;
		border-color: var(--color-border);
	}

	.platform-vscode {
		color: #3b82f6;
		border-color: rgba(59, 130, 246, 0.3);
	}

	.ext-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-3);
	}

	.ext-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-6);
	}

	.ext-actions {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-sm);
		font-weight: 600;
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all var(--transition-base);
		cursor: pointer;
		font-family: var(--font-sans);
		border: none;
	}

	.btn-primary {
		background: var(--color-accent-primary);
		color: #0a0e17;
	}

	.btn-primary:hover {
		background: var(--color-accent-hover);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.05);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text-primary);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ext-instructions {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		margin-top: auto;
	}

	.ext-instructions h3 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-4);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.ext-instructions ol {
		margin: 0;
		padding-left: var(--space-5);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.ext-instructions code {
		font-family: var(--font-mono);
		background: var(--color-bg-code);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.9em;
		color: var(--color-accent-primary);
	}

	.ext-instructions strong {
		color: var(--color-text-primary);
		font-weight: 600;
	}

	.ext-instructions em {
		color: #fbbf24;
		font-style: normal;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.extension-card {
			flex-direction: column;
		}

		.ext-icon-wrapper {
			width: 100%;
			height: 160px;
			border-right: none;
			border-bottom: 1px solid var(--color-border);
		}
	}
</style>
