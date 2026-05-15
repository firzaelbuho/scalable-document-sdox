<script lang="ts">
	import type { ASTNode } from '../../utils/sdoxParser';
	import CodeBlock from '../CodeBlock.svelte';
	import mermaid from 'mermaid';
	import { marked } from 'marked';

	import katex from 'katex';
	import 'katex/dist/katex.min.css';

	let { node }: { node: ASTNode } = $props();

	// Component self-reference for recursion in Svelte 5
	import SdoxRenderer from './SdoxRenderer.svelte';

	let accordionOpen = $state(false);
	function toggleAccordion() { accordionOpen = !accordionOpen; }

	const noteIcons: Record<string, string> = { warning: '⚠️', danger: '🛑', success: '✅', info: 'ℹ️' };
	const priorityColors: Record<string, string> = { high: '#f87171', medium: '#fbbf24', low: '#60a5fa' };
	const aiTagMeta: Record<string, {icon: string, color: string, label: string}> = {
		dataset: { icon: '📊', color: '#a78bfa', label: 'Dataset' },
		embedding: { icon: '🧬', color: '#2dd4bf', label: 'Embedding' },
		chunk: { icon: '🧩', color: '#fb923c', label: 'Chunk' },
		context: { icon: '🎯', color: '#38bdf8', label: 'Context' },
		completion: { icon: '✨', color: '#f472b6', label: 'Completion' },
	};

	// Mermaid initialization
	mermaid.initialize({
		startOnLoad: false,
		theme: 'dark',
		securityLevel: 'loose',
		fontFamily: 'inherit'
	});

	let diagramContainer = $state<HTMLElement | null>(null);
	let diagramSvg = $state('');

	$effect(() => {
		if (node.type === 'diagram' && node.content) {
			const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
			mermaid.render(id, node.content).then(({ svg }) => {
				diagramSvg = svg;
			}).catch(err => {
				console.error('Mermaid render error:', err);
				diagramSvg = `<div class="diagram-error">Invalid Diagram Syntax</div>`;
			});
		}
	});

	// KaTeX rendering helper
	function renderMath(tex: string, displayMode: boolean = false) {
		try {
			return katex.renderToString(tex, {
				displayMode,
				throwOnError: false,
				strict: false
			});
		} catch (e) {
			return `<span class="math-error">${tex}</span>`;
		}
	}
</script>

{#if node.type === 'document'}
	<div class="sdox-doc">
		{#each node.children as child}<SdoxRenderer node={child} />{/each}
	</div>

{:else if node.type === 'section'}
	<section class="sdox-section" id={node.attributes.id || undefined}>
		{#if node.attributes.title}
			<h2 class="section-title"><span class="section-accent"></span>{node.attributes.title}</h2>
		{/if}
		<div class="section-body">
			{#each node.children as child}<SdoxRenderer node={child} />{/each}
		</div>
	</section>

{:else if node.type === 'title'}
	<svelte:element this={`h${node.attributes.level || 1}`} id={node.attributes.id || undefined} class={`sdox-title level-${node.attributes.level || 1}`}>
		{node.content}
	</svelte:element>

{:else if node.type === 'paragraph'}
	<p class="sdox-paragraph">
		{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}{node.content}{/if}
	</p>

{:else if node.type === 'plain_text'}
	<span class="sdox-text">{node.content}</span>

{:else if node.type === 'divider'}
	<div class="sdox-divider"><span class="divider-diamond">◆</span></div>

{:else if node.type === 'text'}
	<span class="sdox-inline-text"
		class:is-bold={node.attributes.style === 'bold'}
		class:is-italic={node.attributes.style === 'italic'}
		class:is-underline={node.attributes.style === 'underline'}
		class:is-strike={node.attributes.style === 'strikethrough'}
		style={(node.attributes.color ? `color:${node.attributes.color};` : '') + (node.attributes.size ? `font-size:${node.attributes.size};` : '')}
	>{node.content}</span>

{:else if node.type === 'quote'}
	<blockquote class="sdox-quote">
		<span class="quote-mark">"</span>
		<div class="quote-body">
			{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}<p>{node.content}</p>{/if}
			{#if node.attributes.author}<footer class="quote-author">— {node.attributes.author}</footer>{/if}
		</div>
	</blockquote>

{:else if node.type === 'note'}
	<div class={`sdox-note note-${node.attributes.type || 'info'}`}>
		<div class="note-sidebar"><span class="note-icon">{noteIcons[node.attributes.type] || 'ℹ️'}</span></div>
		<div class="note-content">
			<div class="note-type">{node.attributes.type || 'info'}</div>
			<div class="note-body">
				{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}<p>{node.content}</p>{/if}
			</div>
		</div>
	</div>

{:else if node.type === 'list'}
	<svelte:element this={node.attributes.type === 'ordered' ? 'ol' : 'ul'} class={`sdox-list list-${node.attributes.type || 'unordered'}`}>
		{#each node.children as child}
			{#if child.type === 'item'}
				<li class="sdox-item" class:done={child.attributes.done === true}>
					{#if node.attributes.type === 'checklist'}
						<span class="check-box" class:checked={child.attributes.done === true}>{child.attributes.done ? '✓' : ''}</span>
					{/if}
					<span class="item-text">{#if child.children.length > 0}{#each child.children as sc}<SdoxRenderer node={sc} />{/each}{:else}{child.content}{/if}</span>
				</li>
			{/if}
		{/each}
	</svelte:element>

{:else if node.type === 'ref'}
	<a href={`#${node.attributes.to}`} class="sdox-ref" onclick={(e) => {
		const el = document.getElementById(String(node.attributes.to));
		if (el) {
			e.preventDefault();
			el.scrollIntoView({ behavior: 'smooth' });
		}
	}}>
		<span class="ref-icon">⚓</span> {node.content || node.attributes.to}
	</a>

{:else if node.type === 'url'}
	<a href={node.attributes.href} target={node.attributes.target || '_blank'} class="sdox-url" title={node.attributes.title || ''}>
		{node.content}<svg class="link-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
	</a>

{:else if node.type === 'image'}
	<figure class="sdox-figure">
		<div class="img-frame"><img src={node.attributes.src} alt={node.attributes.alt || ''} width={node.attributes.width} height={node.attributes.height} /></div>
		{#if node.attributes.alt}<figcaption>{node.attributes.alt}</figcaption>{/if}
	</figure>

{:else if node.type === 'video'}
	<div class="sdox-video-player">
		<div class="player-header"><span class="player-icon">🎬</span> {node.attributes.src.split('/').pop()}</div>
		<video
			src={node.attributes.src}
			controls={node.attributes.controls !== false}
			class="sdox-video"
		>
			<track kind="captions" />
			Your browser does not support the video tag.
		</video>
	</div>

{:else if node.type === 'audio'}
	<div class="sdox-audio-player">
		<div class="player-header"><span class="player-icon">🎵</span> Audio Track</div>
		<audio
			src={node.attributes.src}
			controls={node.attributes.controls !== false}
			class="sdox-audio"
		>
			Your browser does not support the audio tag.
		</audio>
	</div>

{:else if node.type === 'code'}
	<div class="sdox-code-wrap"><CodeBlock code={node.content || ''} language={String(node.attributes.language || 'text')} title={node.attributes.title ? String(node.attributes.title) : undefined} showLineNumbers={node.attributes.line_number === true} /></div>

{:else if node.type === 'output'}
	<div class="sdox-output">
		<div class="output-header"><span class="output-dots"><i class="dot-red"></i><i class="dot-yellow"></i><i class="dot-green"></i></span><span class="output-label">{node.attributes.type || 'terminal'}</span></div>
		<pre class="output-body">{node.content}</pre>
	</div>

{:else if node.type === 'table'}
	<div class="sdox-table-wrap">
		<table class="sdox-table">{#each node.children as child}<SdoxRenderer node={child} />{/each}</table>
	</div>
{:else if node.type === 'row'}
	<tr class="sdox-row">{#each node.children as child}<SdoxRenderer node={child} />{/each}</tr>
{:else if node.type === 'cell'}
	{#if node.attributes.header}<th class="sdox-th">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}{node.content}{/if}</th>{:else}<td class="sdox-td">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}{node.content}{/if}</td>{/if}

{:else if node.type === 'card'}
	<div class="sdox-card">
		{#if node.attributes.title}<div class="card-header"><span class="card-dot"></span>{node.attributes.title}</div>{/if}
		<div class="card-body">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}<p>{node.content}</p>{/if}</div>
	</div>

{:else if node.type === 'tab'}
	<div class="sdox-tab">
		<div class="tab-bar"><span class="tab-active">{node.attributes.title || 'Tab'}</span></div>
		<div class="tab-content">{#each node.children as child}<SdoxRenderer node={child} />{/each}</div>
	</div>

{:else if node.type === 'accordion'}
	<div class="sdox-accordion">
		<button class="accordion-toggle" onclick={toggleAccordion}>
			<span class="accordion-chevron" class:open={accordionOpen}>▶</span>
			<span>{node.attributes.title || 'Details'}</span>
		</button>
		{#if accordionOpen}<div class="accordion-body">{#each node.children as child}<SdoxRenderer node={child} />{/each}</div>{/if}
	</div>

{:else if node.type === 'include'}
	<div class="sdox-chip chip-include"><span class="chip-icon">📎</span> <code>{node.attributes.src}</code></div>

{:else if node.type === 'template'}
	<div class="sdox-template">
		<div class="template-header"><span class="chip-icon">📐</span> Template: <code>{node.attributes.name}</code></div>
		<div class="template-body">{#each node.children as child}<SdoxRenderer node={child} />{/each}</div>
	</div>

{:else if node.type === 'use'}
	<div class="sdox-chip chip-use"><span class="chip-icon">⚡</span> <code>{node.attributes.template}</code></div>

{:else if node.type === 'instruction'}
	<div class="sdox-ai-block ai-instruction">
		<div class="ai-header"><span class="ai-icon">📝</span><span class="ai-label">Instruction</span>
			{#if node.attributes.priority}<span class="model-badge" style="background:{priorityColors[node.attributes.priority] || '#64748b'}33;color:{priorityColors[node.attributes.priority] || '#64748b'}; border-color: {priorityColors[node.attributes.priority] || '#64748b'}80;">{node.attributes.priority}</span>{/if}
		</div>
		<div class="ai-body">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}<p>{node.content}</p>{/if}</div>
	</div>

{:else if node.type === 'response'}
	<div class="sdox-ai-block ai-response">
		<div class="ai-header"><span class="ai-icon">🤖</span><span class="ai-label">Response</span>
			{#if node.attributes.model}<span class="model-badge">{node.attributes.model}</span>{/if}
		</div>
		<div class="ai-body">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}<p>{node.content}</p>{/if}</div>
	</div>

{:else if node.type === 'example'}
	<div class="sdox-ai-block ai-example">
		<div class="ai-header"><span class="ai-icon">💡</span><span class="ai-label">Example</span>
			{#if node.attributes.language}<span class="model-badge">{node.attributes.language}</span>{/if}
		</div>
		<div class="ai-body p-0">
			<pre class="example-code">{node.content}</pre>
		</div>
	</div>

{:else if node.type === 'metadata'}
	<div class="sdox-ai-block ai-metadata">
		<div class="ai-header"><span class="ai-icon">📋</span><span class="ai-label">Metadata</span></div>
		<div class="ai-body p-0">
			<div class="metadata-grid">{#each node.children as child}
				{#if child.type === 'item'}<div class="meta-row"><div class="meta-key">{child.attributes.key}</div><div class="meta-val">{child.content}</div></div>{/if}
			{/each}</div>
		</div>
	</div>

{:else if node.type === 'chart'}
	<div class="sdox-chart-card">
		{#if node.attributes.title}<div class="chart-header">{node.attributes.title}</div>{/if}
		<div class="chart-visual">
			<div class="chart-bars">
				{#each node.children.filter(c => c.type === 'data') as data}
					<div class="chart-bar-group">
						<div class="chart-bar" style="height: {Math.min((Number(data.attributes.value) / 2), 100)}px; background: {data.attributes.color || 'var(--color-accent-primary)'}"></div>
						<div class="chart-label">{data.attributes.label}</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="chart-type-tag">{node.attributes.type || 'bar'} chart</div>
	</div>

{:else if node.type === 'html'}
	<div class="sdox-html-render">
		{@html node.content}
	</div>

{:else if node.type === 'markdown'}
	<div class="sdox-markdown-render">
		{@html marked.parse(node.content || '')}
	</div>

{:else if node.type === 'math'}
	<div class="sdox-math-block" class:is-inline={node.attributes.display === 'inline'}>
		{@html renderMath(node.content || '', node.attributes.display !== 'inline')}
	</div>

{:else if node.type === 'diagram'}
	<div class="sdox-diagram-block">
		<div class="diagram-header">Diagram: {node.attributes.type || 'flowchart'}</div>
		<div class="diagram-render-wrap">
			{#if diagramSvg}
				{@html diagramSvg}
			{:else}
				<pre class="diagram-content">{node.content}</pre>
			{/if}
		</div>
	</div>

{:else if node.type === 'timeline'}
	<div class="sdox-timeline" class:is-horizontal={node.attributes.orientation === 'horizontal'}>
		{#each node.children as child}<SdoxRenderer node={child} />{/each}
	</div>
{:else if node.type === 'event'}
	<div class="timeline-event">
		<div class="event-dot"></div>
		<div class="event-meta">
			<span class="event-date">{node.attributes.date}</span>
			{#if node.attributes.title}<span class="event-title">{node.attributes.title}</span>{/if}
		</div>
		<div class="event-body">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}{node.content}{/if}</div>
	</div>

{:else if node.type === 'toc'}
	<div class="sdox-toc-preview">
		<div class="toc-header">Table of Contents</div>
		<div class="toc-placeholder">[Generated Document Outline]</div>
	</div>

{:else if node.type === 'grid'}
	<div class="sdox-grid" style="grid-template-columns: repeat({node.attributes.columns || 2}, 1fr);">
		{#each node.children as child}<SdoxRenderer node={child} />{/each}
	</div>
{:else if node.type === 'column'}
	<div class="sdox-column">
		{#each node.children as child}<SdoxRenderer node={child} />{/each}
	</div>

{:else if node.type === 'badge'}
	<span class={`sdox-badge badge-${node.attributes.type || 'info'}`}>{node.content}</span>

{:else if node.type === 'term'}
	<span class="sdox-term" id={node.attributes.id}>{node.content}</span>
{:else if node.type === 'definition'}
	<div class="sdox-definition">
		<span class="def-label">Definition:</span>
		<div class="def-body">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}{node.content}{/if}</div>
	</div>

{:else if node.type === 'changelog'}
	<div class="sdox-changelog">
		<div class="changelog-header">Update Log</div>
		<div class="changelog-content">{#each node.children as child}<SdoxRenderer node={child} />{/each}</div>
	</div>

{:else if node.type === 'item'}
	<div class="sdox-standalone-item">
		<span class="standalone-badge">Standalone Item</span>
		<div class="item-content">
			<span class="bullet">•</span>
			<span class="text">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}{node.content}{/if}</span>
		</div>
	</div>

{:else if node.type === 'data'}
	<div class="sdox-standalone-data">
		<span class="standalone-badge">Standalone Data</span>
		<div class="data-bar-wrap">
			<div class="data-label">{node.attributes.label}</div>
			<div class="data-bar-bg"><div class="data-bar-fill" style="width: {Math.min(Number(node.attributes.value), 100)}%; background: {node.attributes.color || 'var(--color-accent-primary)'}"></div></div>
			<div class="data-value">{node.attributes.value}</div>
		</div>
	</div>

{:else if node.type === 'column'}
	<div class="sdox-standalone-column">
		<span class="standalone-badge">Standalone Column</span>
		<div class="column-content">{#each node.children as child}<SdoxRenderer node={child} />{/each}</div>
	</div>

{:else if node.type === 'event'}
	<div class="sdox-standalone-event">
		<span class="standalone-badge">Standalone Event</span>
		<div class="event-card">
			<div class="event-date">{node.attributes.date}</div>
			<div class="event-title">{node.attributes.title || 'Untitled Event'}</div>
			<div class="event-body">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else}{node.content}{/if}</div>
		</div>
	</div>

{:else if ['dataset','embedding','chunk','context','completion'].includes(node.type)}
	{@const meta = aiTagMeta[node.type] || { icon: '🔷', color: '#38bdf8', label: node.type }}
	<div class="sdox-ai-block" style="--ai-color:{meta.color}">
		<div class="ai-header"><span class="ai-icon">{meta.icon}</span><span class="ai-label">{meta.label}</span>
			{#if node.attributes.name}<span class="model-badge">{node.attributes.name}</span>{/if}
			{#if node.attributes.scope}<span class="model-badge">{node.attributes.scope}</span>{/if}
			{#if node.attributes.model}<span class="model-badge">{node.attributes.model}</span>{/if}
			{#if node.attributes.size}<span class="model-badge">{node.attributes.size} tokens</span>{/if}
		</div>
		{#if node.children.length > 0 || node.content}
			<div class="ai-body">{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else if node.content}<p>{node.content}</p>{/if}</div>
		{/if}
	</div>

{:else}
	<div class="sdox-unknown"><span class="unknown-tag">#{node.type}</span>
		{#if node.children.length > 0}{#each node.children as child}<SdoxRenderer node={child} />{/each}{:else if node.content}<p>{node.content}</p>{/if}
	</div>
{/if}

<style>
	/* --- Global SDOX Typography & Spacing --- */
	.sdox-doc {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		color: var(--color-text-primary);
	}

	.sdox-doc > * + * {
		margin-top: var(--space-4);
	}

	/* --- Structure --- */
	.sdox-section {
		margin: var(--space-6) 0;
		padding-left: var(--space-4);
		border-left: 2px solid var(--color-border);
		position: relative;
	}

	.section-title {
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		font-weight: 600;
		color: var(--color-text-tertiary);
		margin-bottom: var(--space-4);
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.section-accent {
		width: 16px;
		height: 2px;
		background: var(--color-accent-gradient);
		border-radius: var(--radius-full);
	}

	.section-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.sdox-title {
		font-weight: 800;
		line-height: var(--leading-tight);
		color: var(--color-text-primary);
		margin: var(--space-6) 0 var(--space-3) 0;
	}

	.sdox-title.level-1 { font-size: var(--text-4xl); background: var(--color-accent-gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
	.sdox-title.level-2 { font-size: var(--text-3xl); }
	.sdox-title.level-3 { font-size: var(--text-2xl); }
	.sdox-title.level-4 { font-size: var(--text-xl); }
	.sdox-title.level-5 { font-size: var(--text-lg); }
	.sdox-title.level-6 { font-size: var(--text-base); }

	.sdox-paragraph {
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		white-space: pre-wrap;
	}

	.sdox-divider {
		position: relative;
		height: 1px;
		background: var(--color-border);
		margin: var(--space-8) 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.divider-diamond {
		color: var(--color-accent-primary);
		font-size: 10px;
		background: var(--color-bg-primary);
		padding: 0 var(--space-2);
	}

	/* --- Text & Semantics --- */
	.sdox-inline-text.is-bold { font-weight: 700; }
	.sdox-inline-text.is-italic { font-style: italic; }
	.sdox-inline-text.is-underline { text-decoration: underline; text-underline-offset: 4px; }
	.sdox-inline-text.is-strike { text-decoration: line-through; }

	.sdox-quote {
		position: relative;
		margin: var(--space-6) 0;
		padding: var(--space-6) var(--space-8);
		background: linear-gradient(90deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%);
		border-left: 4px solid var(--color-accent-primary);
		border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
	}

	.quote-mark {
		position: absolute;
		top: -10px;
		left: var(--space-4);
		font-size: 60px;
		font-family: Georgia, serif;
		color: rgba(56, 189, 248, 0.15);
		line-height: 1;
		user-select: none;
	}

	.quote-body {
		position: relative;
		font-size: var(--text-lg);
		font-style: italic;
		color: var(--color-text-primary);
		line-height: var(--leading-relaxed);
		z-index: 1;
	}

	.quote-author {
		display: block;
		margin-top: var(--space-4);
		font-size: var(--text-sm);
		font-style: normal;
		font-weight: 600;
		color: var(--color-accent-secondary);
		text-align: right;
	}

	.sdox-note {
		display: flex;
		margin: var(--space-6) 0;
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.note-sidebar {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
		background: rgba(0,0,0,0.2);
		border-right: 1px solid var(--color-border);
	}

	.note-icon {
		font-size: var(--text-xl);
	}

	.note-content {
		padding: var(--space-4);
		flex: 1;
	}

	.note-type {
		font-size: var(--text-xs);
		text-transform: uppercase;
		font-weight: 700;
		letter-spacing: var(--tracking-wide);
		margin-bottom: var(--space-2);
	}

	.note-body {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.note-info { border-left: 4px solid var(--color-info); }
	.note-info .note-type { color: var(--color-info); }
	
	.note-warning { border-left: 4px solid var(--color-warning); }
	.note-warning .note-type { color: var(--color-warning); }
	
	.note-danger { border-left: 4px solid var(--color-danger); }
	.note-danger .note-type { color: var(--color-danger); }
	
	.note-success { border-left: 4px solid var(--color-success); }
	.note-success .note-type { color: var(--color-success); }

	/* --- Lists --- */
	.sdox-list {
		margin: var(--space-4) 0;
		padding-left: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		color: var(--color-text-secondary);
	}

	.sdox-list.list-unordered {
		list-style: none;
	}
	
	.sdox-list.list-unordered .sdox-item::before {
		content: "";
		display: inline-block;
		width: 6px;
		height: 6px;
		background: var(--color-accent-primary);
		border-radius: 50%;
		margin-right: var(--space-3);
		transform: translateY(-2px);
	}

	.sdox-list.list-ordered {
		list-style-type: decimal;
		color: var(--color-accent-primary);
	}
	.sdox-list.list-ordered .item-text {
		color: var(--color-text-secondary);
	}

	.sdox-list.list-checklist {
		list-style: none;
		padding-left: 0;
	}

	.sdox-list.list-checklist .sdox-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
	}

	.check-box {
		width: 18px;
		height: 18px;
		border: 2px solid var(--color-border-active);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: transparent;
		margin-top: 4px;
		flex-shrink: 0;
		transition: all var(--transition-fast);
	}

	.check-box.checked {
		background: var(--color-success);
		border-color: var(--color-success);
		color: #000;
		font-weight: bold;
	}

	.sdox-item.done .item-text {
		text-decoration: line-through;
		color: var(--color-text-tertiary);
	}

	/* --- Links & Media --- */
	.sdox-url {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--color-accent-primary);
		text-decoration: none;
		font-weight: 500;
	}
	.sdox-url:hover {
		text-decoration: underline;
		color: var(--color-accent-secondary);
	}
	.link-icon {
		opacity: 0.7;
	}

	.sdox-figure {
		margin: var(--space-6) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.img-frame {
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--color-border);
		background: var(--color-bg-card);
		box-shadow: var(--shadow-sm);
	}

	.img-frame img {
		display: block;
		max-width: 100%;
		height: auto;
		transition: transform var(--transition-slow);
	}

	.img-frame:hover img {
		transform: scale(1.02);
	}

	.sdox-figure figcaption {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		text-align: center;
	}

	.sdox-video-player, .sdox-audio-player {
		margin: var(--space-6) 0;
		background: #0f172a;
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
	}
	.player-header {
		padding: var(--space-3) var(--space-4);
		background: rgba(255,255,255,0.05);
		font-size: var(--text-xs);
		font-family: var(--font-mono);
		color: var(--color-text-tertiary);
		border-bottom: 1px solid var(--color-border);
	}
	.player-icon { margin-right: var(--space-2); }
	.sdox-video { width: 100%; display: block; max-height: 400px; }
	.sdox-audio { width: 100%; padding: var(--space-2); display: block; filter: invert(0.9) hue-rotate(180deg); }

	/* Custom style overrides for media players (limited to browser defaults but styled container) */
	.sdox-audio::-webkit-media-controls-enclosure {
		background-color: #fff;
		border-radius: var(--radius-md);
	}

	/* --- Code & Output --- */
	.sdox-code-wrap {
		margin: var(--space-6) 0;
	}

	.sdox-output {
		margin: var(--space-6) 0;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: #0d1117;
		border: 1px solid var(--color-border);
	}

	.output-header {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-2) var(--space-4);
		background: rgba(255,255,255,0.05);
		border-bottom: 1px solid var(--color-border);
	}

	.output-dots {
		display: flex;
		gap: 6px;
	}

	.output-dots i {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.dot-red { background: #ff5f56; }
	.dot-yellow { background: #ffbd2e; }
	.dot-green { background: #27c93f; }

	.output-label {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		text-transform: lowercase;
	}

	.output-body {
		margin: 0;
		padding: var(--space-4);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: #a3bca6; /* Slight green terminal tint */
		overflow-x: auto;
		white-space: pre-wrap;
	}

	/* --- Tables --- */
	.sdox-table-wrap {
		margin: var(--space-6) 0;
		overflow-x: auto;
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		background: var(--color-bg-card);
	}

	.sdox-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	.sdox-row {
		border-bottom: 1px solid var(--color-border);
		transition: background var(--transition-fast);
	}

	.sdox-row:last-child {
		border-bottom: none;
	}

	.sdox-row:hover {
		background: rgba(255,255,255,0.02);
	}

	.sdox-th {
		padding: var(--space-3) var(--space-4);
		background: rgba(0,0,0,0.2);
		font-weight: 600;
		font-size: var(--text-sm);
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		border-bottom: 2px solid var(--color-border-active);
	}

	.sdox-td {
		padding: var(--space-3) var(--space-4);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	/* --- Components & Layout --- */
	.sdox-card {
		margin: var(--space-6) 0;
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		transition: all var(--transition-base);
	}

	.sdox-card:hover {
		box-shadow: var(--shadow-glow);
		border-color: var(--color-border-hover);
	}

	.card-header {
		padding: var(--space-4);
		border-bottom: 1px solid var(--color-border);
		font-weight: 600;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		gap: var(--space-3);
		background: rgba(255,255,255,0.02);
	}

	.card-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-accent-primary);
	}

	.card-body {
		padding: var(--space-4);
		color: var(--color-text-secondary);
	}

	.sdox-tab {
		margin: var(--space-6) 0;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.tab-bar {
		display: flex;
		background: var(--color-bg-card);
		border-bottom: 1px solid var(--color-border);
		padding: 0 var(--space-2);
	}

	.tab-active {
		padding: var(--space-3) var(--space-4);
		color: var(--color-accent-primary);
		font-weight: 600;
		font-size: var(--text-sm);
		border-bottom: 2px solid var(--color-accent-primary);
		margin-bottom: -1px;
	}

	.tab-content {
		padding: var(--space-4);
		background: var(--color-bg-primary);
	}

	.sdox-accordion {
		margin: var(--space-4) 0;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-bg-card);
	}

	.accordion-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		color: var(--color-text-primary);
		font-weight: 600;
		font-size: var(--text-sm);
		cursor: pointer;
		text-align: left;
	}

	.accordion-toggle:hover {
		background: rgba(255,255,255,0.02);
	}

	.accordion-chevron {
		font-size: 10px;
		color: var(--color-text-tertiary);
		transition: transform var(--transition-fast);
	}

	.accordion-chevron.open {
		transform: rotate(90deg);
	}

	.accordion-body {
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
		color: var(--color-text-secondary);
	}

	/* --- Modularization --- */
	.sdox-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: 4px var(--space-3);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		margin: var(--space-2) 0;
	}

	.sdox-chip code {
		color: var(--color-text-primary);
	}

	.chip-include { border-color: rgba(45, 212, 191, 0.3); background: rgba(45, 212, 191, 0.05); }
	.chip-use { border-color: rgba(167, 139, 250, 0.3); background: rgba(167, 139, 250, 0.05); }
	.chip-icon { opacity: 0.8; }

	.sdox-template {
		margin: var(--space-6) 0;
		border: 1px dashed var(--color-border-active);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		background: rgba(255,255,255,0.01);
	}

	.template-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin-bottom: var(--space-4);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.template-header code {
		color: var(--color-accent-primary);
		text-transform: none;
		letter-spacing: normal;
		background: var(--color-bg-code);
		padding: 2px 6px;
		border-radius: 4px;
	}

	/* --- AI-Native --- */
	.sdox-ai-block {
		--ai-color: var(--color-accent-primary);
		margin: var(--space-6) 0;
		border: 1px solid var(--color-border);
		border-left: 4px solid var(--ai-color);
		border-radius: var(--radius-md);
		background: var(--color-bg-card);
		overflow: hidden;
	}

	.ai-instruction { --ai-color: #fb7185; }
	.ai-response { --ai-color: #34d399; }
	.ai-example { --ai-color: #fbbf24; }
	.ai-metadata { --ai-color: #94a3b8; }

	.ai-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-4);
		background: rgba(0,0,0,0.2);
		border-bottom: 1px solid var(--color-border);
	}

	.ai-icon { font-size: 1.1em; }
	
	.ai-label {
		font-size: var(--text-xs);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
		color: var(--ai-color);
		flex: 1;
	}

	.model-badge {
		font-size: 10px;
		font-family: var(--font-mono);
		padding: 2px 8px;
		border-radius: var(--radius-full);
		border: 1px solid rgba(255,255,255,0.1);
		background: rgba(255,255,255,0.05);
		color: var(--color-text-secondary);
	}

	.ai-body {
		padding: var(--space-4);
		color: var(--color-text-secondary);
	}
	
	.ai-body.p-0 {
		padding: 0;
	}

	.example-code {
		margin: 0;
		padding: var(--space-4);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-text-code);
		overflow-x: auto;
	}

	.metadata-grid {
		display: flex;
		flex-direction: column;
	}

	.meta-row {
		display: flex;
		border-bottom: 1px solid var(--color-border);
	}

	.meta-row:last-child {
		border-bottom: none;
	}

	.meta-key {
		padding: var(--space-2) var(--space-4);
		width: 150px;
		background: rgba(255,255,255,0.02);
		border-right: 1px solid var(--color-border);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
	}

	.meta-val {
		padding: var(--space-2) var(--space-4);
		flex: 1;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-text-primary);
	}

	/* --- v0.2.0 Visualization --- */
	.sdox-chart-card {
		margin: var(--space-6) 0;
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
		position: relative;
	}
	.chart-header {
		font-weight: 700;
		font-size: var(--text-lg);
		margin-bottom: var(--space-6);
		color: var(--color-text-primary);
		text-align: center;
	}
	.chart-visual {
		height: 150px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: var(--space-8);
		border-bottom: 1px solid var(--color-border);
	}
	.chart-bars {
		display: flex;
		align-items: flex-end;
		gap: var(--space-4);
		height: 100%;
	}
	.chart-bar-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		width: 40px;
	}
	.chart-bar {
		width: 100%;
		border-radius: 4px 4px 0 0;
		min-height: 4px;
		transition: height 1s ease-out;
		background: var(--color-accent-gradient);
	}
	.chart-label {
		font-size: 10px;
		color: var(--color-text-tertiary);
		font-weight: 600;
		white-space: nowrap;
	}
	.chart-type-tag {
		position: absolute;
		top: var(--space-4);
		right: var(--space-4);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: var(--color-text-tertiary);
		background: rgba(255,255,255,0.05);
		padding: 2px 8px;
		border-radius: 4px;
	}

	/* --- v0.2.0 Mathematics --- */
	.sdox-math-block {
		margin: var(--space-6) 0;
		padding: var(--space-6);
		background: rgba(16, 185, 129, 0.05);
		border-radius: var(--radius-lg);
		border: 1px solid rgba(16, 185, 129, 0.2);
		text-align: center;
		color: #10b981;
		font-family: 'Times New Roman', serif;
		font-size: 1.4em;
		font-style: italic;
	}
	.sdox-math-block.is-inline {
		display: inline-block;
		margin: 0 4px;
		padding: 2px 8px;
		font-size: 1.1em;
	}

	/* --- v0.2.0 Diagrams --- */
	.sdox-diagram-block {
		margin: var(--space-6) 0;
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		background: #0f172a;
		overflow: hidden;
	}
	.diagram-header {
		padding: var(--space-2) var(--space-4);
		background: rgba(255,255,255,0.05);
		border-bottom: 1px solid var(--color-border);
		font-size: 10px;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--color-text-tertiary);
	}
	.diagram-content {
		margin: 0;
		padding: var(--space-6);
		color: #94a3b8;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		line-height: 1.6;
		text-align: center;
	}
	.diagram-render-wrap {
		padding: var(--space-6);
		display: flex;
		justify-content: center;
		background: #0f172a;
	}
	.diagram-render-wrap :global(svg) {
		max-width: 100%;
		height: auto;
	}
	.diagram-error {
		color: var(--color-danger);
		font-size: var(--text-xs);
		font-family: var(--font-mono);
	}

	.sdox-html-render, .sdox-markdown-render {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: rgba(255,255,255,0.02);
		border-radius: var(--radius-md);
		border: 1px dashed var(--color-border);
	}

	.sdox-markdown-render :global(h1), 
	.sdox-markdown-render :global(h2), 
	.sdox-markdown-render :global(h3) {
		color: var(--color-text-primary);
		margin-top: var(--space-4);
		margin-bottom: var(--space-2);
	}
	.sdox-markdown-render :global(p) {
		margin-bottom: var(--space-3);
	}
	.sdox-markdown-render :global(code) {
		background: var(--color-bg-code);
		padding: 2px 4px;
		border-radius: 4px;
		font-family: var(--font-mono);
	}

	/* --- v0.2.0 Timeline --- */
	.sdox-timeline {
		margin: var(--space-8) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		border-left: 2px solid var(--color-border);
		padding-left: var(--space-8);
		position: relative;
	}
	.sdox-timeline.is-horizontal {
		flex-direction: row;
		border-left: none;
		border-top: 2px solid var(--color-border);
		padding-left: 0;
		padding-top: var(--space-8);
	}
	.timeline-event {
		position: relative;
	}
	.event-dot {
		position: absolute;
		left: calc(-1 * var(--space-8) - 5px);
		top: 6px;
		width: 10px;
		height: 10px;
		background: var(--color-accent-primary);
		border-radius: 50%;
		box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
	}
	.is-horizontal .event-dot {
		left: 6px;
		top: calc(-1 * var(--space-8) - 5px);
	}
	.event-meta {
		display: flex;
		flex-direction: column;
		margin-bottom: var(--space-2);
	}
	.event-date {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-accent-secondary);
		text-transform: uppercase;
	}
	.event-title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text-primary);
	}
	.event-body {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	/* --- v0.2.0 Navigation & Layout --- */
	.sdox-toc-preview {
		padding: var(--space-6);
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}
	.toc-header {
		font-weight: 700;
		margin-bottom: var(--space-4);
		color: var(--color-text-primary);
		text-transform: uppercase;
		font-size: var(--text-sm);
		letter-spacing: 1px;
	}
	.toc-placeholder {
		color: var(--color-text-tertiary);
		font-style: italic;
		font-size: var(--text-sm);
	}
	.sdox-grid {
		display: grid;
		gap: var(--space-6);
		margin: var(--space-6) 0;
	}
	.sdox-column {
		border: 1px dashed rgba(255,255,255,0.05);
		border-radius: var(--radius-md);
		padding: var(--space-2);
		transition: border-color 0.2s;
	}
	.sdox-column:hover {
		border-color: rgba(56, 189, 248, 0.2);
	}
	.sdox-badge {
		display: inline-block;
		padding: 2px 10px;
		border-radius: var(--radius-full);
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.badge-info { background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); }
	.badge-success { background: rgba(52, 211, 153, 0.1); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.2); }
	.badge-warning { background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
	.badge-danger { background: rgba(248, 113, 113, 0.1); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.2); }

	/* --- v0.2.0 Documentation --- */
	.sdox-term {
		font-weight: 700;
		color: var(--color-accent-primary);
		border-bottom: 1px dashed var(--color-accent-primary);
		cursor: help;
	}
	.sdox-definition {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: rgba(255,255,255,0.02);
		border-radius: var(--radius-md);
		border-left: 2px solid var(--color-accent-secondary);
	}
	.def-label {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		margin-bottom: var(--space-2);
		display: block;
	}
	.sdox-changelog {
		margin: var(--space-8) 0;
		background: #111;
		border: 1px solid #333;
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}
	.changelog-header {
		font-weight: 800;
		color: #fff;
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid #333;
		text-transform: uppercase;
	}

	/* --- v0.2.0 Standalone Handlers --- */
	.standalone-badge {
		font-size: 8px;
		font-weight: 800;
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: 1px;
		background: rgba(255,255,255,0.05);
		padding: 1px 6px;
		border-radius: 3px;
		margin-bottom: var(--space-2);
		display: inline-block;
	}

	.sdox-standalone-item {
		padding: var(--space-3);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
	}
	.sdox-standalone-item .item-content { display: flex; gap: var(--space-2); align-items: flex-start; }
	.sdox-standalone-item .bullet { color: var(--color-accent-primary); }

	.sdox-standalone-data {
		padding: var(--space-4);
		background: rgba(255,255,255,0.02);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}
	.data-bar-wrap { display: flex; align-items: center; gap: var(--space-4); margin-top: var(--space-2); }
	.data-label { font-size: var(--text-xs); font-weight: 600; width: 80px; }
	.data-bar-bg { flex: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
	.data-bar-fill { height: 100%; border-radius: 4px; }
	.data-value { font-family: var(--font-mono); font-size: var(--text-sm); width: 40px; text-align: right; }

	.sdox-standalone-column {
		border: 2px dashed rgba(56, 189, 248, 0.2);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
	}

	.sdox-standalone-event {
		max-width: 300px;
	}
	.event-card {
		background: var(--color-bg-card);
		border: 1px solid var(--color-border);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border-left: 3px solid var(--color-accent-primary);
	}

	.sdox-ref {
		color: var(--color-accent-primary);
		text-decoration: none;
		font-weight: 600;
		border-bottom: 1px solid transparent;
		transition: all 0.2s;
	}
	.sdox-ref:hover {
		border-bottom-color: var(--color-accent-primary);
		opacity: 0.8;
	}
	.ref-icon { font-size: 0.8em; opacity: 0.6; }

	/* --- Unknown / Fallback --- */
	.sdox-unknown {
		padding: var(--space-3);
		border: 1px dashed var(--color-danger);
		border-radius: var(--radius-md);
		background: rgba(248, 113, 113, 0.05);
		margin: var(--space-4) 0;
	}

	.unknown-tag {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-bottom: var(--space-2);
		font-weight: bold;
	}
</style>
