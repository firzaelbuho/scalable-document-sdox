<script lang="ts">
	import { parseSdox } from '$lib/utils/sdoxParser';
	import SdoxRenderer from '$lib/components/preview/SdoxRenderer.svelte';

	let sdoxInput = $state(`#title(level=1) SDOX Live Preview

#paragraph {
  Welcome to the SDOX Live Preview!
  Edit the text on the left to see it rendered in real time.
}

#divider

#section(title="Text & Semantics") {
  #quote(author="Alan Turing") {
    We can only see a short distance ahead,
    but we can see plenty there that needs to be done.
  }

  #note(type="info") {
    SDOX supports all common text encodings.
  }

  #note(type="warning") {
    Never expose API keys in client-side code.
  }

  #paragraph {
    Here is some #text(style="bold") bold text, some #text(style="italic") italic text, and #text(style="underline") underlined text. You can even combine styles like #text(style="strikethrough", color="#f87171") strikethrough with color.
  }
}

#section(title="Lists") {
  #list(type="ordered") {
    #item First item
    #item Second item
    #item Third item
  }

  #list(type="checklist") {
    #item(done=true) Setup project
    #item(done=false) Write docs
    #item(done=true) Ship v1
  }
}

#section(title="Code & Output") {
  #code(language="python", title="main.py") {
    def greet(name):
        return f"Hello, {name}!"
  }

  #output(type="terminal") {
    $ python main.py
    Hello, SDOX!
  }
}

#section(title="Tables") {
  #table {
    #row {
      #cell(header=true) Tag
      #cell(header=true) Category
      #cell(header=true) Status
    }
    #row {
      #cell title
      #cell Structure
      #cell Stable
    }
    #row {
      #cell quote
      #cell Text
      #cell Stable
    }
  }
}

#section(title="Components") {
  #card(title="Getting Started") {
    Install SDOX and start writing structured documents.
  }

  #accordion(title="Advanced Configuration") {
    Custom parser options can be set in sdox.config.json
  }

  #tab(title="Linux") {
    #code(language="bash") {
      sudo apt install sdox
    }
  }
}

#section(title="Modularization") {
  #include(src="./authentication.sdox")
  #template(name="api_endpoint") {
    #code(language="bash") {
      curl -X GET /api/resource
    }
  }
  #use(template="api_endpoint")
}

#section(title="AI-Native") {
  #metadata {
    #item(key="author") John
    #item(key="version") 1.0
    #item(key="status") draft
  }

  #instruction(priority="high") {
    Always respond in JSON format.
  }

  #response(model="gpt-5") {
    The analysis shows three key findings...
  }

  #dataset(name="qa_pairs") {
    Training data for Q&A model.
  }

  #context(scope="authentication") {
    OAuth 2.0 is the standard protocol.
  }

  #chunk(size=500) {
    Content optimized for vector DB ingestion.
  }

  #embedding(model="text-embedding-3")
  #completion(model="gpt-5") {
    Continue the documentation...
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
			.replace(/___END___/g, '</span>')
			+ (sdoxInput.endsWith('\n') ? ' ' : '') // preserve scrolling for trailing newline
	);
</script>

<svelte:head>
	<title>Live Preview — SDOX</title>
	<meta name="description" content="Live interactive preview for Scalable Document (SDOX) syntax." />
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

	.editor-textarea, .editor-highlight {
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
