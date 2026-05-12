<script lang="ts">
	import type { TagAttribute } from '$lib/data/tags';

	interface Props {
		attributes: TagAttribute[];
	}

	let { attributes }: Props = $props();
</script>

{#if attributes.length > 0}
	<div class="attr-table-wrapper">
		<table class="attr-table">
			<thead>
				<tr>
					<th>Attribute</th>
					<th>Type</th>
					<th>Required</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{#each attributes as attr}
					<tr>
						<td>
							<code class="attr-name">{attr.name}</code>
						</td>
						<td>
							<span class="attr-type">{attr.type}</span>
							{#if attr.values}
								<div class="attr-values">
									{#each attr.values as val}
										<span class="attr-value-option">{val}</span>
									{/each}
								</div>
							{/if}
						</td>
						<td>
							{#if attr.required}
								<span class="required-badge">required</span>
							{:else}
								<span class="optional-badge">optional</span>
							{/if}
						</td>
						<td>
							{#if attr.default}
								<code class="attr-default">{attr.default}</code>
							{:else}
								<span class="attr-none">—</span>
							{/if}
						</td>
						<td class="attr-desc">{attr.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="no-attrs">This tag has no attributes.</p>
{/if}

<style>
	.attr-table-wrapper {
		overflow-x: auto;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.attr-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
	}

	.attr-table thead {
		background: rgba(255, 255, 255, 0.03);
	}

	.attr-table th {
		padding: var(--space-3) var(--space-4);
		text-align: left;
		font-weight: 600;
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		color: var(--color-text-tertiary);
		border-bottom: 1px solid var(--color-border);
		white-space: nowrap;
	}

	.attr-table td {
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
		vertical-align: top;
	}

	.attr-table tr:last-child td {
		border-bottom: none;
	}

	.attr-table tr:hover td {
		background: rgba(56, 189, 248, 0.02);
	}

	.attr-name {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-accent-primary);
		background: var(--color-bg-inline-code);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
	}

	.attr-type {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-cat-text);
		background: rgba(167, 139, 250, 0.08);
		padding: 2px 8px;
		border-radius: var(--radius-full);
	}

	.attr-values {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: var(--space-2);
	}

	.attr-value-option {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		background: rgba(255, 255, 255, 0.04);
		padding: 1px 6px;
		border-radius: var(--radius-sm);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.required-badge {
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-warning);
		background: rgba(251, 191, 36, 0.1);
		padding: 2px 8px;
		border-radius: var(--radius-full);
	}

	.optional-badge {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	.attr-default {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-success);
	}

	.attr-none {
		color: var(--color-text-tertiary);
	}

	.attr-desc {
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	.no-attrs {
		color: var(--color-text-tertiary);
		font-size: var(--text-sm);
		font-style: italic;
		padding: var(--space-3) 0;
	}
</style>
