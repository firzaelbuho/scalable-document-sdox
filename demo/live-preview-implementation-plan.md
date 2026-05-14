# SDOX Live Preview — Full Rebuild Plan

## Goal

Rebuild the `/live-preview` page so that **every SDOX tag** from `docs/tags/0.1.0.json` is rendered with a **unique, semantically correct visual** — not generic boxes. The design must be consistent (one dark-theme design language) but each tag must be visually distinguishable and functionally appropriate.

---

## Current State & Problems

The current `SdoxRenderer.svelte` has **13 tag handlers** but many tags fall into the generic `{:else}` fallback (dashed border box with `#tagname` label). Missing or generic:

| Tag | Current State |
|-----|--------------|
| `text` | ❌ Missing — falls to generic |
| `output` | ❌ Missing — falls to generic |
| `card` | ❌ Missing — falls to generic |
| `tab` | ❌ Missing — falls to generic |
| `accordion` | ❌ Missing — falls to generic |
| `include` | ❌ Missing — falls to generic |
| `template` | ❌ Missing — falls to generic |
| `use` | ❌ Missing — falls to generic |
| `instruction` | ❌ Missing — falls to generic |
| `response` | ❌ Missing — falls to generic |
| `example` | ❌ Missing — falls to generic |
| `metadata` | ❌ Missing — falls to generic |
| `dataset` | ❌ Missing — falls to generic |
| `embedding` | ❌ Missing — falls to generic |
| `chunk` | ❌ Missing — falls to generic |
| `context` | ❌ Missing — falls to generic |
| `completion` | ❌ Missing — falls to generic |
| `quote` | ⚠️ Exists but basic — just a left border |
| `table/row/cell` | ⚠️ Exists but minimal styling |
| `note` | ⚠️ Exists but no visual distinction per type |
| `image` | ⚠️ Exists but no figure/caption |
| `divider` | ⚠️ Exists but plain `<hr>` |

---

## Proposed Changes

### File Overview

| File | Action |
|------|--------|
| `src/lib/components/preview/SdoxRenderer.svelte` | **REWRITE** — full tag coverage + rich styles |
| `src/routes/live-preview/+page.svelte` | **UPDATE** — improved demo content showcasing all tags |

> **Note**: The parser (`sdoxParser.ts`) and `CodeBlock.svelte` are already working correctly and will **not** be modified.

---

### SdoxRenderer.svelte — Complete Rewrite

Complete rewrite with all 28 tags handled individually. Each tag gets:
- Unique HTML structure matching its semantic purpose
- Dedicated CSS class with distinctive styling
- Consistent color palette from the design system

#### Tag-by-Tag Visual Design

---

##### 📄 Structure Category

**`document`** — Transparent flex container with vertical gap. No visible chrome.

**`title`** — Dynamic `<h1>`–`<h6>` with gradient accent underline on `h1`/`h2`. Uses `svelte:element` for dynamic heading level.

**`paragraph`** — Clean body text with relaxed line height, secondary text color. Supports inline children.

**`section`** — Grouped container with subtle left accent border and section title styled as small-caps label.

**`divider`** — Centered decorative divider: thin horizontal line with a diamond `◆` symbol in the middle.

---

##### ✏️ Text & Semantics Category

**`text`** — Inline `<span>` with conditional classes for `bold`, `italic`, `underline`, `strikethrough`. Supports `color` and `size` attributes via inline style.

**`quote`** — Blockquote with:
  - Large decorative open-quote mark `"` (oversized, accent-colored, semi-transparent)
  - Italic body text
  - Author attribution right-aligned with em-dash prefix
  - Left gradient border (cyan → teal)
  - Subtle background tint

**`note`** — Callout box with 4 distinct variants:
  - `info` — Blue left border, `ℹ️` icon, blue tint background
  - `warning` — Amber left border, `⚠️` icon, amber tint background
  - `danger` — Red left border, `🛑` icon, red tint background
  - `success` — Green left border, `✅` icon, green tint background
  - Each has a type label pill in the header

---

##### 📋 Lists Category

**`list`** — Three distinct visual modes:
  - `unordered` — Custom bullet markers (small cyan dots)
  - `ordered` — Counter-based numbering with accent-colored numbers
  - `checklist` — Custom checkbox styling (rounded checkbox with check mark, green when done, strikethrough text when done)

**`item`** — List item with proper alignment. `done` attribute triggers visual completion state.

---

##### 🔗 Links & Media Category

**`url`** — Inline link with accent color, underline on hover, and small external-link SVG icon appended.

**`image`** — `<figure>` with:
  - Rounded frame with subtle border
  - Hover zoom effect (slight scale)
  - `<figcaption>` from `alt` attribute displayed below

---

##### 💻 Code Category

**`code`** — Delegates to existing `CodeBlock.svelte` component (already well-styled).

**`output`** — Terminal-style output block:
  - Dark background with green-tinted header
  - Three colored dots (red/yellow/green) mimicking a terminal window
  - Type label (`terminal`, `json`, `text`, `html`)
  - Monospace `<pre>` body with slightly green-tinted text

---

##### 📊 Tables Category

**`table`** — Responsive wrapper with horizontal scroll, rounded corners, border.

**`row`** — Table row with hover highlight effect and alternating subtle background.

**`cell`** — Standard cell with padding. Header cells (`header=true`) get:
  - Bold text
  - Darker background
  - Uppercase small-caps styling
  - Accent bottom border

---

##### 🧩 Components & Layout Category

**`card`** — Elevated card with:
  - Glass-morphism background
  - Header bar with colored dot indicator + title
  - Content body with padding
  - Subtle glow on hover

**`tab`** — Tabbed panel with:
  - Tab bar with active tab indicator (bottom accent border)
  - Content area below
  - Single tab rendered since we see one `#tab` at a time

**`accordion`** — Collapsible section with:
  - Toggle button with rotating chevron `▶` → `▼`
  - Animated slide-down reveal
  - Svelte `$state` for open/close toggle

---

##### 📦 Modularization Category

**`include`** — Compact inline chip: `📎` icon + file path in monospace. Teal-themed border.

**`template`** — Dashed-border container with:
  - Header: `📐 Template:` + name badge
  - Body renders children

**`use`** — Compact inline chip: `⚡` icon + template name. Purple-themed border.

---

##### 🤖 AI-Native Category

All AI tags share a consistent "AI block" structure but each has a **unique accent color and icon**:

| Tag | Icon | Color | Description |
|-----|------|-------|-------------|
| `metadata` | 📋 | Slate `#94a3b8` | Key-value grid layout |
| `dataset` | 📊 | Purple `#a78bfa` | Named dataset container |
| `example` | 💡 | Amber `#fbbf24` | Code example with language badge |
| `instruction` | 📝 | Rose `#fb7185` | Instruction with priority badge |
| `response` | 🤖 | Emerald `#34d399` | AI response with model badge |
| `embedding` | 🧬 | Teal `#2dd4bf` | Compact embed marker |
| `chunk` | 🧩 | Orange `#fb923c` | Chunk size container |
| `context` | 🎯 | Sky `#38bdf8` | Context scope container |
| `completion` | ✨ | Pink `#f472b6` | Completion placeholder |

**AI Block structure:**
```
┌─ ai-header ─────────────────────────┐
│ [icon] [Label]          [badge(s)]  │
├─────────────────────────────────────┤
│ ai-body (children or content)       │
└─────────────────────────────────────┘
```
- Left colored accent border using `--ai-color` CSS variable
- Semi-transparent tinted background
- Badges for attributes (`priority`, `model`, `name`, `scope`, `size`)

**`metadata`** is special — renders children as a **2-column key-value grid** instead of prose.

**`instruction`** has a **priority badge** with color coding: `high` = red, `medium` = amber, `low` = blue.

---

### +page.svelte — Demo Content Update

Update the default SDOX demo text to **showcase every tag** so users can immediately see all renderers in action. The demo will be organized into sections by category.

---

## Verification Plan

### Automated Tests
1. Run `bun run dev` and navigate to `http://localhost:5173/live-preview`
2. Use browser subagent to visually verify all tags render correctly

### Manual Verification
- Verify every tag from the 0.1.0 schema has a unique, non-generic visual
- Verify accordion toggle works (click to expand/collapse)
- Verify code copy button works
- Verify responsive layout (editor + preview side by side on desktop, stacked on mobile)
- Check no tags fall through to the generic `{:else}` fallback
