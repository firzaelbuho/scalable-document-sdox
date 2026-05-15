# Changelog

All notable changes to the **Scalable Document (SDOX)** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-15 (Planned)

### Added
- **Visualization Category**: Introduced `#chart` and `#data` tags for data-driven visualization.
- **Mathematics Category**: Introduced `#math` tag with full LaTeX support (Raw Content Mode).
- **Diagrams Category**: Introduced `#diagram` (Mermaid support) and `#timeline` with `#event` tags.
- **Navigation Category**: Introduced `#toc` (Table of Contents), `#ref` (Internal References), and `#footnote`.
- **Layout Category**: Introduced `#grid` and `#column` for advanced document structures.
- **Integration Category**: Introduced `#html` and `#markdown` for embedding other formats.
- **Media & UI Category**: Introduced `#video` (with controls support), `#audio`, and `#badge` tags.
- **Documentation Category**: Introduced `#term`, `#definition`, and `#changelog` tags.
- **AST v0.2.0**: New version-specific AST grammar and specifications.
- **Dictionary v0.2.0**: Updated rendering dictionary for new tags.
- **Web App (sdox-web)**:
    - Updated Live Preview renderer to support v0.2.0 tags with premium UI styling.
    - Added animated Chart components and LaTeX-style math containers.
    - Implemented Grid/Layout rendering.
    - Updated Documentation pages and Hero section to version 0.2.0.

## [0.1.0] - 2026-05-12

### Added
- Initial project specification for Scalable Document (SDOX).
- Core structure tags: `#title`, `#paragraph`, `#section`, `#divider`.
- Text semantic tags: `#text`, `#quote`, `#note`.
- List tags: `#list`, `#item`.
- Media tags: `#url`, `#image`.
- Code tags: `#code`, `#output`.
- Component tags: `#table`, `#card`, `#tab`, `#accordion`.
- AI-native tags: `#metadata`, `#dataset`, `#example`, `#instruction`, `#response`, `#embedding`, `#chunk`, `#context`, `#completion`.
- Initial PEG grammar and AST specification.
