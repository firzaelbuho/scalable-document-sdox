// ============================================
// SDOX Tag Definitions — Central Data Source
// ============================================
// To add a new tag: just add a TagDefinition to the appropriate category array.
// It will automatically appear in the docs sidebar, tag reference, and landing page.

export interface TagAttribute {
	name: string;
	type: 'string' | 'number' | 'boolean' | 'enum';
	required?: boolean;
	default?: string;
	description: string;
	values?: string[]; // for enum types
}

export interface TagExample {
	title?: string;
	code: string;
	description?: string;
}

export interface TagDefinition {
	name: string;
	description: string;
	attributes: TagAttribute[];
	examples: TagExample[];
	notes?: string[];
}

export interface TagCategory {
	id: string;
	name: string;
	icon: string;
	color: string;
	description: string;
	tags: TagDefinition[];
}

// ============================================
// Category Definitions
// ============================================

export const tagCategories: TagCategory[] = [
	// ------------------------------------------
	// Structure
	// ------------------------------------------
	{
		id: 'structure',
		name: 'Structure',
		icon: '📄',
		color: 'var(--color-cat-structure)',
		description: 'Core building blocks for organizing document layout and hierarchy.',
		tags: [
			{
				name: 'title',
				description:
					'Defines a heading element with explicit level control. Unlike Markdown\'s # symbols, the level is always a clear attribute.',
				attributes: [
					{
						name: 'level',
						type: 'number',
						required: true,
						description: 'Heading level from 1 (largest) to 6 (smallest).'
					},
					{
						name: 'id',
						type: 'string',
						description: 'Optional anchor ID for deep linking.'
					}
				],
				examples: [
					{
						title: 'Basic heading',
						code: '#title(level=1) Introduction'
					},
					{
						title: 'With anchor',
						code: '#title(level=2, id="getting-started") Getting Started'
					}
				]
			},
			{
				name: 'paragraph',
				description: 'A block of body text. Supports multi-line content using block syntax.',
				attributes: [],
				examples: [
					{
						title: 'Block form',
						code: '#paragraph {\n  Scalable Document is designed for\n  humans and machines alike.\n}'
					}
				]
			},
			{
				name: 'section',
				description:
					'Groups related content under a named section. Useful for logical document organization.',
				attributes: [
					{
						name: 'title',
						type: 'string',
						description: 'Section title displayed as a header.'
					},
					{
						name: 'id',
						type: 'string',
						description: 'Optional anchor ID for navigation.'
					}
				],
				examples: [
					{
						title: 'Named section',
						code: '#section(title="Authentication") {\n  #paragraph {\n    All API requests require a valid token.\n  }\n}'
					}
				]
			},
			{
				name: 'divider',
				description: 'A horizontal rule that visually separates content sections.',
				attributes: [],
				examples: [
					{
						code: '#divider'
					}
				]
			}
		]
	},

	// ------------------------------------------
	// Text & Semantics
	// ------------------------------------------
	{
		id: 'text-semantics',
		name: 'Text & Semantics',
		icon: '✏️',
		color: 'var(--color-cat-text)',
		description: 'Semantic text elements for rich, meaningful content.',
		tags: [
			{
				name: 'text',
				description: 'Inline text with semantic styling attributes.',
				attributes: [
					{
						name: 'style',
						type: 'enum',
						description: 'Text style variant.',
						values: ['bold', 'italic', 'strikethrough', 'underline']
					},
					{
						name: 'color',
						type: 'string',
						description: 'Optional text color.'
					},
					{
						name: 'size',
						type: 'string',
						description: 'Optional text size.'
					}
				],
				examples: [
					{
						code: '#text(style="bold") Important notice'
					}
				]
			},
			{
				name: 'quote',
				description: 'A blockquote with optional author attribution.',
				attributes: [
					{
						name: 'author',
						type: 'string',
						description: 'Author of the quote.'
					}
				],
				examples: [
					{
						title: 'With attribution',
						code: '#quote(author="Alan Turing") {\n  We can only see a short distance ahead,\n  but we can see plenty there that needs to be done.\n}'
					}
				]
			},
			{
				name: 'note',
				description:
					'A callout box for important notices. Type determines visual styling and semantic meaning.',
				attributes: [
					{
						name: 'type',
						type: 'enum',
						required: true,
						description: 'Severity level of the note.',
						values: ['info', 'warning', 'danger', 'success']
					}
				],
				examples: [
					{
						title: 'Warning callout',
						code: '#note(type="warning") {\n  Never expose API keys in client-side code.\n}'
					},
					{
						title: 'Info callout',
						code: '#note(type="info") {\n  SDOX supports all common text encodings.\n}'
					}
				]
			}
		]
	},

	// ------------------------------------------
	// Lists
	// ------------------------------------------
	{
		id: 'lists',
		name: 'Lists',
		icon: '📋',
		color: 'var(--color-cat-list)',
		description: 'Ordered, unordered, and checklist structures.',
		tags: [
			{
				name: 'list',
				description: 'A container for list items. Supports multiple list types.',
				attributes: [
					{
						name: 'type',
						type: 'enum',
						description: 'Type of list rendering.',
						default: 'unordered',
						values: ['unordered', 'ordered', 'checklist']
					}
				],
				examples: [
					{
						title: 'Unordered list',
						code: '#list(type="unordered") {\n  #item First item\n  #item Second item\n  #item Third item\n}'
					},
					{
						title: 'Checklist',
						code: '#list(type="checklist") {\n  #item(done=true) Setup project\n  #item(done=false) Write docs\n}'
					}
				]
			},
			{
				name: 'item',
				description: 'A single list item. Supports checked state for checklists.',
				attributes: [
					{
						name: 'done',
						type: 'boolean',
						description: 'Completion state (for checklists only).',
						default: 'false'
					}
				],
				examples: [
					{
						code: '#item(done=true) Finish specification'
					}
				]
			}
		]
	},

	// ------------------------------------------
	// Links & Media
	// ------------------------------------------
	{
		id: 'links-media',
		name: 'Links & Media',
		icon: '🔗',
		color: 'var(--color-cat-link)',
		description: 'Hyperlinks, images, and external resource references.',
		tags: [
			{
				name: 'url',
				description: 'A hyperlink to an external or internal resource.',
				attributes: [
					{
						name: 'href',
						type: 'string',
						required: true,
						description: 'Target URL.'
					},
					{
						name: 'title',
						type: 'string',
						description: 'Hover tooltip text.'
					},
					{
						name: 'target',
						type: 'enum',
						description: 'Link open behavior.',
						values: ['_self', '_blank']
					}
				],
				examples: [
					{
						code: '#url(href="https://sdox.dev") Visit SDOX'
					}
				]
			},
			{
				name: 'image',
				description: 'An image element with accessible alt text and optional dimensions.',
				attributes: [
					{
						name: 'src',
						type: 'string',
						required: true,
						description: 'Image source path or URL.'
					},
					{
						name: 'alt',
						type: 'string',
						required: true,
						description: 'Alternative text for accessibility.'
					},
					{
						name: 'width',
						type: 'number',
						description: 'Display width in pixels.'
					},
					{
						name: 'height',
						type: 'number',
						description: 'Display height in pixels.'
					}
				],
				examples: [
					{
						code: '#image(\n  src="cover.png",\n  alt="Cover Image",\n  width=500\n)'
					}
				]
			}
		]
	},

	// ------------------------------------------
	// Code
	// ------------------------------------------
	{
		id: 'code',
		name: 'Code',
		icon: '💻',
		color: 'var(--color-cat-code)',
		description: 'Code blocks and terminal output with rich display options.',
		tags: [
			{
				name: 'code',
				description:
					'A fenced code block with language-aware highlighting and advanced display options.',
				attributes: [
					{
						name: 'language',
						type: 'string',
						description: 'Programming language for syntax highlighting.'
					},
					{
						name: 'title',
						type: 'string',
						description: 'Optional title or filename displayed above the block.'
					},
					{
						name: 'line_number',
						type: 'boolean',
						description: 'Show line numbers.',
						default: 'false'
					},
					{
						name: 'highlight',
						type: 'string',
						description: 'Comma-separated line numbers to highlight.'
					},
					{
						name: 'foldable',
						type: 'boolean',
						description: 'Allow collapsing the code block.',
						default: 'false'
					},
					{
						name: 'editable',
						type: 'boolean',
						description: 'Allow inline editing.',
						default: 'false'
					},
					{
						name: 'runnable',
						type: 'boolean',
						description: 'Show a run button for executable code.',
						default: 'false'
					},
					{
						name: 'theme',
						type: 'string',
						description: 'Color theme override for this block.'
					}
				],
				examples: [
					{
						title: 'Basic code block',
						code: '#code(language="python") {\n  print("hello, sdox!")\n}'
					},
					{
						title: 'With all options',
						code: '#code(\n  language="python",\n  title="main.py",\n  line_number=true,\n  highlight="2,5"\n) {\n  def hello():\n      print("hello")\n}'
					}
				]
			},
			{
				name: 'output',
				description: 'Displays command output, API responses, or rendered results.',
				attributes: [
					{
						name: 'type',
						type: 'enum',
						description: 'Output format type.',
						values: ['terminal', 'json', 'text', 'html']
					}
				],
				examples: [
					{
						code: '#output(type="terminal") {\n  build success\n  compiled 42 modules in 1.2s\n}'
					}
				]
			}
		]
	},

	// ------------------------------------------
	// Tables
	// ------------------------------------------
	{
		id: 'tables',
		name: 'Tables',
		icon: '📊',
		color: 'var(--color-cat-table)',
		description: 'Structured tabular data with explicit header semantics.',
		tags: [
			{
				name: 'table',
				description: 'A data table container. Composed of rows and cells.',
				attributes: [],
				examples: [
					{
						title: 'Full table example',
						code: '#table {\n  #row {\n    #cell(header=true) Name\n    #cell(header=true) Age\n  }\n  #row {\n    #cell John\n    #cell 25\n  }\n}'
					}
				]
			},
			{
				name: 'row',
				description: 'A table row containing one or more cells.',
				attributes: [],
				examples: [
					{
						code: '#row {\n  #cell Column A\n  #cell Column B\n}'
					}
				]
			},
			{
				name: 'cell',
				description: 'A single table cell. Can be marked as a header cell.',
				attributes: [
					{
						name: 'header',
						type: 'boolean',
						description: 'Whether this cell is a header.',
						default: 'false'
					}
				],
				examples: [
					{
						code: '#cell(header=true) Name'
					}
				]
			}
		]
	},

	// ------------------------------------------
	// Components & Layout
	// ------------------------------------------
	{
		id: 'components',
		name: 'Components & Layout',
		icon: '🧩',
		color: 'var(--color-cat-component)',
		description: 'Higher-level UI components for interactive and visual layouts.',
		tags: [
			{
				name: 'card',
				description: 'A visually contained content block with optional title and type.',
				attributes: [
					{
						name: 'title',
						type: 'string',
						description: 'Card heading text.'
					},
					{
						name: 'type',
						type: 'string',
						description: 'Card variant for styling.'
					}
				],
				examples: [
					{
						code: '#card(title="Warning") {\n  Never deploy on Friday night.\n}'
					}
				]
			},
			{
				name: 'tab',
				description: 'A tab panel for tabbed content interfaces.',
				attributes: [
					{
						name: 'title',
						type: 'string',
						required: true,
						description: 'Tab label text.'
					}
				],
				examples: [
					{
						code: '#tab(title="Linux") {\n  #code(language="bash") {\n    sudo apt install sdox\n  }\n}'
					}
				]
			},
			{
				name: 'accordion',
				description: 'A collapsible content section.',
				attributes: [
					{
						name: 'title',
						type: 'string',
						required: true,
						description: 'Accordion toggle label.'
					}
				],
				examples: [
					{
						code: '#accordion(title="Advanced Configuration") {\n  #paragraph {\n    Custom parser options can be set in sdox.config.json\n  }\n}'
					}
				]
			}
		]
	},

	// ------------------------------------------
	// Modularization
	// ------------------------------------------
	{
		id: 'modularization',
		name: 'Modularization',
		icon: '📦',
		color: 'var(--color-cat-modular)',
		description: 'Compose documents from reusable templates and external files.',
		tags: [
			{
				name: 'include',
				description: 'Import content from another SDOX file.',
				attributes: [
					{
						name: 'src',
						type: 'string',
						required: true,
						description: 'Relative path to the SDOX file to include.'
					}
				],
				examples: [
					{
						code: '#include(src="./authentication.sdox")'
					}
				]
			},
			{
				name: 'template',
				description: 'Define a reusable content template.',
				attributes: [
					{
						name: 'name',
						type: 'string',
						required: true,
						description: 'Unique template identifier.'
					}
				],
				examples: [
					{
						code: '#template(name="api_endpoint") {\n  #title(level=3) Endpoint\n  #code(language="bash") {\n    curl -X GET /api/resource\n  }\n}'
					}
				]
			},
			{
				name: 'use',
				description: 'Instantiate a previously defined template.',
				attributes: [
					{
						name: 'template',
						type: 'string',
						required: true,
						description: 'Name of the template to use.'
					}
				],
				examples: [
					{
						code: '#use(template="api_endpoint")'
					}
				]
			}
		]
	},

	// ------------------------------------------
	// AI-Native
	// ------------------------------------------
	{
		id: 'ai-native',
		name: 'AI-Native',
		icon: '🤖',
		color: 'var(--color-cat-ai)',
		description:
			'First-class support for AI workflows — datasets, embeddings, prompts, and context scoping.',
		tags: [
			{
				name: 'metadata',
				description: 'Document-level metadata as key-value pairs.',
				attributes: [],
				examples: [
					{
						code: '#metadata {\n  #item(key="author") John\n  #item(key="version") 1.0\n  #item(key="status") draft\n}'
					}
				]
			},
			{
				name: 'dataset',
				description: 'Defines a named dataset block for AI training or evaluation.',
				attributes: [
					{
						name: 'name',
						type: 'string',
						required: true,
						description: 'Dataset identifier.'
					}
				],
				examples: [
					{
						code: '#dataset(name="qa_pairs") {\n  #instruction {\n    Summarize this document.\n  }\n  #response {\n    This document covers...\n  }\n}'
					}
				]
			},
			{
				name: 'example',
				description: 'A code or content example for AI few-shot learning.',
				attributes: [
					{
						name: 'language',
						type: 'string',
						description: 'Programming language of the example.'
					}
				],
				examples: [
					{
						code: '#example(language="python") {\n  def greet(name):\n      return f"Hello, {name}!"\n}'
					}
				]
			},
			{
				name: 'instruction',
				description: 'A prompt instruction for AI models.',
				attributes: [
					{
						name: 'priority',
						type: 'enum',
						description: 'Instruction priority level.',
						values: ['low', 'medium', 'high']
					}
				],
				examples: [
					{
						code: '#instruction(priority="high") {\n  Always respond in JSON format.\n}'
					}
				]
			},
			{
				name: 'response',
				description: 'Expected or generated AI response.',
				attributes: [
					{
						name: 'model',
						type: 'string',
						description: 'AI model that generated the response.'
					}
				],
				examples: [
					{
						code: '#response(model="gpt-5") {\n  { "status": "success", "data": [...] }\n}'
					}
				]
			},
			{
				name: 'embedding',
				description: 'Marks content for vector embedding generation.',
				attributes: [
					{
						name: 'model',
						type: 'string',
						description: 'Embedding model to use.'
					}
				],
				examples: [
					{
						code: '#embedding(model="text-embedding-3")'
					}
				]
			},
			{
				name: 'chunk',
				description: 'Defines content chunks for vector database ingestion.',
				attributes: [
					{
						name: 'size',
						type: 'number',
						description: 'Maximum chunk size in tokens.'
					}
				],
				examples: [
					{
						code: '#chunk(size=500) {\n  Content optimized for vector DB...\n}'
					}
				]
			},
			{
				name: 'context',
				description: 'Scoped context for AI processing.',
				attributes: [
					{
						name: 'scope',
						type: 'string',
						required: true,
						description: 'Context scope identifier.'
					}
				],
				examples: [
					{
						code: '#context(scope="authentication") {\n  OAuth 2.0 is the industry standard\n  protocol for authorization.\n}'
					}
				]
			},
			{
				name: 'completion',
				description: 'Marks a section for AI auto-completion.',
				attributes: [
					{
						name: 'model',
						type: 'string',
						description: 'Model to use for completion.'
					}
				],
				examples: [
					{
						code: '#completion(model="gpt-5") {\n  Continue the documentation...\n}'
					}
				]
			}
		]
	}
];

// ============================================
// Helper Functions
// ============================================

/** Get all tags as a flat array */
export function getAllTags(): TagDefinition[] {
	return tagCategories.flatMap((cat) => cat.tags);
}

/** Get total tag count */
export function getTagCount(): number {
	return getAllTags().length;
}

/** Get a specific category by ID */
export function getCategoryById(id: string): TagCategory | undefined {
	return tagCategories.find((cat) => cat.id === id);
}

/** Get a specific tag by name */
export function getTagByName(name: string): TagDefinition | undefined {
	return getAllTags().find((tag) => tag.name === name);
}
