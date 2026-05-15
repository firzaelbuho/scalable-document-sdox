<script lang="ts">
	import { tagCategories, getTagCount } from '$lib/data/tags';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const heroCode = `#title(level=1) SDOX v0.2.0
#badge(type="success") New Features

#grid(columns=2) {
  #column {
    #math { \int_{a}^{b} f(x) dx }
  }
  #column {
    #chart(type="bar") {
      #data(label="A", value=80)
      #data(label="B", value=120)
    }
  }
}

#diagram(type="flowchart") {
  graph LR;
  A-->B;
}`;

	const markdownExample = `# Heading

Some paragraph text with **bold** and *italic*.

> A blockquote

\`\`\`python
print("hello")
\`\`\`

- Item one
- Item two`;

	const sdoxExample = `#title(level=1) Heading

#paragraph {
  Some paragraph text with
  #text(style="bold") bold and
  #text(style="italic") italic.
}

#quote {
  A blockquote
}

#code(language="python") {
  print("hello")
}

#list(type="unordered") {
  #item Item one
  #item Item two
}`;

	const aiExample = `#dataset(name="qa_training") {

  #instruction(priority="high") {
    Summarize the document in 3 points.
  }

  #context(scope="authentication") {
    OAuth 2.0 is the industry standard
    protocol for authorization.
  }

  #response(model="gpt-5") {
    - Secure delegated access
    - Multiple grant types
    - Industry-wide adoption
  }
}

#embedding(model="text-embedding-3")

#chunk(size=500) {
  Content for vector DB ingestion...
}`;

	const features = [
		{
			icon: '🎯',
			title: 'Consistent Syntax',
			description: 'Every element uses the same #tag(attr=value) model. No more memorizing different symbols for different elements.'
		},
		{
			icon: '🧠',
			title: 'Semantic by Design',
			description: 'Tags describe meaning, not appearance. Use #warning and #note instead of #redText and #bigTitle.'
		},
		{
			icon: '⚡',
			title: 'Deterministic Parsing',
			description: 'Same input always produces the same AST. No ambiguous interpretation, no edge cases, no surprises.'
		},
		{
			icon: '🤖',
			title: 'AI-Native Tags',
			description: 'First-class support for datasets, embeddings, chunking, prompts, and context scoping.'
		},
		{
			icon: '📦',
			title: 'Modular Architecture',
			description: 'Compose documents from reusable templates. Include external files. Build scalable documentation systems.'
		},
		{
			icon: '🔧',
			title: 'Extensible Attributes',
			description: 'Every tag supports custom attributes. No need for workarounds or hacks to extend functionality.'
		}
	];

	const comparisonPoints = [
		{ aspect: 'Syntax Model', markdown: 'Mixed symbols (#, *, >, -, ```)', sdox: 'Uniform #tag model' },
		{ aspect: 'Parsing', markdown: 'Ambiguous edge cases', sdox: 'Deterministic AST' },
		{ aspect: 'Semantics', markdown: 'Visual-oriented', sdox: 'Meaning-first' },
		{ aspect: 'AI Support', markdown: 'Not built for AI', sdox: 'Native AI tags' },
		{ aspect: 'Modularity', markdown: 'Single-file', sdox: '#include, #template, #use' },
		{ aspect: 'Attributes', markdown: 'Limited/none', sdox: 'On every tag' }
	];

	const totalTags = getTagCount();
</script>

<svelte:head>
	<title>SDOX — Scalable Document Language</title>
	<meta name="description" content="A semantic, structured, and AI-friendly document language. Modern alternative to Markdown with deterministic parsing." />
</svelte:head>

<!-- Hero Section -->
<section class="hero bg-grid bg-radial-glow">
	<div class="container hero-inner">
		<div class="hero-content">
			<div class="hero-badge badge animate-fade-in-up">
				<span>v0.2.0</span>
				<span class="badge-sep">·</span>
				<span>Draft Specification</span>
			</div>

			<h1 class="hero-title animate-fade-in-up delay-1">
				<span class="gradient-text">Scalable Document</span>
				<br />for the AI Era
			</h1>

			<p class="hero-subtitle animate-fade-in-up delay-2">
				A semantic, structured, and deterministic document language.
				<br />Everything is a <code class="inline-code">#tag</code>.
			</p>

			<div class="hero-actions animate-fade-in-up delay-3">
				<a href="/docs" class="btn btn-primary">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
					</svg>
					Documentation
				</a>
				<a
					href="https://github.com/firzaelbuho/scalable-document-sdox"
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-secondary"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
					GitHub
				</a>
			</div>

			<div class="hero-stats animate-fade-in-up delay-4">
				<div class="stat">
					<span class="stat-value">{totalTags}</span>
					<span class="stat-label">Tags</span>
				</div>
				<div class="stat-sep"></div>
				<div class="stat">
					<span class="stat-value">{tagCategories.length}</span>
					<span class="stat-label">Categories</span>
				</div>
				<div class="stat-sep"></div>
				<div class="stat">
					<span class="stat-value">.sdox</span>
					<span class="stat-label">Extension</span>
				</div>
			</div>
		</div>

		<div class="hero-code animate-fade-in-up delay-3">
			<CodeBlock code={heroCode} language="sdox" title="example.sdox" />
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="section features-section">
	<div class="container">
		<div class="section-intro">
			<span class="badge">Core Principles</span>
			<h2 class="section-heading">Built for <span class="gradient-text">clarity and scale</span></h2>
			<p class="section-sub">SDOX eliminates the ambiguity and inconsistency of traditional markup languages.</p>
		</div>

		<div class="features-grid">
			{#each features as feature, i}
				<div class="feature-card glass-card animate-fade-in-up delay-{i + 1}">
					<span class="feature-icon">{feature.icon}</span>
					<h3 class="feature-title">{feature.title}</h3>
					<p class="feature-desc">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Comparison Section -->
<section class="section comparison-section">
	<div class="container">
		<div class="section-intro">
			<span class="badge">Comparison</span>
			<h2 class="section-heading">Markdown vs <span class="gradient-text">SDOX</span></h2>
			<p class="section-sub">Side-by-side comparison of syntax and capability.</p>
		</div>

		<div class="comparison-grid">
			<div class="compare-block">
				<div class="compare-label">
					<span class="compare-dot markdown-dot"></span>
					Markdown
				</div>
				<CodeBlock code={markdownExample} language="markdown" />
			</div>
			<div class="compare-block">
				<div class="compare-label">
					<span class="compare-dot sdox-dot"></span>
					SDOX
				</div>
				<CodeBlock code={sdoxExample} language="sdox" />
			</div>
		</div>

		<div class="comparison-table-wrapper">
			<table class="comparison-table">
				<thead>
					<tr>
						<th>Aspect</th>
						<th>Markdown</th>
						<th>SDOX</th>
					</tr>
				</thead>
				<tbody>
					{#each comparisonPoints as point}
						<tr>
							<td class="aspect-cell">{point.aspect}</td>
							<td class="md-cell">{point.markdown}</td>
							<td class="sdox-cell">{point.sdox}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<!-- Tag Categories Section -->
<section class="section categories-section bg-grid">
	<div class="container">
		<div class="section-intro">
			<span class="badge">{totalTags} Tags</span>
			<h2 class="section-heading">Organized by <span class="gradient-text">purpose</span></h2>
			<p class="section-sub">Every tag belongs to a semantic category. Explore them all in the documentation.</p>
		</div>

		<div class="categories-grid">
			{#each tagCategories as cat}
				<a href="/docs#{cat.id}" class="category-card glass-card">
					<span class="cat-icon">{cat.icon}</span>
					<h3 class="cat-name">{cat.name}</h3>
					<p class="cat-desc">{cat.description}</p>
					<div class="cat-tags">
						{#each cat.tags as tag}
							<span class="cat-tag" style="color: {cat.color}">#{tag.name}</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- AI Native Section -->
<section class="section ai-section">
	<div class="container">
		<div class="ai-layout">
			<div class="ai-content">
				<span class="badge">First-Class AI Support</span>
				<h2 class="section-heading">Built for the <span class="gradient-text">AI era</span></h2>
				<p class="ai-desc">
					SDOX includes native tags for AI workflows — datasets, embeddings,
					prompts, chunking, and context scoping. No plugins, no workarounds.
				</p>
				<div class="ai-features">
					<div class="ai-feature">
						<span class="ai-feature-icon">📊</span>
						<div>
							<strong>Datasets</strong>
							<span>Structure training data inline</span>
						</div>
					</div>
					<div class="ai-feature">
						<span class="ai-feature-icon">🧬</span>
						<div>
							<strong>Embeddings</strong>
							<span>Mark content for vectorization</span>
						</div>
					</div>
					<div class="ai-feature">
						<span class="ai-feature-icon">✂️</span>
						<div>
							<strong>Chunking</strong>
							<span>Optimized for vector DBs</span>
						</div>
					</div>
					<div class="ai-feature">
						<span class="ai-feature-icon">🎯</span>
						<div>
							<strong>Context Scoping</strong>
							<span>Precise semantic boundaries</span>
						</div>
					</div>
				</div>
			</div>
			<div class="ai-code">
				<CodeBlock code={aiExample} language="sdox" title="ai-workflow.sdox" />
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="section cta-section bg-radial-glow">
	<div class="container cta-inner">
		<h2 class="cta-title">Ready to explore <span class="gradient-text">SDOX</span>?</h2>
		<p class="cta-desc">
			Dive into the full specification with interactive documentation and code examples.
		</p>
		<div class="cta-actions">
			<a href="/docs" class="btn btn-primary">
				Read the Documentation
			</a>
			<a
				href="https://github.com/firzaelbuho/scalable-document-sdox"
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-secondary"
			>
				View on GitHub
			</a>
		</div>
	</div>
</section>

<style>
	/* --- Hero --- */
	.hero {
		position: relative;
		padding: var(--space-24) 0 var(--space-20);
		overflow: hidden;
	}

	.hero-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-12);
		align-items: center;
		position: relative;
		z-index: 1;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.hero-badge {
		align-self: flex-start;
	}

	.badge-sep {
		opacity: 0.4;
	}

	.hero-title {
		font-size: var(--text-5xl);
		font-weight: 900;
		line-height: 1.1;
		letter-spacing: -0.03em;
	}

	.hero-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	.hero-actions {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-2);
	}

	.hero-stats {
		display: flex;
		align-items: center;
		gap: var(--space-6);
		margin-top: var(--space-4);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.stat-value {
		font-family: var(--font-mono);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-accent-primary);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.stat-sep {
		width: 1px;
		height: 32px;
		background: var(--color-border);
	}

	.hero-code {
		animation: float 6s ease-in-out infinite;
	}

	/* --- Section Intro --- */
	.section-intro {
		text-align: center;
		margin-bottom: var(--space-12);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}

	.section-heading {
		font-size: var(--text-4xl);
		font-weight: 800;
	}

	.section-sub {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		max-width: 600px;
	}

	/* --- Features --- */
	.features-section {
		background: var(--color-bg-secondary);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
	}

	.feature-card {
		padding: var(--space-8);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.feature-icon {
		font-size: 2rem;
	}

	.feature-title {
		font-size: var(--text-lg);
		font-weight: 700;
	}

	.feature-desc {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	/* --- Comparison --- */
	.comparison-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-6);
		margin-bottom: var(--space-10);
	}

	.compare-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.compare-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.compare-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.markdown-dot {
		background: var(--color-text-tertiary);
	}

	.sdox-dot {
		background: var(--color-accent-primary);
		box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
	}

	.comparison-table-wrapper {
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.comparison-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
	}

	.comparison-table thead {
		background: rgba(255, 255, 255, 0.03);
	}

	.comparison-table th {
		padding: var(--space-4);
		text-align: left;
		font-weight: 600;
		color: var(--color-text-secondary);
		border-bottom: 1px solid var(--color-border);
	}

	.comparison-table td {
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
	}

	.comparison-table tr:last-child td {
		border-bottom: none;
	}

	.aspect-cell {
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.md-cell {
		color: var(--color-text-tertiary);
	}

	.sdox-cell {
		color: var(--color-accent-primary);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	/* --- Categories --- */
	.categories-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-5);
	}

	.category-card {
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		text-decoration: none;
		color: inherit;
	}

	.cat-icon {
		font-size: 1.6rem;
	}

	.cat-name {
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.cat-desc {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
		flex: 1;
	}

	.cat-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}

	.cat-tag {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		font-weight: 600;
		padding: 2px 6px;
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-sm);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	/* --- AI Section --- */
	.ai-section {
		background: var(--color-bg-secondary);
	}

	.ai-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-12);
		align-items: center;
	}

	.ai-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		align-items: flex-start;
	}

	.ai-desc {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	.ai-features {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-top: var(--space-4);
	}

	.ai-feature {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.ai-feature-icon {
		font-size: 1.4rem;
		width: 2em;
		text-align: center;
		flex-shrink: 0;
	}

	.ai-feature div {
		display: flex;
		flex-direction: column;
	}

	.ai-feature strong {
		font-size: var(--text-sm);
		color: var(--color-text-primary);
	}

	.ai-feature span {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}

	/* --- CTA --- */
	.cta-section {
		text-align: center;
		position: relative;
	}

	.cta-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-5);
		position: relative;
		z-index: 1;
	}

	.cta-title {
		font-size: var(--text-4xl);
		font-weight: 800;
	}

	.cta-desc {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		max-width: 500px;
	}

	.cta-actions {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-4);
	}

	/* --- Responsive --- */
	@media (max-width: 1024px) {
		.hero-inner {
			grid-template-columns: 1fr;
			gap: var(--space-10);
		}

		.hero-title {
			font-size: var(--text-4xl);
		}

		.hero-code {
			animation: none;
		}

		.features-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.categories-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.ai-layout {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: var(--text-3xl);
		}

		.section-heading {
			font-size: var(--text-3xl);
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.comparison-grid {
			grid-template-columns: 1fr;
		}

		.categories-grid {
			grid-template-columns: 1fr;
		}

		.hero-actions,
		.cta-actions {
			flex-direction: column;
			width: 100%;
		}

		.hero-actions .btn,
		.cta-actions .btn {
			width: 100%;
		}

		.hero-stats {
			justify-content: center;
		}
	}
</style>
