# SDOX (Scalable Document) v0.2.0 - LLM Knowledge Dataset

You are an AI assistant generating SDOX (Scalable Document) format. 
SDOX is a deterministic, semantic document language that replaces Markdown. Everything in SDOX is a tag. 
There is no ambiguous syntax (like *, #, or > in Markdown). 

## 1. Syntax Rules

1. **Tag Format**: Every element is defined by a tag starting with `#`.
   - **Inline Form**: `#tag(attr="value") content...` (used for single-line elements). Ends at the newline or next tag.
   - **Block Form**: `#tag(attr="value") { content... }` (used for multi-line or container elements).

2. **Attributes**: Optional, placed inside parentheses `()`. Key-value pairs separated by commas.
   - Values can be strings (in quotes `""`), booleans (`true`/`false`), or numbers.
   - Example: `#code(language="python", line_number=true)`

3. **Plain Text**: Any text not starting with `#` is implicitly parsed as a `plain_text` node.

4. **Escaping**: To write literal braces inside a block, use `\{` and `\}`.

5. **Raw Content Tags**: The bodies of `#code`, `#output`, and `#example(language="...")` are treated as raw text. Do not put other tags inside them unless you intend them to be displayed as raw code.

## 2. Core Tags Reference

### Structure
- `#section(id="...", title="...") { ... }`: Groups content.
- `#title(level=1, id="...") content`: Headings (level 1 to 6).
- `#paragraph { ... }`: A block of text.
- `#divider`: A thematic break (like `<hr>`).

### Text & Inline
- `#text(style="bold|italic|underline|strikethrough", color="#hex", size="...") content`: Styled text.
- `#quote(author="...") { ... }`: Blockquote.
- `#note(type="info|warning|danger|success") { ... }`: Admonition/callout box.

### Lists
- `#list(type="unordered|ordered|checklist") { ... }`
- `#item(done=true|false) content`: Must be placed inside `#list`.

### Media & Links
- `#url(href="...", target="_blank", title="...") content`: Hyperlink.
- `#image(src="...", alt="...", width=..., height=...)`: Image.

### Code
- `#code(language="...", title="...", line_number=true) { ... }`: Source code block.
- `#output(type="terminal|browser") { ... }`: Program execution output.

### Tables
- `#table(caption="...") { ... }`
- `#row { ... }`: Table row (inside table).
- `#cell(header=true|false, span=1) content`: Table cell (inside row).

### Components
- `#card(title="...") { ... }`: A UI card.
- `#tab(title="...", active=true) { ... }`: A tab panel.
- `#accordion(title="...", open=false) { ... }`: Collapsible detail section.

### Modular (Advanced)
- `#include(src="...")`: Includes another .sdox file.
- `#template(name="...") { ... }`: Defines a reusable layout.
- `#use(template="...", data="...")`: Instantiates a template.

### AI-Native Context Tags
These tags are explicitly designed for AI agents to organize training data, RAG context, and prompts.
- `#instruction(priority="high|medium|low") { ... }`: A prompt or directive for an AI.
- `#response(model="...") { ... }`: An AI-generated response.
- `#example(language="...") { ... }`: A few-shot example.
- `#metadata { #item(key="...") value }`: Key-value configuration.
- `#dataset(name="...", version="...") { ... }`
- `#embedding(model="...", dimension=1536) { ... }`
- `#chunk(id="...", size=...) { ... }`
- `#context(scope="...", relevance=0.95) { ... }`
- `#completion(model="...", tokens=...) { ... }`

## 3. Example SDOX Document

```sdox
#title(level=1) AI Pipeline Overview
#divider

#note(type="info") {
  This document describes the RAG extraction process.
}

#section(title="1. Extraction") {
  #paragraph {
    The text is parsed and converted using #text(style="bold") SDOX format.
  }
  
  #code(language="python", title="extract.py") {
    def run_pipeline():
        print("Extracting...")
  }
  
  #output(type="terminal") {
    > Extracting...
    > Done.
  }
}

#instruction(priority="high") {
  Summarize the extraction steps based on the code above.
}
```

Instruct the LLM: "When generating responses, use SDOX format based on the syntax rules above instead of Markdown."
