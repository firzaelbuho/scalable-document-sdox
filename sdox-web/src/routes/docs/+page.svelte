<script lang="ts">
	import { tagCategories } from '$lib/data/tags';
	import DocSidebar from '$lib/components/docs/DocSidebar.svelte';
	import DocSection from '$lib/components/docs/DocSection.svelte';
	import CategoryGroup from '$lib/components/docs/CategoryGroup.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	let activeSection = $state('introduction');

	const quickStartCode = `#title(level=1) My First SDOX Document

#paragraph {
  Welcome to Scalable Document!
  This is a semantic document language
  where everything is a #tag.
}

#note(type="info") {
  SDOX files use the .sdox extension.
}

#list(type="ordered") {
  #item Create a .sdox file
  #item Write semantic tags
  #item Parse into AST
}

#code(language="bash") {
  sdox fmt document.sdox
}`;

	const syntaxInline = `#title(level=1) Hello World
#divider
#item(done=true) Task complete`;

	const syntaxBlock = `#paragraph {
  Multi-line content goes inside
  curly braces with block syntax.
}

#code(language="python") {
  def hello():
      print("Hello, SDOX!")
}`;

	const syntaxAttrs = `#code(
  language="python",
  title="main.py",
  line_number=true,
  highlight="2,5"
) {
  def hello():
      print("hello")
}

#note(type="warning") {
  Always use explicit attribute names.
}`;

	// Scroll spy for active section tracking
	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				}
			},
			{
				rootMargin: '-20% 0px -70% 0px'
			}
		);

		// Observe all sections and tag refs
		const sections = document.querySelectorAll('.doc-section, [id^="tag-"], .category-group[id]');
		sections.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Documentation — SDOX</title>
	<meta name="description" content="Complete documentation for all SDOX tags, attributes, and syntax." />
</svelte:head>

<div class="docs-container container">
	<DocSidebar categories={tagCategories} {activeSection} />

	<div class="docs-content">
		<!-- Introduction -->
		<DocSection id="introduction" title="Introduction" description="Scalable Document (SDOX) is a semantic, structured, and AI-friendly document language inspired by Markdown. It replaces ambiguous symbol-based syntax with a consistent, deterministic tag model.">
			<div class="intro-principles">
				<div class="principle-card glass-card">
					<span class="principle-icon">🎯</span>
					<h4>Consistent</h4>
					<p>All elements use the same <code class="inline-code">#tag(attr=value)</code> syntax model.</p>
				</div>
				<div class="principle-card glass-card">
					<span class="principle-icon">🧠</span>
					<h4>Semantic</h4>
					<p>Tags describe meaning, not visual appearance. Content and presentation are separated.</p>
				</div>
				<div class="principle-card glass-card">
					<span class="principle-icon">⚡</span>
					<h4>Deterministic</h4>
					<p>Same input always produces the same AST. No ambiguous interpretation.</p>
				</div>
				<div class="principle-card glass-card">
					<span class="principle-icon">📖</span>
					<h4>Readable</h4>
					<p>Raw <code class="inline-code">.sdox</code> files remain human-readable in any text editor.</p>
				</div>
			</div>
		</DocSection>

		<!-- Quick Start -->
		<DocSection id="quick-start" title="Quick Start" description="Get started with SDOX in under a minute.">
			<div class="quickstart-grid">
				<div class="quickstart-info">
					<div class="step">
						<span class="step-num">1</span>
						<div>
							<h4>Create a <code class="inline-code">.sdox</code> file</h4>
							<p>Any text editor works. Create <code class="inline-code">document.sdox</code></p>
						</div>
					</div>
					<div class="step">
						<span class="step-num">2</span>
						<div>
							<h4>Write semantic tags</h4>
							<p>Use <code class="inline-code">#tag</code> syntax for every element</p>
						</div>
					</div>
					<div class="step">
						<span class="step-num">3</span>
						<div>
							<h4>Parse and render</h4>
							<p>Use an SDOX parser to convert to AST, then render to HTML/PDF</p>
						</div>
					</div>
				</div>
				<div class="quickstart-code">
					<CodeBlock code={quickStartCode} language="sdox" title="hello.sdox" showLineNumbers />
				</div>
			</div>
		</DocSection>

		<!-- Syntax Guide -->
		<DocSection id="syntax-guide" title="Syntax Guide" description="Understanding the two forms of SDOX syntax and how attributes work.">
			<div class="syntax-cards">
				<div class="syntax-card">
					<h4>Inline Form</h4>
					<p>For single-line content. Tag and content on the same line.</p>
					<CodeBlock code={syntaxInline} language="sdox" />
				</div>
				<div class="syntax-card">
					<h4>Block Form</h4>
					<p>For multi-line content. Content wrapped in curly braces.</p>
					<CodeBlock code={syntaxBlock} language="sdox" />
				</div>
				<div class="syntax-card">
					<h4>Attributes</h4>
					<p>Key-value pairs inside parentheses. Use lowercase, snake_case, explicit names.</p>
					<CodeBlock code={syntaxAttrs} language="sdox" />
				</div>
			</div>
		</DocSection>

		<!-- AI Dataset -->
		<DocSection id="ai-dataset" title="LLM Context Dataset" description="Train or prompt Large Language Models (LLMs) to natively understand and generate SDOX format.">
			<div class="ai-dataset-box glass-card">
				<div class="dataset-header">
					<div>
						<h4>SDOX v0.2.0 Prompt Context</h4>
						<p>Copy this prompt or provide the raw markdown file as context to any LLM (ChatGPT, Claude, etc.) so it can perfectly generate SDOX syntax instead of Markdown.</p>
					</div>
					<div class="action-buttons">
						<button class="btn btn-secondary" onclick={() => {
							fetch('/sdox-llm-dataset.md')
								.then(res => res.text())
								.then(text => {
									navigator.clipboard.writeText(text);
									alert('Prompt copied to clipboard!');
								})
								.catch(err => alert('Failed to copy: ' + err));
						}}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
							</svg>
							Copy Prompt
						</button>
						<a href="/sdox-llm-dataset.md" download="sdox-llm-dataset-v0.2.0.md" rel="external" class="btn btn-primary">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
								<polyline points="7 10 12 15 17 10"></polyline>
								<line x1="12" y1="15" x2="12" y2="3"></line>
							</svg>
							Download .md
						</a>
					</div>
				</div>
				<div class="dataset-preview">
					<div class="preview-header">
						<span>Preview: sdox-llm-dataset.md</span>
					</div>
					<pre><code># SDOX (Scalable Document) v0.2.0 - LLM Knowledge Dataset

You are an AI assistant generating SDOX (Scalable Document) format. 
SDOX is a deterministic, semantic document language that replaces Markdown. Everything in SDOX is a tag. 
There is no ambiguous syntax (like *, #, or > in Markdown). 

## 1. Syntax Rules
1. **Tag Format**: Every element is defined by a tag starting with `#`.
   - **Inline Form**: `#tag(attr="value") content...`
   - **Block Form**: `#tag(attr="value") &#123; content... &#125;`

[...Download to see full rules & tag dictionary...]</code></pre>
				</div>
			</div>
		</DocSection>
		<!-- Tag Reference by Category -->
		{#each tagCategories as category}
			<DocSection
				id={category.id}
				title="{category.icon} {category.name}"
				description={category.description}
			>
				<CategoryGroup {category} />
			</DocSection>
		{/each}
	</div>
</div>

<style>
	.docs-container {
		display: flex;
		gap: var(--space-10);
		padding-top: var(--space-8);
		padding-bottom: var(--space-16);
	}

	.docs-content {
		flex: 1;
		min-width: 0;
	}

	/* --- Intro Principles --- */
	.intro-principles {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.principle-card {
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.principle-icon {
		font-size: 1.4rem;
	}

	.principle-card h4 {
		font-size: var(--text-base);
		font-weight: 700;
	}

	.principle-card p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	/* --- Quick Start --- */
	.quickstart-grid {
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: var(--space-8);
		align-items: start;
	}

	.quickstart-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.step {
		display: flex;
		gap: var(--space-4);
		align-items: flex-start;
	}

	.step-num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--color-accent-glow);
		border: 1px solid var(--color-border);
		color: var(--color-accent-primary);
		font-weight: 700;
		font-size: var(--text-sm);
		flex-shrink: 0;
	}

	.step h4 {
		font-size: var(--text-base);
		font-weight: 600;
		margin-bottom: 4px;
	}

	.step p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	/* --- Syntax Guide --- */
	.syntax-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.syntax-card {
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-bg-card);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.syntax-card h4 {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-accent-primary);
	}

	.syntax-card p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	/* --- Responsive --- */
	@media (max-width: 1024px) {
		.docs-container {
			flex-direction: column;
		}

		.intro-principles {
			grid-template-columns: 1fr;
		}

		.quickstart-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.intro-principles {
			grid-template-columns: 1fr;
		}
	}

	/* --- AI Dataset --- */
	.ai-dataset-box {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.dataset-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-6);
		padding: var(--space-6);
		background: rgba(56, 189, 248, 0.05);
		border-bottom: 1px solid var(--color-border);
	}

	.dataset-header h4 {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-accent-primary);
		margin-bottom: var(--space-2);
	}

	.dataset-header p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		max-width: 500px;
	}

	.action-buttons {
		display: flex;
		gap: var(--space-3);
		align-items: center;
	}

	.dataset-preview {
		background: var(--color-bg-code);
	}

	.preview-header {
		padding: var(--space-2) var(--space-4);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		border-bottom: 1px solid var(--color-border);
		background: rgba(255, 255, 255, 0.02);
	}

	.dataset-preview pre {
		margin: 0;
		padding: var(--space-4);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-text-code);
		overflow-x: auto;
	}

	@media (max-width: 768px) {
		.dataset-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-4);
		}
	}
</style>
