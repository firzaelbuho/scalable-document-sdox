# SDOX Tool — VS Code Extension

**Syntax highlighting, IntelliSense, and Live Preview** for [Scalable Document (SDOX)](https://github.com/firzaelbuho/scalable-document-sdox) — a structured, semantic, AI-friendly document language.

## Features

### 🎨 Syntax Highlighting

Rich, category-aware colorization for all SDOX tags:

- **Structure** — `#title`, `#paragraph`, `#section`, `#divider`
- **Text & Semantics** — `#text`, `#quote`, `#note`
- **Lists** — `#list`, `#item`
- **Links & Media** — `#url`, `#image`
- **Code** — `#code`, `#output`
- **Tables** — `#table`, `#row`, `#cell`
- **Components** — `#card`, `#tab`, `#accordion`
- **Modularization** — `#include`, `#template`, `#use`
- **AI-Native** — `#metadata`, `#dataset`, `#instruction`, `#response`, `#example`, `#embedding`, `#chunk`, `#context`, `#completion`

### 🧠 IntelliSense

Smart auto-completion powered by the SDOX v0.1.0 tag schema:

- Type `#` to see all available tags with descriptions
- Type `(` after a tag to get attribute suggestions
- Type `=` to get enum and boolean value options
- Snippets with smart tabstops for quick tag insertion

### 📖 Hover Documentation

Hover over any `#tag` to see:

- Full description
- Attributes table (name, type, required, description)
- Code example

### 👁️ Live Preview

Side-by-side rendered preview of your SDOX documents:

- Click the **preview icon** in the editor title bar
- Or use keyboard shortcuts:
  - `Ctrl+Shift+V` — Open preview
  - `Ctrl+K V` — Open preview to the side
- Real-time updates as you type (300ms debounce)
- Premium dark theme with semantic styling

## Usage

1. Create or open a `.sdox` file
2. Start typing `#` to get IntelliSense suggestions
3. Click the preview button (or `Ctrl+K V`) to see the live preview

### Example SDOX Document

```sdox
#title(level=1) Hello SDOX

#paragraph {
  Scalable Document is a structured, semantic,
  AI-friendly document language.
}

#code(language="python") {
  print("hello, sdox!")
}

#note(type="info") {
  SDOX supports all common text encodings.
}
```

## Supported File Extensions

- `.sdox`

## Requirements

- VS Code 1.80.0 or higher

## Release Notes

### 0.1.0

- Initial release
- Syntax highlighting for all SDOX v0.1.0 tags
- IntelliSense with tag, attribute, and value completions
- Hover documentation
- Live Preview panel

## License

MIT
