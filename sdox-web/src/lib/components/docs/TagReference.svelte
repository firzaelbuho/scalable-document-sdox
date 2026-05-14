<script lang="ts">
	import type { TagDefinition } from '$lib/data/tags';
	import AttributeTable from './AttributeTable.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import TagExample from './TagExample.svelte';

	interface Props {
		tag: TagDefinition;
		categoryColor?: string;
	}

	let { tag, categoryColor = 'var(--color-accent-primary)' }: Props = $props();
</script>

<div class="tag-ref" id="tag-{tag.name}">
	<div class="tag-header">
		<h3 class="tag-name">
			<span class="tag-hash" style="color: {categoryColor}">#</span>{tag.name}
		</h3>
	</div>

	<p class="tag-description">{tag.description}</p>

	<div class="tag-details">
		<div class="detail-section">
			<h4 class="detail-title">Attributes</h4>
			<AttributeTable attributes={tag.attributes} />
		</div>

		{#if tag.examples.length > 0}
			<div class="detail-section">
				<h4 class="detail-title">Examples</h4>
				<div class="examples-list">
					{#each tag.examples as example}
						<TagExample {example} />
					{/each}
				</div>
			</div>
		{/if}

		{#if tag.notes && tag.notes.length > 0}
			<div class="detail-section">
				<h4 class="detail-title">Notes</h4>
				<ul class="notes-list">
					{#each tag.notes as note}
						<li>{note}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>

<style>
	.tag-ref {
		padding: var(--space-6);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		background: var(--color-bg-card);
		transition: border-color var(--transition-base);
	}

	.tag-ref:hover {
		border-color: var(--color-border-hover);
	}

	.tag-ref:target {
		border-color: var(--color-border-active);
		box-shadow: var(--shadow-glow);
	}

	.tag-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.tag-name {
		font-family: var(--font-mono);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.tag-hash {
		font-weight: 800;
		margin-right: 2px;
	}

	.tag-description {
		color: var(--color-text-secondary);
		font-size: var(--text-base);
		line-height: var(--leading-relaxed);
		margin-bottom: var(--space-6);
	}

	.tag-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.detail-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.detail-title {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.examples-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.example {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.example-title {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	.example-desc {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		font-style: italic;
	}

	.notes-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.notes-list li {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		padding-left: var(--space-4);
		position: relative;
	}

	.notes-list li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--color-text-tertiary);
	}
</style>
