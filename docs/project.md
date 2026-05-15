# Scalable Document (SDOX)

## Initial Specification Draft

Version: `0.2.0`
Status: Draft

---

# Overview

Scalable Document (Extra Large Markdown) is a structured, semantic, AI-friendly document language inspired by Markdown.

The primary goals of Scalable Document are:

* Human-readable raw text
* Deterministic parsing
* Modular document structure
* Consistent syntax
* AI-friendly semantic representation
* Dataset-friendly formatting
* Extensible document architecture
* Minimal syntax ambiguity

Scalable Document is designed as a structured document language rather than a simple Markdown extension.

---

# File Extension

Recommended extension:

```txt
.sdox
```

Examples:

```txt
README.sdox
specification.sdox
architecture.sdox
```

---

# Core Philosophy

Scalable Document follows several core principles:

## 1. Consistency

All document elements use the same syntax model.

Example:

```xldm
#title(level=1)
#paragraph
#list
#code
```

---

## 2. Semantic Structure

Elements should describe meaning rather than visual appearance.

Preferred:

```xldm
#warning
#note
#quote
```

Avoid:

```xldm
#redText
#bigTitle
```

---

## 3. Deterministic Parsing

Documents should always produce a predictable AST.

The parser should:

* Avoid ambiguous interpretation
* Preserve content integrity
* Support formatter tooling
* Support AI processing

---

## 4. Human Readability

Raw `.sdox` files should remain readable in plain text editors.

---

## 5. Extensibility

All tags may support optional attributes.

Example:

```xldm
#title(level=1)
#code(language="python")
```

---

# Syntax Model

## Tag Syntax

All elements begin with a `#tag` syntax.

General form:

```xldm
#tag(attribute=value)
```

---

## Inline Form

Single-line content:

```xldm
#title(level=1) Scalable Document Introduction
```

---

## Block Form

Multi-line content:

```xldm
#quote {
  Lorem ipsum dolor sit amet
}
```

---

# Attribute Rules

## Rules

* Attribute names must use lowercase
* Snake case is recommended
* Attributes must be explicit
* Avoid shorthand naming

Preferred:

```xldm
language="python"
line_number=true
```

Avoid:

```xldm
lang="py"
ln=true
```

---

# Core Tags

## Structure Tags

### title

```xldm
#title(level=1) Introduction
```

Attributes:

* `level`
* `id`

---

### paragraph

```xldm
#paragraph {
  Lorem ipsum dolor sit amet.
}
```

---

### section

```xldm
#section(title="Authentication") {
}
```

Attributes:

* `title`
* `id`

---

### divider

```xldm
#divider
```

---

# Text Semantic Tags

## text

```xldm
#text(style="bold") Hello
```

Attributes:

* `style`
* `color`
* `size`

---

## quote

```xldm
#quote(author="John") {
  Lorem ipsum dolor sit amet.
}
```

Attributes:

* `author`

---

## note

```xldm
#note(type="warning") {
  Never expose API keys.
}
```

Recommended types:

* `info`
* `warning`
* `danger`
* `success`

---

# List Tags

## list

```xldm
#list(type="unordered") {
  #item First
  #item Second
}
```

Attributes:

* `type`

  * `unordered`
  * `ordered`
  * `checklist`

---

## item

```xldm
#item(done=true) Finish specification
```

Attributes:

* `done`

---

# Link and Media Tags

## url

```xldm
#url(href="https://example.com") Example
```

Attributes:

* `href`
* `title`
* `target`

---

## image

```xldm
#image(
  src="cover.png",
  alt="Cover Image",
  width=500
)
```

Attributes:

* `src`
* `alt`
* `width`
* `height`

---

# Code Tags

## code

```xldm
#code(language="python") {
  print("hello")
}
```

Recommended attributes:

* `language`
* `title`
* `line_number`
* `highlight`
* `foldable`
* `editable`
* `runnable`
* `theme`

Example:

```xldm
#code(
  language="python",
  title="main.py",
  line_number=true,
  highlight="2,5"
) {
  def hello():
      print("hello")
}
```

---

## output

```xldm
#output(type="terminal") {
  build success
}
```

Attributes:

* `type`

Recommended types:

* `terminal`
* `json`
* `text`
* `html`

---

# Table Tags

## table

```xldm
#table {
  #row {
    #cell(header=true) Name
    #cell(header=true) Age
  }

  #row {
    #cell John
    #cell 25
  }
}
```

---

## row

```xldm
#row {
}
```

---

## cell

```xldm
#cell(header=true) Name
```

Attributes:

* `header`

---

# Component and Layout Tags

## card

```xldm
#card(title="Warning") {
  Never deploy on Friday night.
}
```

Attributes:

* `title`
* `type`

---

## tab

```xldm
#tab(title="Linux") {
}
```

Attributes:

* `title`

---

## accordion

```xldm
#accordion(title="Details") {
}
```

Attributes:

* `title`

---

# Modularization Tags

## include

```xldm
#include(src="./auth.xldm")
```

Attributes:

* `src`

---

## template

```xldm
#template(name="warning_card") {
}
```

Attributes:

* `name`

---

## use

```xldm
#use(template="warning_card")
```

Attributes:

* `template`

---

# AI-Native Tags

## metadata

```xldm
#metadata {
  #item(key="author") John
  #item(key="version") 1.0
}
```

---

## dataset

```xldm
#dataset(name="instruction") {
}
```

Attributes:

* `name`

---

## example

```xldm
#example(language="python") {
}
```

Attributes:

* `language`

---

## instruction

```xldm
#instruction(priority="high") {
}
```

Attributes:

* `priority`

---

## response

```xldm
#response(model="gpt-5") {
}
```

Attributes:

* `model`

---

## embedding

```xldm
#embedding(model="text-embedding-3")
```

Attributes:

* `model`

---

## chunk

```xldm
#chunk(size=500) {
}
```

Attributes:

* `size`

---

## context

```xldm
#context(scope="authentication") {
}
```

Attributes:

* `scope`

---

## completion

```xldm
#completion(model="gpt-5") {
}
```

Attributes:

* `model`

---

# Visualization Tags

## chart

```xldm
#chart(type="bar", title="Monthly Sales") {
  #data(label="Jan", value=100)
}
```

---

# Mathematics Tags

## math

```xldm
#math {
  \int_{a}^{b} f(x) dx
}
```

---

# Diagram Tags

## diagram

```xldm
#diagram(type="flowchart") {
  graph TD;
    A-->B;
}
```

## timeline

```xldm
#timeline {
  #event(date="2024-01-01") Launch
}
```

---

# Navigation & Layout Tags

## toc

```xldm
#toc
```

## grid

```xldm
#grid(columns=2) {
  #column { ... }
  #column { ... }
}
```

---

# Documentation Tags

## term & definition

```xldm
#term(id="sdox") Scalable Document
#definition(for="sdox") A semantic document language.
```

---

# Naming Conventions

## Recommended Rules

* Use lowercase tags
* Use singular names
* Avoid aliases
* Avoid shorthand syntax
* Prefer semantic naming

Preferred:

```xldm
#image
#url
#paragraph
```

Avoid:

```xldm
#img
#link
#p
```

---

# Parser Principles

The Scalable Document parser should:

* Produce deterministic AST output
* Preserve code block content exactly
* Avoid automatic mutation
* Support formatter tooling
* Support AI chunking and semantic extraction

---

# Formatting Principles

Recommended future tooling:

```bash
xldm fmt
```

Formatting should be:

* deterministic
* stable
* idempotent
* predictable

---

# Versioning

Scalable Document follows Semantic Versioning.

Format:

```txt
MAJOR.MINOR.PATCH
```

Examples:

```txt
0.1.0
0.2.0
1.0.0
```

---

# Project Identity

Project name:

```txt
Scalable Document
```

Short name:

```txt
SDOX
```

Primary goals:

* Scalable document architecture
* Semantic structured content
* AI-friendly dataset format
* Extensible tag-based syntax
* Deterministic parsing
* Modular documentation system
* Human-readable raw text

Core concept:

```txt
Everything is a semantic tag.
```

Example:

```sdox
#title(level=1) Introduction

#paragraph {
  Scalable Document is a semantic document language.
}

#code(language="python") {
  print("hello")
}
```

---

# Current Version Recommendation

Recommended initial version:

```txt
0.2.0
```

Reason:

* Project is still experimental
* Syntax is not stable yet
* Specification is incomplete
* Breaking changes are expected

---

# Future Stable Milestone

Recommended stable release target:

```txt
1.0.0
```

Criteria:

* Stable syntax
* Stable parser rules
* Stable AST model
* Formatter implementation
* Reference renderer
* Language specification finalized

---

# Long-Term Vision

Scalable Document aims to become:

* A semantic structured document language
* A modern AI-friendly documentation format
* A deterministic markdown alternative
* A composable document system
* A modular dataset representation format
* A readable structured text standard
