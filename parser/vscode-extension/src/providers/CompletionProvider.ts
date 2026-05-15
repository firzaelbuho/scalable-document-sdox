/**
 * SDOX IntelliSense Completion Provider
 * 
 * Provides auto-completion for:
 * - Tag names when typing '#'
 * - Attribute names when inside '(' after a tag
 * - Attribute values (enums, booleans) when after '='
 */

import * as vscode from 'vscode';

/** Tag schema — extracted from docs/tags/0.1.0.json */
interface TagAttr {
    name: string;
    type: string;
    required?: boolean;
    description: string;
    values?: string[];
    default?: string;
}

interface TagDef {
    name: string;
    description: string;
    category: string;
    categoryIcon: string;
    attributes: TagAttr[];
    examples: { title?: string; code: string }[];
    hasBlock: boolean;
}

const TAG_SCHEMA: TagDef[] = [
    // === Structure ===
    {
        name: 'title', category: 'Structure', categoryIcon: '📄',
        description: 'Defines a heading element with explicit level control.',
        attributes: [
            { name: 'level', type: 'number', required: true, description: 'Heading level from 1 to 6.' },
            { name: 'id', type: 'string', required: false, description: 'Optional anchor ID for deep linking.' }
        ],
        examples: [{ title: 'Basic heading', code: '#title(level=1) Introduction' }],
        hasBlock: false
    },
    {
        name: 'paragraph', category: 'Structure', categoryIcon: '📄',
        description: 'A block of body text. Supports multi-line content.',
        attributes: [],
        examples: [{ code: '#paragraph {\n  Content here.\n}' }],
        hasBlock: true
    },
    {
        name: 'section', category: 'Structure', categoryIcon: '📄',
        description: 'Groups related content under a named section.',
        attributes: [
            { name: 'title', type: 'string', required: false, description: 'Section title.' },
            { name: 'id', type: 'string', required: false, description: 'Optional anchor ID.' }
        ],
        examples: [{ code: '#section(title="Auth") {\n  \n}' }],
        hasBlock: true
    },
    {
        name: 'divider', category: 'Structure', categoryIcon: '📄',
        description: 'A horizontal rule that visually separates content.',
        attributes: [],
        examples: [{ code: '#divider' }],
        hasBlock: false
    },
    // === Text & Semantics ===
    {
        name: 'text', category: 'Text & Semantics', categoryIcon: '✏️',
        description: 'Inline text with semantic styling attributes.',
        attributes: [
            { name: 'style', type: 'enum', required: false, description: 'Text style variant.', values: ['bold', 'italic', 'strikethrough', 'underline'] },
            { name: 'color', type: 'string', required: false, description: 'Optional text color.' },
            { name: 'size', type: 'string', required: false, description: 'Optional text size.' }
        ],
        examples: [{ code: '#text(style="bold") Important notice' }],
        hasBlock: false
    },
    {
        name: 'quote', category: 'Text & Semantics', categoryIcon: '✏️',
        description: 'A blockquote with optional author attribution.',
        attributes: [
            { name: 'author', type: 'string', required: false, description: 'Author of the quote.' }
        ],
        examples: [{ code: '#quote(author="Alan Turing") {\n  We can only see...\n}' }],
        hasBlock: true
    },
    {
        name: 'note', category: 'Text & Semantics', categoryIcon: '✏️',
        description: 'A callout box for important notices.',
        attributes: [
            { name: 'type', type: 'enum', required: true, description: 'Severity level.', values: ['info', 'warning', 'danger', 'success'] }
        ],
        examples: [{ code: '#note(type="warning") {\n  Never expose API keys.\n}' }],
        hasBlock: true
    },
    // === Lists ===
    {
        name: 'list', category: 'Lists', categoryIcon: '📋',
        description: 'A container for list items.',
        attributes: [
            { name: 'type', type: 'enum', required: false, description: 'Type of list.', default: 'unordered', values: ['unordered', 'ordered', 'checklist'] }
        ],
        examples: [{ code: '#list(type="ordered") {\n  #item First\n  #item Second\n}' }],
        hasBlock: true
    },
    {
        name: 'item', category: 'Lists', categoryIcon: '📋',
        description: 'A single list item.',
        attributes: [
            { name: 'done', type: 'boolean', required: false, description: 'Completion state (checklists).', default: 'false' }
        ],
        examples: [{ code: '#item(done=true) Finish specification' }],
        hasBlock: false
    },
    // === Links & Media ===
    {
        name: 'url', category: 'Links & Media', categoryIcon: '🔗',
        description: 'A hyperlink to an external or internal resource.',
        attributes: [
            { name: 'href', type: 'string', required: true, description: 'Target URL.' },
            { name: 'title', type: 'string', required: false, description: 'Hover tooltip text.' },
            { name: 'target', type: 'enum', required: false, description: 'Link open behavior.', values: ['_self', '_blank'] }
        ],
        examples: [{ code: '#url(href="https://sdox.dev") Visit SDOX' }],
        hasBlock: false
    },
    {
        name: 'image', category: 'Links & Media', categoryIcon: '🔗',
        description: 'An image element with alt text and optional dimensions.',
        attributes: [
            { name: 'src', type: 'string', required: true, description: 'Image source path or URL.' },
            { name: 'alt', type: 'string', required: true, description: 'Alternative text.' },
            { name: 'width', type: 'number', required: false, description: 'Display width in pixels.' },
            { name: 'height', type: 'number', required: false, description: 'Display height in pixels.' }
        ],
        examples: [{ code: '#image(src="logo.png", alt="Logo", width=200)' }],
        hasBlock: false
    },
    // === Code ===
    {
        name: 'code', category: 'Code', categoryIcon: '💻',
        description: 'A code block with language-aware highlighting.',
        attributes: [
            { name: 'language', type: 'string', required: false, description: 'Programming language.' },
            { name: 'title', type: 'string', required: false, description: 'Filename or title.' },
            { name: 'line_number', type: 'boolean', required: false, description: 'Show line numbers.', default: 'false' },
            { name: 'highlight', type: 'string', required: false, description: 'Lines to highlight.' },
            { name: 'foldable', type: 'boolean', required: false, description: 'Allow collapsing.', default: 'false' },
            { name: 'editable', type: 'boolean', required: false, description: 'Allow inline editing.', default: 'false' },
            { name: 'runnable', type: 'boolean', required: false, description: 'Show run button.', default: 'false' },
            { name: 'theme', type: 'string', required: false, description: 'Color theme override.' }
        ],
        examples: [{ code: '#code(language="python") {\n  print("hello")\n}' }],
        hasBlock: true
    },
    {
        name: 'output', category: 'Code', categoryIcon: '💻',
        description: 'Displays command output or terminal responses.',
        attributes: [
            { name: 'type', type: 'enum', required: false, description: 'Output format.', values: ['terminal', 'json', 'text', 'html'] }
        ],
        examples: [{ code: '#output(type="terminal") {\n  build success\n}' }],
        hasBlock: true
    },
    // === Tables ===
    {
        name: 'table', category: 'Tables', categoryIcon: '📊',
        description: 'A data table container.',
        attributes: [],
        examples: [{ code: '#table {\n  #row {\n    #cell(header=true) Name\n    #cell(header=true) Age\n  }\n}' }],
        hasBlock: true
    },
    {
        name: 'row', category: 'Tables', categoryIcon: '📊',
        description: 'A table row.',
        attributes: [],
        examples: [{ code: '#row {\n  #cell A\n  #cell B\n}' }],
        hasBlock: true
    },
    {
        name: 'cell', category: 'Tables', categoryIcon: '📊',
        description: 'A single table cell.',
        attributes: [
            { name: 'header', type: 'boolean', required: false, description: 'Whether this is a header cell.', default: 'false' }
        ],
        examples: [{ code: '#cell(header=true) Name' }],
        hasBlock: false
    },
    // === Components & Layout ===
    {
        name: 'card', category: 'Components', categoryIcon: '🧩',
        description: 'A visually contained content block.',
        attributes: [
            { name: 'title', type: 'string', required: false, description: 'Card heading.' },
            { name: 'type', type: 'string', required: false, description: 'Card variant for styling.' }
        ],
        examples: [{ code: '#card(title="Tip") {\n  Content here.\n}' }],
        hasBlock: true
    },
    {
        name: 'tab', category: 'Components', categoryIcon: '🧩',
        description: 'A tab panel for tabbed content.',
        attributes: [
            { name: 'title', type: 'string', required: true, description: 'Tab label.' }
        ],
        examples: [{ code: '#tab(title="Linux") {\n  \n}' }],
        hasBlock: true
    },
    {
        name: 'accordion', category: 'Components', categoryIcon: '🧩',
        description: 'A collapsible content section.',
        attributes: [
            { name: 'title', type: 'string', required: true, description: 'Toggle label.' }
        ],
        examples: [{ code: '#accordion(title="Details") {\n  \n}' }],
        hasBlock: true
    },
    // === Modularization ===
    {
        name: 'include', category: 'Modularization', categoryIcon: '📦',
        description: 'Import content from another SDOX file.',
        attributes: [
            { name: 'src', type: 'string', required: true, description: 'Path to SDOX file.' }
        ],
        examples: [{ code: '#include(src="./auth.sdox")' }],
        hasBlock: false
    },
    {
        name: 'template', category: 'Modularization', categoryIcon: '📦',
        description: 'Define a reusable content template.',
        attributes: [
            { name: 'name', type: 'string', required: true, description: 'Unique template identifier.' }
        ],
        examples: [{ code: '#template(name="api") {\n  \n}' }],
        hasBlock: true
    },
    {
        name: 'use', category: 'Modularization', categoryIcon: '📦',
        description: 'Instantiate a previously defined template.',
        attributes: [
            { name: 'template', type: 'string', required: true, description: 'Template name.' }
        ],
        examples: [{ code: '#use(template="api")' }],
        hasBlock: false
    },
    // === AI-Native ===
    {
        name: 'metadata', category: 'AI-Native', categoryIcon: '🤖',
        description: 'Document-level metadata as key-value pairs.',
        attributes: [],
        examples: [{ code: '#metadata {\n  #item(key="author") John\n  #item(key="version") 1.0\n}' }],
        hasBlock: true
    },
    {
        name: 'dataset', category: 'AI-Native', categoryIcon: '🤖',
        description: 'Named dataset block for AI training.',
        attributes: [
            { name: 'name', type: 'string', required: true, description: 'Dataset identifier.' }
        ],
        examples: [{ code: '#dataset(name="qa") {\n  \n}' }],
        hasBlock: true
    },
    {
        name: 'example', category: 'AI-Native', categoryIcon: '🤖',
        description: 'A code or content example for AI few-shot learning.',
        attributes: [
            { name: 'language', type: 'string', required: false, description: 'Programming language.' }
        ],
        examples: [{ code: '#example(language="python") {\n  def greet():\n      return "Hello"\n}' }],
        hasBlock: true
    },
    {
        name: 'instruction', category: 'AI-Native', categoryIcon: '🤖',
        description: 'A prompt instruction for AI models.',
        attributes: [
            { name: 'priority', type: 'enum', required: false, description: 'Instruction priority.', values: ['low', 'medium', 'high'] }
        ],
        examples: [{ code: '#instruction(priority="high") {\n  Always respond in JSON.\n}' }],
        hasBlock: true
    },
    {
        name: 'response', category: 'AI-Native', categoryIcon: '🤖',
        description: 'Expected or generated AI response.',
        attributes: [
            { name: 'model', type: 'string', required: false, description: 'AI model name.' }
        ],
        examples: [{ code: '#response(model="gpt-5") {\n  { "status": "ok" }\n}' }],
        hasBlock: true
    },
    {
        name: 'embedding', category: 'AI-Native', categoryIcon: '🤖',
        description: 'Marks content for vector embedding generation.',
        attributes: [
            { name: 'model', type: 'string', required: false, description: 'Embedding model.' }
        ],
        examples: [{ code: '#embedding(model="text-embedding-3")' }],
        hasBlock: false
    },
    {
        name: 'chunk', category: 'AI-Native', categoryIcon: '🤖',
        description: 'Content chunks for vector database ingestion.',
        attributes: [
            { name: 'size', type: 'number', required: false, description: 'Max chunk size in tokens.' }
        ],
        examples: [{ code: '#chunk(size=500) {\n  Content...\n}' }],
        hasBlock: true
    },
    {
        name: 'context', category: 'AI-Native', categoryIcon: '🤖',
        description: 'Scoped context for AI processing.',
        attributes: [
            { name: 'scope', type: 'string', required: true, description: 'Context scope identifier.' }
        ],
        examples: [{ code: '#context(scope="auth") {\n  OAuth 2.0...\n}' }],
        hasBlock: true
    },
    {
        name: 'completion', category: 'AI-Native', categoryIcon: '🤖',
        description: 'Marks a section for AI auto-completion.',
        attributes: [
            { name: 'model', type: 'string', required: false, description: 'Model for completion.' }
        ],
        examples: [{ code: '#completion(model="gpt-5") {\n  Continue...\n}' }],
        hasBlock: true
    }
];

export { TAG_SCHEMA, TagDef, TagAttr };

export class SdoxCompletionProvider implements vscode.CompletionItemProvider {

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.CompletionContext
    ): vscode.CompletionItem[] | undefined {

        const lineText = document.lineAt(position).text;
        const textBefore = lineText.substring(0, position.character);

        // Case 1: After '#' — suggest tag names
        if (textBefore.endsWith('#') || /^#[a-z]*$/.test(textBefore.trimStart())) {
            return this.getTagCompletions();
        }

        // Case 2: Inside attribute parentheses — suggest attributes
        const tagInContext = this.findTagContext(textBefore);
        if (tagInContext) {
            // After '=' — suggest attribute values
            const attrMatch = textBefore.match(/(\w+)\s*=\s*"?([^"]*)?$/);
            if (attrMatch) {
                const attrName = attrMatch[1];
                return this.getValueCompletions(tagInContext, attrName);
            }

            // After '(' or ',' — suggest attribute names
            if (textBefore.match(/[,(]\s*[a-z_]*$/)) {
                return this.getAttributeCompletions(tagInContext);
            }
        }

        return undefined;
    }

    private getTagCompletions(): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        for (const tag of TAG_SCHEMA) {
            const item = new vscode.CompletionItem(tag.name, vscode.CompletionItemKind.Keyword);
            item.detail = `${tag.categoryIcon} ${tag.category}`;
            item.documentation = new vscode.MarkdownString(
                `**#${tag.name}** — ${tag.description}\n\n` +
                (tag.attributes.length > 0
                    ? `**Attributes:**\n${tag.attributes.map(a => `- \`${a.name}\` *(${a.type}${a.required ? ', required' : ''})* — ${a.description}`).join('\n')}\n\n`
                    : '') +
                (tag.examples.length > 0
                    ? `**Example:**\n\`\`\`sdox\n${tag.examples[0].code}\n\`\`\``
                    : '')
            );

            // Build snippet
            if (tag.hasBlock) {
                const reqAttrs = tag.attributes.filter(a => a.required);
                if (reqAttrs.length > 0) {
                    const attrSnippet = reqAttrs.map((a, idx) => {
                        if (a.type === 'enum' && a.values) {
                            return `${a.name}="\${${idx + 1}|${a.values.join(',')}|}"`;
                        } else if (a.type === 'number') {
                            return `${a.name}=\${${idx + 1}:1}`;
                        } else {
                            return `${a.name}="\${${idx + 1}:}"`;
                        }
                    }).join(', ');
                    item.insertText = new vscode.SnippetString(`${tag.name}(${attrSnippet}) {\n\t$0\n}`);
                } else {
                    item.insertText = new vscode.SnippetString(`${tag.name} {\n\t$0\n}`);
                }
            } else {
                const reqAttrs = tag.attributes.filter(a => a.required);
                if (reqAttrs.length > 0) {
                    const attrSnippet = reqAttrs.map((a, idx) => {
                        if (a.type === 'enum' && a.values) {
                            return `${a.name}="\${${idx + 1}|${a.values.join(',')}|}"`;
                        } else if (a.type === 'number') {
                            return `${a.name}=\${${idx + 1}:1}`;
                        } else {
                            return `${a.name}="\${${idx + 1}:}"`;
                        }
                    }).join(', ');
                    item.insertText = new vscode.SnippetString(`${tag.name}(${attrSnippet}) $0`);
                } else {
                    item.insertText = new vscode.SnippetString(`${tag.name} $0`);
                }
            }

            item.sortText = `0_${tag.category}_${tag.name}`;
            items.push(item);
        }

        return items;
    }

    private getAttributeCompletions(tagName: string): vscode.CompletionItem[] {
        const tag = TAG_SCHEMA.find(t => t.name === tagName);
        if (!tag) { return []; }

        return tag.attributes.map(attr => {
            const item = new vscode.CompletionItem(attr.name, vscode.CompletionItemKind.Property);
            item.detail = `${attr.type}${attr.required ? ' (required)' : ''}`;
            item.documentation = new vscode.MarkdownString(attr.description);

            // Build value snippet based on type
            if (attr.type === 'enum' && attr.values) {
                item.insertText = new vscode.SnippetString(`${attr.name}="\${1|${attr.values.join(',')}|}"`)
                ;
            } else if (attr.type === 'boolean') {
                item.insertText = new vscode.SnippetString(`${attr.name}=\${1|true,false|}`);
            } else if (attr.type === 'number') {
                item.insertText = new vscode.SnippetString(`${attr.name}=\${1:1}`);
            } else {
                item.insertText = new vscode.SnippetString(`${attr.name}="\${1:}"`);
            }

            return item;
        });
    }

    private getValueCompletions(tagName: string, attrName: string): vscode.CompletionItem[] {
        const tag = TAG_SCHEMA.find(t => t.name === tagName);
        if (!tag) { return []; }

        const attr = tag.attributes.find(a => a.name === attrName);
        if (!attr) { return []; }

        const items: vscode.CompletionItem[] = [];

        if (attr.type === 'enum' && attr.values) {
            for (const val of attr.values) {
                const item = new vscode.CompletionItem(val, vscode.CompletionItemKind.EnumMember);
                item.detail = `${attrName} value`;
                items.push(item);
            }
        } else if (attr.type === 'boolean') {
            items.push(new vscode.CompletionItem('true', vscode.CompletionItemKind.Value));
            items.push(new vscode.CompletionItem('false', vscode.CompletionItemKind.Value));
        }

        return items;
    }

    /**
     * Try to find which tag's attribute context we're currently in.
     * Returns the tag name or null.
     */
    private findTagContext(textBefore: string): string | null {
        // Look for the pattern #tagname(...  where we're inside the parens
        const match = textBefore.match(/#([a-z][a-z0-9_]*)\s*\([^)]*$/);
        if (match) {
            return match[1];
        }
        return null;
    }
}
