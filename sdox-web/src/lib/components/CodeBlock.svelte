<script lang="ts">
	interface Props {
		code: string;
		language?: string;
		title?: string;
		showLineNumbers?: boolean;
		compact?: boolean;
	}

	let { code, language = 'sdox', title, showLineNumbers = false, compact = false }: Props = $props();

	let copied = $state(false);

	const lines = $derived(code.split('\n'));

	function copyCode() {
		navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	// Simple syntax highlighting
	function highlightLine(line: string): string {
		let result = escapeHtml(line);

		if (language === 'sdox') {
			// SDOX Highlighting
			result = result.replace(/(#\w+)/g, '<span class="token-tag">$1</span>');
			result = result.replace(/(\w+)(=)(&quot;[^&]*&quot;|&\w+;|\w+)/g, '<span class="token-attr">$1</span><span class="token-punct">$2</span><span class="token-value">$3</span>');
			result = result.replace(/([(){}])/g, '<span class="token-punct">$1</span>');
			result = result.replace(/(&quot;[^&]*&quot;)/g, '<span class="token-string">$1</span>');
		} else {
			// Generic Highlighting
			result = result.replace(/\b(def|return|class|if|else|elif|for|while|import|from|const|let|var|function|async|await|echo|export|true|false|None|null|undefined)\b/g, '<span class="token-keyword">$1</span>');
			result = result.replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="token-function">$1</span>');
			result = result.replace(/(&quot;[^&]*&quot;|'[^']*')/g, '<span class="token-string">$1</span>');
		}

		return result;
	}

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}
</script>

<div class="code-block" class:compact>
	{#if title || language}
		<div class="code-header">
			{#if title}
				<span class="code-title">{title}</span>
			{/if}
			<div class="code-header-right">
				{#if language}
					<span class="code-lang">{language}</span>
				{/if}
				<button class="copy-btn" onclick={copyCode} aria-label="Copy code">
					{#if copied}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					{:else}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
							<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
						</svg>
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<div class="code-body">
		<pre><code>{#each lines as line, i}{#if showLineNumbers}<span class="line-number">{i + 1}</span>{/if}<span class="line-content">{@html highlightLine(line)}</span>
{/each}</code></pre>
	</div>
</div>

<style>
	.code-block {
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 1px solid var(--color-border);
		background: var(--color-bg-code);
		font-size: var(--text-sm);
	}

	.code-block.compact {
		font-size: var(--text-xs);
	}

	.code-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2) var(--space-4);
		border-bottom: 1px solid var(--color-border);
		background: rgba(255, 255, 255, 0.02);
	}

	.code-title {
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.code-header-right {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.code-lang {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		font-family: var(--font-mono);
	}

	.copy-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		background: transparent;
		color: var(--color-text-tertiary);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.copy-btn:hover {
		color: var(--color-text-primary);
		background: rgba(255, 255, 255, 0.06);
	}

	.code-body {
		padding: var(--space-4);
		overflow-x: auto;
	}

	pre {
		margin: 0;
		font-family: var(--font-mono);
		line-height: 1.7;
	}

	code {
		font-family: inherit;
		font-size: inherit;
		color: var(--color-text-code);
	}

	.line-number {
		display: inline-block;
		width: 2.5em;
		text-align: right;
		padding-right: 1em;
		color: var(--color-text-tertiary);
		user-select: none;
		opacity: 0.5;
	}

	/* SDOX Syntax Tokens */
	:global(.token-tag) {
		color: #38bdf8;
		font-weight: 600;
	}

	:global(.token-keyword) {
		color: #f472b6; /* pink */
		font-weight: 600;
	}

	:global(.token-function) {
		color: #60a5fa; /* blue */
	}

	:global(.token-attr) {
		color: #a78bfa;
	}

	:global(.token-value) {
		color: #34d399;
	}

	:global(.token-string) {
		color: #34d399;
	}

	:global(.token-punct) {
		color: #64748b;
	}
</style>
