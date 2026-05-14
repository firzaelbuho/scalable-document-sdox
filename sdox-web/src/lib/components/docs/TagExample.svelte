<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import SdoxRenderer from '$lib/components/preview/SdoxRenderer.svelte';
	import { parseSdox } from '$lib/utils/sdoxParser';

	interface Props {
		example: {
			title?: string;
			description?: string;
			code: string;
		};
	}

	let { example }: Props = $props();

	let activeTab = $state<'syntax' | 'preview'>('syntax');
	
	// Pre-calculate AST for this example to avoid doing it on every render
	let ast = $derived(parseSdox(example.code));
</script>

<div class="example">
	{#if example.title}
		<span class="example-title">{example.title}</span>
	{/if}

	<div class="example-interactive-box">
		<div class="tab-header">
			<button class="tab-btn" class:active={activeTab === 'syntax'} onclick={() => activeTab = 'syntax'}>
				<span class="tab-icon">#</span> Syntax
			</button>
			<button class="tab-btn" class:active={activeTab === 'preview'} onclick={() => activeTab = 'preview'}>
				<span class="tab-icon">👁️</span> Preview
			</button>
		</div>

		<div class="tab-body">
			{#if activeTab === 'syntax'}
				<!-- Remove the margin and border-radius from CodeBlock's wrapper by styling it via CSS or wrapping it -->
				<div class="syntax-wrap">
					<CodeBlock code={example.code} language="sdox" />
				</div>
			{:else}
				<div class="preview-wrap">
					<SdoxRenderer node={ast} />
				</div>
			{/if}
		</div>
	</div>

	{#if example.description}
		<p class="example-desc">{example.description}</p>
	{/if}
</div>

<style>
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

	.example-interactive-box {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-bg-card);
	}

	.tab-header {
		display: flex;
		border-bottom: 1px solid var(--color-border);
		background: rgba(255, 255, 255, 0.02);
	}

	.tab-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--color-text-secondary);
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.tab-btn:hover {
		color: var(--color-text-primary);
		background: rgba(255, 255, 255, 0.05);
	}

	.tab-btn.active {
		color: var(--color-accent-primary);
		border-bottom-color: var(--color-accent-primary);
	}

	.tab-icon {
		opacity: 0.8;
	}

	.tab-body {
		position: relative;
	}

	.syntax-wrap {
		/* CodeBlock typically has its own margin which we want to override */
		margin: 0;
	}
	
	/* Use global to override CodeBlock margin inside this wrap */
	:global(.syntax-wrap > .sdox-code-wrap) {
		margin: 0 !important;
		border: none !important;
		border-radius: 0 !important;
	}

	.preview-wrap {
		padding: var(--space-4);
		background: var(--color-bg-primary);
		min-height: 100px;
	}
	
	/* Reset margin for first and last elements in preview */
	:global(.preview-wrap > .sdox-doc > :first-child) {
		margin-top: 0 !important;
	}
	:global(.preview-wrap > .sdox-doc > :last-child) {
		margin-bottom: 0 !important;
	}
</style>
