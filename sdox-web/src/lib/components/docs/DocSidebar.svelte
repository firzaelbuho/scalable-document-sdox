<script lang="ts">
	import type { TagCategory } from '$lib/data/tags';

	interface Props {
		categories: TagCategory[];
		activeSection?: string;
	}

	let { categories, activeSection = '' }: Props = $props();

	let expandedCategories = $state<Set<string>>(new Set(categories.map((c) => c.id)));

	function toggleCategory(id: string) {
		const next = new Set(expandedCategories);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		expandedCategories = next;
	}
</script>

<aside class="doc-sidebar">
	<div class="sidebar-header">
		<h3 class="sidebar-title">Documentation</h3>
		<span class="sidebar-badge">{categories.reduce((acc, c) => acc + c.tags.length, 0)} tags</span>
	</div>

	<nav class="sidebar-nav">
		<a
			href="#introduction"
			class="sidebar-link intro-link"
			class:active={activeSection === 'introduction'}
		>
			Introduction
		</a>
		<a
			href="#quick-start"
			class="sidebar-link intro-link"
			class:active={activeSection === 'quick-start'}
		>
			Quick Start
		</a>
		<a
			href="#ai-dataset"
			class="sidebar-link intro-link"
			class:active={activeSection === 'ai-dataset'}
		>
			LLM Context Dataset
		</a>

		<div class="sidebar-divider"></div>

		{#each categories as category}
			<div class="category-group">
				<button
					class="category-toggle"
					class:expanded={expandedCategories.has(category.id)}
					onclick={() => toggleCategory(category.id)}
				>
					<span class="category-icon">{category.icon}</span>
					<span class="category-name">{category.name}</span>
					<svg
						class="chevron"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</button>

				{#if expandedCategories.has(category.id)}
					<div class="category-tags">
						{#each category.tags as tag}
							<a
								href="#tag-{tag.name}"
								class="sidebar-link tag-link"
								class:active={activeSection === `tag-${tag.name}`}
							>
								<span class="tag-prefix" style="color: {category.color}">#</span>{tag.name}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</nav>
</aside>

<style>
	.doc-sidebar {
		width: var(--sidebar-width);
		position: sticky;
		top: calc(var(--navbar-height) + var(--space-6));
		max-height: calc(100vh - var(--navbar-height) - var(--space-12));
		overflow-y: auto;
		padding-right: var(--space-4);
		flex-shrink: 0;
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.sidebar-title {
		font-size: var(--text-sm);
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.sidebar-badge {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		background: rgba(255, 255, 255, 0.04);
		padding: 2px 8px;
		border-radius: var(--radius-full);
		border: 1px solid var(--color-border);
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.sidebar-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		text-decoration: none;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.sidebar-link:hover {
		color: var(--color-text-primary);
		background: rgba(56, 189, 248, 0.04);
	}

	.sidebar-link.active {
		color: var(--color-accent-primary);
		background: var(--color-accent-glow);
	}

	.intro-link {
		font-weight: 500;
	}

	.sidebar-divider {
		height: 1px;
		background: var(--color-border);
		margin: var(--space-3) 0;
	}

	.category-group {
		display: flex;
		flex-direction: column;
	}

	.category-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-primary);
		background: none;
		border: none;
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
		text-align: left;
		width: 100%;
	}

	.category-toggle:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.category-icon {
		font-size: var(--text-sm);
		width: 1.2em;
		text-align: center;
	}

	.category-name {
		flex: 1;
	}

	.chevron {
		color: var(--color-text-tertiary);
		transition: transform var(--transition-fast);
	}

	.category-toggle.expanded .chevron {
		transform: rotate(0deg);
	}

	.category-toggle:not(.expanded) .chevron {
		transform: rotate(-90deg);
	}

	.category-tags {
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding-left: var(--space-4);
		margin-bottom: var(--space-2);
	}

	.tag-link {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.tag-prefix {
		font-weight: 700;
	}

	/* Scrollbar */
	.doc-sidebar::-webkit-scrollbar {
		width: 3px;
	}

	.doc-sidebar::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 3px;
	}

	@media (max-width: 1024px) {
		.doc-sidebar {
			display: none;
		}
	}
</style>
