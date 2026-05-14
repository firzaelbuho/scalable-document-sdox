# Part 2: SdoxRenderer Styles

```css
<style>
	.sdox-doc { display:flex; flex-direction:column; gap:var(--space-4); }

	/* Section */
	.sdox-section { display:flex; flex-direction:column; gap:var(--space-4); padding-left:var(--space-4); border-left:2px solid rgba(129,140,248,0.2); margin:var(--space-4) 0; }
	.section-title { font-size:var(--text-2xl); font-weight:700; color:var(--color-text-primary); display:flex; align-items:center; gap:var(--space-2); }
	.section-accent { width:3px; height:1.2em; background:#818cf8; border-radius:2px; }

	/* Title */
	.sdox-title { color:var(--color-text-primary); font-weight:800; line-height:1.2; }
	h1.sdox-title { font-size:var(--text-3xl); }
	h2.sdox-title { font-size:var(--text-2xl); }
	h3.sdox-title { font-size:var(--text-xl); }
	h4.sdox-title { font-size:var(--text-lg); }
	h5.sdox-title { font-size:var(--text-base); }
	h6.sdox-title { font-size:var(--text-sm); }

	/* Paragraph & Text */
	.sdox-paragraph { color:var(--color-text-secondary); line-height:1.8; white-space:pre-wrap; }
	.sdox-text { color:var(--color-text-secondary); }
	.sdox-inline-text { color:var(--color-text-primary); }
	.is-bold { font-weight:700; }
	.is-italic { font-style:italic; }
	.is-underline { text-decoration:underline; text-underline-offset:3px; }
	.is-strike { text-decoration:line-through; opacity:0.7; }

	/* Divider */
	.sdox-divider { display:flex; align-items:center; justify-content:center; gap:var(--space-4); margin:var(--space-6) 0; }
	.sdox-divider::before, .sdox-divider::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,var(--color-border),transparent); }
	.divider-diamond { color:var(--color-text-tertiary); font-size:8px; opacity:0.5; }

	/* Quote */
	.sdox-quote { display:flex; gap:var(--space-3); padding:var(--space-5); background:linear-gradient(135deg,rgba(167,139,250,0.06),rgba(167,139,250,0.02)); border:1px solid rgba(167,139,250,0.15); border-radius:var(--radius-lg); margin:var(--space-3) 0; position:relative; }
	.quote-mark { font-size:3rem; line-height:1; color:rgba(167,139,250,0.3); font-family:Georgia,serif; flex-shrink:0; margin-top:-4px; }
	.quote-body { flex:1; color:var(--color-text-secondary); font-style:italic; line-height:1.7; }
	.quote-body p { margin:0; }
	.quote-author { font-style:normal; font-weight:600; color:var(--color-text-primary); margin-top:var(--space-3); font-size:var(--text-sm); }

	/* Note */
	.sdox-note { display:flex; gap:var(--space-4); padding:var(--space-4); border-radius:var(--radius-lg); border:1px solid var(--color-border); margin:var(--space-2) 0; }
	.note-sidebar { display:flex; flex-direction:column; align-items:center; gap:var(--space-1); flex-shrink:0; }
	.note-icon { font-size:1.25rem; }
	.note-type { font-size:9px; text-transform:uppercase; letter-spacing:0.1em; font-weight:700; writing-mode:vertical-rl; opacity:0.5; }
	.note-body { flex:1; color:var(--color-text-primary); font-size:var(--text-sm); line-height:1.7; }
	.note-body p { margin:0; }
	.note-info { border-left:3px solid #60a5fa; background:rgba(96,165,250,0.05); }
	.note-warning { border-left:3px solid #fbbf24; background:rgba(251,191,36,0.05); }
	.note-danger { border-left:3px solid #f87171; background:rgba(248,113,113,0.05); }
	.note-success { border-left:3px solid #34d399; background:rgba(52,211,153,0.05); }

	/* List */
	.sdox-list { padding-left:var(--space-6); color:var(--color-text-secondary); display:flex; flex-direction:column; gap:var(--space-2); margin:var(--space-2) 0; }
	.list-unordered { list-style:disc; }
	.list-ordered { list-style:decimal; }
	.list-checklist { list-style:none; padding-left:0; }
	.sdox-item { display:flex; align-items:flex-start; gap:var(--space-2); line-height:1.7; }
	.sdox-item.done .item-text { text-decoration:line-through; opacity:0.5; }
	.check-box { width:18px; height:18px; border:2px solid var(--color-border); border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; margin-top:3px; transition:all 0.2s; }
	.check-box.checked { background:var(--color-success); border-color:var(--color-success); color:#fff; }

	/* URL */
	.sdox-url { color:var(--color-accent-primary); text-decoration:none; border-bottom:1px dashed rgba(56,189,248,0.3); padding-bottom:1px; transition:all 0.2s; display:inline-flex; align-items:center; gap:4px; }
	.sdox-url:hover { border-bottom-color:var(--color-accent-primary); }
	.link-icon { opacity:0.5; }

	/* Image */
	.sdox-figure { margin:var(--space-4) 0; }
	.img-frame { border:1px solid var(--color-border); border-radius:var(--radius-md); overflow:hidden; background:var(--color-bg-tertiary); }
	.img-frame img { display:block; max-width:100%; height:auto; }
	.sdox-figure figcaption { font-size:var(--text-xs); color:var(--color-text-tertiary); text-align:center; margin-top:var(--space-2); font-style:italic; }

	/* Code */
	.sdox-code-wrap { margin:var(--space-2) 0; }

	/* Output */
	.sdox-output { border-radius:var(--radius-md); overflow:hidden; border:1px solid rgba(52,211,153,0.15); margin:var(--space-2) 0; }
	.output-header { display:flex; align-items:center; gap:var(--space-3); padding:var(--space-2) var(--space-4); background:rgba(0,0,0,0.4); border-bottom:1px solid rgba(52,211,153,0.1); }
	.output-dots { display:flex; gap:5px; }
	.output-dots i { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.15); display:block; }
	.output-dots i:first-child { background:#f87171; }
	.output-dots i:nth-child(2) { background:#fbbf24; }
	.output-dots i:nth-child(3) { background:#34d399; }
	.output-label { font-size:var(--text-xs); font-family:var(--font-mono); color:var(--color-text-tertiary); margin-left:auto; }
	.output-body { padding:var(--space-4); font-family:var(--font-mono); font-size:var(--text-sm); line-height:1.7; color:#34d399; background:#0a0f14; margin:0; white-space:pre-wrap; }

	/* Table */
	.sdox-table-wrap { border:1px solid var(--color-border); border-radius:var(--radius-md); overflow:hidden; margin:var(--space-3) 0; }
	.sdox-table { width:100%; border-collapse:collapse; }
	.sdox-row { border-bottom:1px solid rgba(255,255,255,0.04); }
	.sdox-row:nth-child(even) { background:rgba(255,255,255,0.015); }
	.sdox-th { padding:var(--space-3) var(--space-4); text-align:left; font-weight:600; font-size:var(--text-sm); background:rgba(255,255,255,0.03); color:var(--color-text-primary); border-bottom:2px solid var(--color-border); }
	.sdox-td { padding:var(--space-3) var(--space-4); font-size:var(--text-sm); color:var(--color-text-secondary); }

	/* Card */
	.sdox-card { border:1px solid var(--color-border); border-radius:var(--radius-lg); overflow:hidden; margin:var(--space-3) 0; background:var(--color-bg-card); }
	.card-header { padding:var(--space-3) var(--space-4); border-bottom:1px solid var(--color-border); font-weight:600; font-size:var(--text-sm); display:flex; align-items:center; gap:var(--space-2); background:rgba(255,255,255,0.02); }
	.card-dot { width:8px; height:8px; border-radius:50%; background:var(--color-accent-primary); }
	.card-body { padding:var(--space-4); color:var(--color-text-secondary); font-size:var(--text-sm); line-height:1.7; }
	.card-body p { margin:0; }

	/* Tab */
	.sdox-tab { border:1px solid var(--color-border); border-radius:var(--radius-md); overflow:hidden; margin:var(--space-3) 0; }
	.tab-bar { display:flex; background:rgba(255,255,255,0.02); border-bottom:1px solid var(--color-border); }
	.tab-active { padding:var(--space-2) var(--space-4); font-size:var(--text-sm); font-weight:600; color:var(--color-accent-primary); border-bottom:2px solid var(--color-accent-primary); }
	.tab-content { padding:var(--space-4); }

	/* Accordion */
	.sdox-accordion { border:1px solid var(--color-border); border-radius:var(--radius-md); overflow:hidden; margin:var(--space-3) 0; }
	.accordion-toggle { width:100%; padding:var(--space-3) var(--space-4); background:rgba(255,255,255,0.02); border:none; color:var(--color-text-primary); font-size:var(--text-sm); font-weight:600; cursor:pointer; display:flex; align-items:center; gap:var(--space-2); font-family:var(--font-sans); }
	.accordion-toggle:hover { background:rgba(255,255,255,0.04); }
	.accordion-chevron { font-size:10px; transition:transform 0.2s; color:var(--color-text-tertiary); }
	.accordion-chevron.open { transform:rotate(90deg); }
	.accordion-body { padding:var(--space-4); border-top:1px solid var(--color-border); animation:fadeIn 0.2s; }

	/* Chips (include, use) */
	.sdox-chip { display:inline-flex; align-items:center; gap:var(--space-2); padding:var(--space-2) var(--space-3); border-radius:var(--radius-full); font-size:var(--text-sm); margin:var(--space-2) 0; }
	.sdox-chip code { font-family:var(--font-mono); font-size:var(--text-xs); }
	.chip-include { background:rgba(45,212,191,0.08); border:1px solid rgba(45,212,191,0.2); color:#2dd4bf; }
	.chip-use { background:rgba(45,212,191,0.08); border:1px solid rgba(45,212,191,0.2); color:#2dd4bf; }

	/* Template */
	.sdox-template { border:2px dashed rgba(45,212,191,0.25); border-radius:var(--radius-md); margin:var(--space-3) 0; }
	.template-header { padding:var(--space-2) var(--space-4); background:rgba(45,212,191,0.05); font-size:var(--text-sm); font-weight:600; color:#2dd4bf; border-bottom:1px dashed rgba(45,212,191,0.15); }
	.template-header code { font-family:var(--font-mono); }
	.template-body { padding:var(--space-4); }

	/* AI blocks (instruction, response, example) */
	.sdox-instruction { border:1px solid rgba(251,191,36,0.2); border-radius:var(--radius-lg); overflow:hidden; margin:var(--space-3) 0; background:rgba(251,191,36,0.03); }
	.sdox-response { border:1px solid rgba(52,211,153,0.2); border-radius:var(--radius-lg); overflow:hidden; margin:var(--space-3) 0; background:rgba(52,211,153,0.03); }
	.sdox-example { border:1px solid rgba(251,191,36,0.15); border-radius:var(--radius-lg); overflow:hidden; margin:var(--space-3) 0; background:rgba(251,191,36,0.02); }
	.sdox-metadata { border:1px solid rgba(148,163,184,0.2); border-radius:var(--radius-lg); overflow:hidden; margin:var(--space-3) 0; }
	.sdox-ai-block { border:1px solid color-mix(in srgb, var(--ai-color) 20%, transparent); border-radius:var(--radius-lg); overflow:hidden; margin:var(--space-3) 0; background:color-mix(in srgb, var(--ai-color) 3%, transparent); }

	.ai-header { display:flex; align-items:center; gap:var(--space-2); padding:var(--space-2) var(--space-4); background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.04); }
	.ai-icon { font-size:1rem; }
	.ai-label { font-size:var(--text-xs); font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-text-secondary); }
	.ai-body { padding:var(--space-4); color:var(--color-text-secondary); font-size:var(--text-sm); line-height:1.7; }
	.ai-body p { margin:0; }
	.model-badge, .priority-badge { font-size:10px; padding:2px 8px; border-radius:var(--radius-full); font-weight:600; font-family:var(--font-mono); }
	.model-badge { background:rgba(56,189,248,0.1); color:var(--color-accent-primary); border:1px solid rgba(56,189,248,0.15); }
	.example-code { padding:var(--space-4); font-family:var(--font-mono); font-size:var(--text-sm); color:var(--color-text-code); background:rgba(0,0,0,0.2); margin:0; white-space:pre-wrap; line-height:1.7; }

	/* Metadata grid */
	.metadata-grid { display:grid; grid-template-columns:auto 1fr; border-top:1px solid var(--color-border); }
	.meta-key { padding:var(--space-2) var(--space-4); font-size:var(--text-xs); font-weight:600; color:var(--color-text-tertiary); text-transform:uppercase; letter-spacing:0.05em; background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.03); border-right:1px solid rgba(255,255,255,0.03); }
	.meta-val { padding:var(--space-2) var(--space-4); font-size:var(--text-sm); color:var(--color-text-primary); border-bottom:1px solid rgba(255,255,255,0.03); }

	/* Unknown */
	.sdox-unknown { padding:var(--space-3); border:1px dashed var(--color-border); border-radius:var(--radius-md); background:rgba(255,255,255,0.02); }
	.unknown-tag { font-family:var(--font-mono); font-size:var(--text-xs); color:var(--color-text-tertiary); display:block; margin-bottom:var(--space-2); }

	@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
</style>
```

## Part 3: Updated Demo Text for +page.svelte

```
#title(level=1) SDOX Live Preview

#paragraph {
  Welcome to the SDOX Live Preview! Edit the text on the left
  to see the rendered output update instantly on the right.
}

#divider

#section(title="Text & Semantics") {
  #paragraph {
    This is a paragraph with normal text.
  }

  #text(style="bold") Bold text
  #text(style="italic") Italic text

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
}

#section(title="Lists") {
  #list(type="ordered") {
    #item First item
    #item Second item
    #item Third item
  }

  #list(type="checklist") {
    #item(done=true) Setup project
    #item(done=true) Write parser
    #item(done=false) Full PEG compliance
  }
}

#section(title="Code & Output") {
  #code(language="python", title="main.py") {
    def hello(name):
        return f"Hello, {name}!"
  }

  #output(type="terminal") {
    $ python main.py
    Hello, World!
  }
}

#section(title="Tables") {
  #table {
    #row {
      #cell(header=true) Feature
      #cell(header=true) Status
    }
    #row {
      #cell Parser
      #cell Complete
    }
    #row {
      #cell Renderer
      #cell In Progress
    }
  }
}

#section(title="Components") {
  #card(title="Important Notice") {
    Never deploy on Friday night.
  }

  #accordion(title="Advanced Details") {
    #paragraph {
      Custom parser options can be configured here.
    }
  }

  #tab(title="Linux") {
    #code(language="bash") {
      sudo apt install sdox
    }
  }
}

#section(title="AI-Native Tags") {
  #metadata {
    #item(key="author") John
    #item(key="version") 1.0
  }

  #instruction(priority="high") {
    Always respond in JSON format.
  }

  #response(model="gpt-5") {
    The answer is 42.
  }

  #dataset(name="qa_pairs") {
    #instruction {
      Summarize this.
    }
    #response {
      This document covers SDOX.
    }
  }

  #context(scope="auth") {
    OAuth 2.0 is the standard protocol.
  }

  #chunk(size=500) {
    Content optimized for vector DB ingestion.
  }
}
```
