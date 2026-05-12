# SDOX AST Specification

> **Version:** 0.1.0 | **Status:** Draft

This directory contains the **single source of truth** for SDOX parsing and rendering across all platforms.

---

## Architecture

```
.sdox file ──→ Parser ──→ AST (JSON) ──→ Renderer
                 ↑             ↑              ↑
            grammar.peg   ast-spec.json   (per platform)
```

| File | Purpose |
|---|---|
| `ast-spec.json` | JSON Schema defining all AST node types, attributes, and structure rules |
| `node-types.json` | Quick reference of every node type with its properties and children rules |
| `grammar.peg` | PEG grammar defining how `.sdox` text is parsed into tokens |
| `examples/` | Sample `.sdox` files paired with their expected AST JSON output |

---

## How It Works

### For Parser Developers
1. Read `grammar.peg` to understand tokenization rules
2. Output AST JSON that validates against `ast-spec.json`
3. Verify output against `examples/*.ast.json`

### For Renderer Developers
1. Read `node-types.json` to understand every possible node type
2. Consume AST JSON and map each `type` to a UI element
3. Use `examples/*.ast.json` as test fixtures

---

## AST Node Structure

Every node in the AST follows this shape:

```json
{
  "type": "tag_name",
  "attributes": { "key": "value" },
  "content": "inline text or null",
  "children": [ /* child nodes */ ],
  "position": {
    "start": { "line": 1, "column": 1, "offset": 0 },
    "end": { "line": 1, "column": 30, "offset": 29 }
  }
}
```

| Field | Type | Description |
|---|---|---|
| `type` | `string` | Node type name (matches SDOX tag name, or `document` / `plain_text`) |
| `attributes` | `object` | Key-value pairs from tag attributes. Values are `string`, `number`, or `boolean` |
| `content` | `string \| null` | Text content for inline/leaf nodes. `null` for block-only nodes |
| `children` | `array` | Child AST nodes. Empty array for leaf nodes |
| `position` | `object` | Source location for error reporting and tooling |

---

## Node Categories

| Category | Nodes | Has Children | Has Content |
|---|---|---|---|
| Root | `document` | ✅ | ❌ |
| Structure | `title`, `paragraph`, `section`, `divider` | varies | varies |
| Text | `text`, `quote`, `note`, `plain_text` | varies | varies |
| Lists | `list`, `item` | varies | varies |
| Links & Media | `url`, `image` | ❌ | varies |
| Code | `code`, `output` | ❌ | ✅ |
| Tables | `table`, `row`, `cell` | ✅ | varies |
| Components | `card`, `tab`, `accordion` | ✅ | ❌ |
| Modularization | `include`, `template`, `use` | varies | ❌ |
| AI-Native | `metadata`, `dataset`, `example`, `instruction`, `response`, `embedding`, `chunk`, `context`, `completion` | varies | varies |

---

## Validation

Any AST output can be validated against `ast-spec.json` using standard JSON Schema validators:

```bash
# Node.js (ajv)
npx ajv validate -s ast-spec.json -d output.ast.json

# Python (jsonschema)
python -m jsonschema -i output.ast.json ast-spec.json
```

---

## Examples

See the `examples/` directory for paired `.sdox` → `.ast.json` files:

- `hello.sdox` / `hello.ast.json` — Minimal example
- `full.sdox` / `full.ast.json` — Comprehensive example covering all tag categories
