<script lang="ts">
	import { parseSdox } from '$lib/utils/sdoxParser';
	import SdoxRenderer from '$lib/components/preview/SdoxRenderer.svelte';

	let sdoxInput = $state(`#title(level=1, id="main-title") SDOX v0.2.0 Live Showcase
#badge(type="success") Draft Specification

#section(title="1. Structure") {
  #paragraph { SDOX structure is defined by #text(style="bold") titles, sections, and paragraphs. }
  #divider
  #section(title="Sub-section Example") {
    #paragraph { This is nested. }
  }
}

#section(title="2. Text & Semantics") {
  #paragraph {
    Styled text: #text(style="bold") Bold, #text(style="italic") Italic, #text(style="underline") Underline.
    Colored: #text(color="#38bdf8") Blue, #text(color="#f87171") Red.
  }
  #quote(author="Albert Einstein") { Logic will get you from A to B. Imagination will take you everywhere. }
  #note(type="info") { This is an informational note. }
  #note(type="warning") { This is a warning. }
}

#section(title="3. Lists") {
  #grid(columns=2) {
    #column {
      #list(type="unordered") { #item Unordered A #item Unordered B }
    }
    #column {
      #list(type="checklist") { #item(done=true) Checked #item(done=false) Unchecked }
    }
  }
}

#section(title="4. Links & Media") {
  #paragraph { Visit #url(href="https://sdox-dev.vercel.app") SDOX Official. }
  #image(src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800", alt="Tech")
  #video(src="https://www.w3schools.com/html/mov_bbb.mp4")
  #audio(src="https://www.w3schools.com/html/horse.mp3")
}

#section(title="5. Code & Output") {
  #code(language="python", title="script.py") {
    def hello():
        print("Hello from SDOX!")
  }
  #output(type="terminal") {
    $ python script.py
    Hello from SDOX!
  }
}

#section(title="6. Components") {
  #table {
    #row { #cell(header=true) Feature #cell(header=true) Status }
    #row { #cell Parsing #cell Stable }
    #row { #cell Rendering #cell v0.2.0 }
  }
  #card(title="Interactive Card") { Content inside a card component. }
  #accordion(title="View Details") { Hidden content revealed on click. }
}

#section(title="7. Modularization") {
  #include(src="theme.sdox")
  #template(name="alert") { #note(type="warning") { ALERT! } }
  #use(template="alert")
}

#section(title="8. AI-Native") {
  #metadata { #item(key="id") 123 #item(key="model") s-1 }
  #instruction(priority="high") { Act as a document expert. }
  #dataset(name="train_v1") { #example { Sample text. } }
  #response(model="claude-3") { SDOX is the future. }
}

#section(title="9. Integration (v0.2.0)") {
  #paragraph { Embed other formats directly: }
  #grid(columns=2) {
    #column {
      #title(level=4) Raw HTML
      #html {
        <div style="padding: 1rem; border-radius: 8px; background: linear-gradient(45deg, #f06, #4a90e2); color: white; font-weight: bold; text-align: center;">
          Custom HTML Gradient
        </div>
      }
    }
    #column {
      #title(level=4) Markdown
      #markdown {
        ### Parsed MD
        - Support for **bold**
        - Support for *italic*
        - [Links](https://sdox.dev)
      }
    }
  }
}

#section(title="10. Visualization (v0.2.0)") {
  #chart(type="bar", title="Adoption Growth") {
    #data(label="Q1", value=30, color="#94a3b8")
    #data(label="Q2", value=65, color="#38bdf8")
    #data(label="Q3", value=90, color="#8b5cf6")
  }
}

#section(title="11. Mathematics (v0.2.0)") {
  #paragraph { Complex equations rendered with KaTeX: }
  #math { \\oint_C \\mathbf{E} \\cdot d\\mathbf{l} = -\\frac{d\\Phi_B}{dt} }
  #paragraph { Inline theory: #math(display="inline") { a^2 + b^2 = c^2 }. }
}

#section(title="12. Diagrams (v0.2.0)") {
  #diagram(type="flowchart") {
    graph LR;
    User-->Input;
    Input-->Parser;
    Parser-->AST;
    AST-->Output;
  }
  #timeline {
    #event(date="2024-05", title="v0.2.0") New visual tags.
  }
}

#section(title="13. Navigation & Layout (v0.2.0)") {
  #toc
  #grid(columns=3) {
    #column { #badge(type="info") Col 1 }
    #column { #badge(type="success") Col 2 }
    #column { #badge(type="warning") Col 3 }
  }
  #paragraph { Go back to #ref(to="main-title") Start. }
}

#section(title="14. Documentation (v0.2.0)") {
  #term(id="ast") AST
  #definition(for="ast") Abstract Syntax Tree.
  #changelog {
    #item(done=true) Integrated KaTeX.
    #item(done=true) Integrated Mermaid.
  }
}
`);

	// Reactively compute the AST whenever the input changes
	let ast = $derived(parseSdox(sdoxInput));

	// Simple syntax highlighting for the editor
	let highlightedCode = $derived(
		sdoxInput
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/(\{|\})/g, '___BRACKET___$1___END___')
			.replace(/(#[a-zA-Z0-9_]+)/g, '___TAG___$1___END___')
			.replace(/([a-zA-Z0-9_]+)=/g, '___ATTR___$1___END___=')
			.replace(/___BRACKET___/g, '<span class="sdox-bracket">')
			.replace(/___TAG___/g, '<span class="sdox-tag">')
			.replace(/___ATTR___/g, '<span class="sdox-attr">')
			.replace(/___END___/g, '</span>') + (sdoxInput.endsWith('\n') ? ' ' : '') // preserve scrolling for trailing newline
	);
</script>

<svelte:head>
	<title>Live Preview — SDOX</title>
	<meta
		name="description"
		content="Live interactive preview for Scalable Document (SDOX) syntax."
	/>
</svelte:head>

<div class="preview-page container">
	<div class="header">
		<h1>Live Preview Translator</h1>
		<p>Type SDOX syntax on the left and see the rendered HTML on the right.</p>
	</div>

	<div class="split-pane">
		<div class="pane editor-pane glass-card">
			<div class="pane-header">
				<span class="badge">SDOX Source</span>
			</div>
			<div class="editor-container">
				<pre aria-hidden="true" class="editor-highlight">{@html highlightedCode}</pre>
				<textarea
					bind:value={sdoxInput}
					class="editor-textarea"
					spellcheck="false"
					placeholder="Type your SDOX code here..."
				></textarea>
			</div>
		</div>

		<div class="pane preview-pane glass-card">
			<div class="pane-header">
				<span class="badge">Rendered Output</span>
			</div>
			<div class="preview-content">
				<SdoxRenderer node={ast} />
			</div>
		</div>
	</div>

	<!-- Debug section to see the AST -->
	<div class="debug-section glass-card">
		<details>
			<summary>Show Generated AST JSON</summary>
			<pre class="ast-json">{JSON.stringify(ast, null, 2)}</pre>
		</details>
	</div>
</div>

<style>
	.preview-page {
		padding-top: var(--space-8);
		padding-bottom: var(--space-16);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		min-height: calc(100vh - var(--navbar-height));
	}

	.header h1 {
		font-size: var(--text-3xl);
		font-weight: 800;
		color: var(--color-text-primary);
		margin-bottom: var(--space-2);
	}

	.header p {
		color: var(--color-text-secondary);
	}

	.split-pane {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-6);
		flex: 1;
		min-height: 500px;
	}

	.pane {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.pane-header {
		padding: var(--space-3) var(--space-4);
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid var(--color-border);
		display: flex;
		align-items: center;
	}

	.badge {
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wider);
		color: var(--color-accent-primary);
		background: var(--color-accent-glow);
		padding: 4px 8px;
		border-radius: var(--radius-sm);
		border: 1px solid rgba(56, 189, 248, 0.2);
	}

	.editor-container {
		flex: 1;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.editor-textarea,
	.editor-highlight {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: var(--space-4);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		line-height: 1.6;
		white-space: pre-wrap;
		word-wrap: break-word;
		border: none;
		overflow: auto;
		tab-size: 2;
	}

	.editor-textarea {
		color: transparent;
		caret-color: var(--color-text-primary);
		background: transparent;
		resize: none;
		outline: none;
		z-index: 2;
	}

	.editor-highlight {
		color: var(--color-text-primary);
		background: transparent;
		z-index: 1;
		pointer-events: none;
	}

	.editor-textarea::placeholder {
		color: var(--color-text-tertiary);
	}

	/* Simple Syntax Highlighting Colors */
	:global(.sdox-tag) {
		color: var(--color-accent-primary);
		font-weight: 600;
	}
	:global(.sdox-attr) {
		color: #a78bfa; /* light purple */
	}
	:global(.sdox-bracket) {
		color: #fcd34d; /* yellow */
	}

	.preview-content {
		flex: 1;
		padding: var(--space-4);
		overflow-y: auto;
		background: var(--color-bg-primary); /* slightly darker than card background */
	}

	.debug-section {
		margin-top: var(--space-4);
		padding: var(--space-4);
		border: 1px dashed var(--color-border);
	}

	details summary {
		cursor: pointer;
		color: var(--color-text-secondary);
		font-weight: 500;
		outline: none;
	}

	.ast-json {
		margin-top: var(--space-4);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		background: rgba(0, 0, 0, 0.3);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		overflow-x: auto;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.split-pane {
			grid-template-columns: 1fr;
			grid-template-rows: 400px minmax(500px, auto);
		}
	}
</style>
