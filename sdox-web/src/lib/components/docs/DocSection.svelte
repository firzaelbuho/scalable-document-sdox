<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		title: string;
		description?: string;
		children: Snippet;
	}

	let { id, title, description, children }: Props = $props();
</script>

<section {id} class="doc-section">
	<div class="section-header">
		<a href="#{id}" class="section-anchor" aria-label="Link to {title}">#</a>
		<h2 class="section-title">{title}</h2>
	</div>
	{#if description}
		<p class="section-description">{description}</p>
	{/if}
	<div class="section-content">
		{@render children()}
	</div>
</section>

<style>
	.doc-section {
		padding: var(--space-12) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.doc-section:last-child {
		border-bottom: none;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.section-anchor {
		font-size: var(--text-xl);
		color: var(--color-text-tertiary);
		text-decoration: none;
		opacity: 0;
		transition: opacity var(--transition-fast);
		font-weight: 700;
	}

	.section-header:hover .section-anchor {
		opacity: 1;
		color: var(--color-accent-primary);
	}

	.section-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.section-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-8);
		max-width: var(--max-width-prose);
	}

	.section-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}
</style>
