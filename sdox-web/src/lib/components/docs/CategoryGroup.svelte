<script lang="ts">
	import type { TagCategory } from '$lib/data/tags';
	import TagReference from './TagReference.svelte';

	interface Props {
		category: TagCategory;
	}

	let { category }: Props = $props();
</script>

<div class="category-group" id={category.id}>
	<div class="category-header">
		<span class="category-icon">{category.icon}</span>
		<div class="category-info">
			<h3 class="category-name">{category.name}</h3>
			<p class="category-desc">{category.description}</p>
		</div>
		<span class="category-count">{category.tags.length} tag{category.tags.length !== 1 ? 's' : ''}</span>
	</div>

	<div class="category-tags">
		{#each category.tags as tag}
			<TagReference {tag} categoryColor={category.color} />
		{/each}
	</div>
</div>

<style>
	.category-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.category-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		padding: var(--space-5) var(--space-6);
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.category-icon {
		font-size: var(--text-2xl);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.category-info {
		flex: 1;
	}

	.category-name {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-1);
	}

	.category-desc {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	.category-count {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		background: rgba(255, 255, 255, 0.04);
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-full);
		border: 1px solid var(--color-border);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.category-tags {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	@media (max-width: 768px) {
		.category-header {
			flex-direction: column;
			gap: var(--space-2);
		}

		.category-count {
			align-self: flex-start;
		}
	}
</style>
