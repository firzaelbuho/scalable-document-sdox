<script lang="ts">
	const currentYear = new Date().getFullYear();
	const githubUrl = 'https://github.com/firzaelbuho/scalable-document-sdox';
</script>

<footer class="footer">
	<div class="container footer-inner">
		<div class="footer-left">
			<div class="footer-brand">
				<span class="footer-icon">⬡</span>
				<span class="footer-name">SDOX</span>
			</div>
			<p class="footer-tagline">Everything is a semantic tag.</p>
		</div>

		<div class="footer-links">
			<div class="footer-col">
				<h4>Project</h4>
				<a href="/">Home</a>
				<a href="/docs">Documentation</a>
				<a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
			</div>
			<div class="footer-col">
				<h4>Specification</h4>
				<a href="/docs#structure">Structure Tags</a>
				<a href="/docs#code">Code Tags</a>
				<a href="/docs#ai-native">AI-Native Tags</a>
			</div>
		</div>
	</div>

	<div class="container footer-bottom">
		<p>&copy; {currentYear} Scalable Document Project. MIT License.</p>
		<span class="footer-version badge">v0.2.0 — Draft</span>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--color-border);
		padding: var(--space-16) 0 var(--space-8);
		background: var(--color-bg-secondary);
	}

	.footer-inner {
		display: flex;
		justify-content: space-between;
		gap: var(--space-12);
		padding-bottom: var(--space-10);
		border-bottom: 1px solid var(--color-border);
	}

	.footer-left {
		max-width: 300px;
	}

	.footer-brand {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.footer-icon {
		font-size: 1.4rem;
		color: var(--color-accent-primary);
		filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.3));
	}

	.footer-name {
		font-size: var(--text-lg);
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.footer-tagline {
		color: var(--color-text-tertiary);
		font-size: var(--text-sm);
		font-style: italic;
	}

	.footer-links {
		display: flex;
		gap: var(--space-16);
	}

	.footer-col {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.footer-col h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-2);
	}

	.footer-col a {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.footer-col a:hover {
		color: var(--color-accent-primary);
	}

	.footer-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: var(--space-6);
	}

	.footer-bottom p {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}

	.footer-version {
		font-size: var(--text-xs);
	}

	@media (max-width: 768px) {
		.footer-inner {
			flex-direction: column;
			gap: var(--space-8);
		}

		.footer-links {
			gap: var(--space-8);
		}

		.footer-bottom {
			flex-direction: column;
			gap: var(--space-3);
			text-align: center;
		}
	}
</style>
