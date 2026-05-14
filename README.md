<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/status-Draft-orange?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
</p>

# Scalable Document (SDOX)

**A semantic, structured, and AI-friendly document language — built as a modern alternative to Markdown.**

🌐 **Official Website & Live Preview:** [https://sdox-dev.vercel.app](https://sdox-dev.vercel.app)

SDOX rethinks how documents should be written. Instead of relying on fragile symbols and ambiguous syntax, every element is a **semantic tag** — consistent, predictable, and machine-readable by design.

```sdox
#title(level=1) Getting Started

#paragraph {
  Scalable Document is a structured document language
  designed for humans and machines alike.
}

#code(language="python", line_number=true) {
  print("hello, sdox!")
}
```

---

## ✨ Why SDOX?

| Feature | Markdown | SDOX |
|---|---|---|
| Consistent syntax | ❌ Mixed symbols | ✅ Uniform `#tag` model |
| Deterministic parsing | ❌ Ambiguous edge cases | ✅ Predictable AST output |
| Semantic meaning | ❌ Visual-oriented | ✅ Meaning-first approach |
| AI & dataset support | ❌ Not designed for AI | ✅ Native AI/dataset tags |
| Modular documents | ❌ Single-file only | ✅ `#include`, `#template`, `#use` |
| Extensibility | ❌ Limited | ✅ Custom attributes on any tag |

---

## 🧠 Core Philosophy

- **Everything is a semantic tag** — No special symbols. `#title`, `#paragraph`, `#code`, `#list` — all follow the same syntax model.
- **Meaning over appearance** — Use `#warning` and `#note`, not `#redText` and `#bigTitle`.
- **Deterministic by design** — The same input always produces the same AST. No surprises.
- **Human-readable raw text** — `.sdox` files are clean and readable in any plain text editor.
- **Built for AI** — Native support for datasets, embeddings, chunking, and context scoping.

---

## 📐 Syntax at a Glance

### Inline Form
```sdox
#title(level=1) Introduction to SDOX
```

### Block Form
```sdox
#quote(author="Alan Turing") {
  We can only see a short distance ahead,
  but we can see plenty there that needs to be done.
}
```

### Attributes
```sdox
#code(language="python", title="main.py", line_number=true, highlight="3,7") {
  def greet(name):
      return f"Hello, {name}!"
}
```

---

## 🏷️ Tag Categories

### 📄 Structure
`#title` · `#paragraph` · `#section` · `#divider`

### ✏️ Text & Semantics
`#text` · `#quote` · `#note`

### 📋 Lists
`#list` · `#item` — supports `unordered`, `ordered`, and `checklist` types

### 🔗 Links & Media
`#url` · `#image`

### 💻 Code
`#code` · `#output` — with language highlighting, line numbers, foldable blocks, and more

### 📊 Tables
`#table` · `#row` · `#cell`

### 🧩 Components & Layout
`#card` · `#tab` · `#accordion`

### 📦 Modularization
`#include` · `#template` · `#use` — compose documents from reusable parts

### 🤖 AI-Native
`#metadata` · `#dataset` · `#example` · `#instruction` · `#response` · `#embedding` · `#chunk` · `#context` · `#completion`

---

## 🤖 AI-Native Tags

What makes SDOX truly different: **first-class support for AI workflows**.

```sdox
#dataset(name="qa_pairs") {
  #instruction(priority="high") {
    Summarize the following document in three bullet points.
  }

  #context(scope="authentication") {
    OAuth 2.0 is the industry standard protocol for authorization.
  }

  #response(model="gpt-5") {
    - OAuth 2.0 provides secure delegated access
    - Supports multiple grant types
    - Industry-wide adoption
  }
}

#chunk(size=500) {
  Content optimized for vector database ingestion...
}

#embedding(model="text-embedding-3")
```

---

## 📦 Modular Documents

Break large documents into composable, reusable modules:

```sdox
#template(name="api_endpoint") {
  #title(level=3) Endpoint
  #code(language="bash") {
    curl -X GET /api/resource
  }
}

#include(src="./authentication.sdox")
#use(template="api_endpoint")
```

---

## 🗂️ File Extension

```
.sdox
```

```
README.sdox
specification.sdox
architecture.sdox
```

---

## 🗺️ Roadmap

- [x] Initial specification draft (`v0.1.0`)
- [ ] Reference parser implementation
- [ ] Formatter CLI (`sdox fmt`)
- [ ] VS Code / editor extension
- [ ] AST specification
- [ ] Renderer (HTML, PDF)
- [ ] Plugin system for custom tags
- [ ] `v1.0.0` stable release

### Stable Release Criteria (`v1.0.0`)

| Milestone | Status |
|---|---|
| Stable syntax | 🔜 In Progress |
| Stable parser rules | 🔜 Planned |
| Stable AST model | 🔜 Planned |
| Formatter implementation | 🔜 Planned |
| Reference renderer | 🔜 Planned |
| Language specification finalized | 🔜 Planned |

---

## 🤝 Contributing

SDOX is currently in **early development**. The syntax is not yet stable and breaking changes are expected.

If you're interested in contributing — whether it's parser development, tooling, renderer implementations, or specification feedback — contributions and discussions are welcome!

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <strong>SDOX</strong> — <em>Everything is a semantic tag.</em>
</p>