/**
 * Tags whose block body content should be captured as raw text
 * (no recursive tag parsing inside).
 */
const RAW_CONTENT_TAGS = new Set(['code', 'output', 'example']);

/**
 * Tags that act as block containers — their block body
 * is recursively parsed for nested tags.
 */
const CONTAINER_TAGS = new Set([
	'section',
	'list',
	'table',
	'row',
	'card',
	'tab',
	'accordion',
	'template',
	'dataset',
	'metadata',
	'context',
	'chunk',
	'completion',
	'note',
	'quote',
	'instruction',
	'response'
]);

function parseSdox(input) {
	return {
		type: 'document',
		attributes: {},
		content: null,
		children: parseBlocks(input)
	};
}

function parseBlocks(input) {
	const nodes = [];
	let i = 0;

	while (i < input.length) {
		// Skip blank lines / whitespace between blocks
		while (i < input.length && /\s/.test(input[i])) i++;
		if (i >= input.length) break;

		// Check if it's a tag
		if (input[i] === '#') {
			const tagMatch = input.slice(i).match(/^#([a-z][a-z0-9_]*)/);
			if (tagMatch) {
				const tagName = tagMatch[1];
				i += tagMatch[0].length;

				// Parse attributes
				const attributes = {};
				// Skip whitespace before possible '('
				while (i < input.length && /[ \t\r\n]/.test(input[i]) && input[i] !== '(') {
					// Only skip spaces/tabs before '(', not newlines (which would mean inline form ended)
					if (input[i] === '\n' || input[i] === '\r') break;
					i++;
				}
				if (i < input.length && input[i] === '(') {
					const attrEnd = findMatchingParen(input, i);
					if (attrEnd !== -1) {
						const attrStr = input.slice(i + 1, attrEnd);
						parseAttributes(attrStr, attributes);
						i = attrEnd + 1;
					}
				}

				// Skip spaces/tabs before content
				while (i < input.length && /[ \t]/.test(input[i])) i++;

				if (i < input.length && input[i] === '{') {
					// Block form
					i++; // skip '{'
					const isRaw = RAW_CONTENT_TAGS.has(tagName) ||
						(tagName === 'example' && attributes.language);
					let blockContent = '';
					let braceCount = 1;

					while (i < input.length && braceCount > 0) {
						if (input[i] === '\\' && i + 1 < input.length && (input[i + 1] === '{' || input[i + 1] === '}')) {
							// Escaped brace
							blockContent += input[i + 1];
							i += 2;
							continue;
						}
						if (input[i] === '{') braceCount++;
						if (input[i] === '}') braceCount--;

						if (braceCount > 0) {
							blockContent += input[i];
						}
						i++;
					}

					if (isRaw) {
						// Raw content — strip leading/trailing newline
						let cleanContent = blockContent;
						if (cleanContent.startsWith('\n')) cleanContent = cleanContent.slice(1);
						if (cleanContent.endsWith('\n')) cleanContent = cleanContent.slice(0, -1);
						// Normalize indentation
						cleanContent = normalizeIndent(cleanContent);

						nodes.push({
							type: tagName,
							attributes,
							content: cleanContent,
							children: []
						});
					} else if (CONTAINER_TAGS.has(tagName)) {
						// Container — recurse
						nodes.push({
							type: tagName,
							attributes,
							content: null,
							children: parseBlocks(blockContent)
						});
					} else {
						// For paragraph, quote, note, instruction, response, etc.:
						// Try to parse mixed content (inline tags + text)
						const children = parseInlineContent(blockContent);
						if (children.length === 1 && children[0].type === 'plain_text') {
							// If it's just plain text, use content field
							nodes.push({
								type: tagName,
								attributes,
								content: children[0].content,
								children: []
							});
						} else {
							nodes.push({
								type: tagName,
								attributes,
								content: null,
								children
							});
						}
					}
				} else {
					// Inline form — read to end of line or next tag
					let endIdx = i;
					while (endIdx < input.length && input[endIdx] !== '\n') {
						if (input[endIdx] === '#' && /[a-z]/.test(input[endIdx+1] || '')) {
							break;
						}
						endIdx++;
					}
					const inlineContent = input.slice(i, endIdx).trim();
					i = endIdx;

					nodes.push({
						type: tagName,
						attributes,
						content: inlineContent || null,
						children: []
					});
				}
				continue;
			}
		}

		// Plain text — consume until next tag at start of a new line, or end of input
		let textContent = '';
		// Force consume at least one character to prevent infinite loops
		textContent += input[i];
		i++;

		while (i < input.length) {
			if (input[i] === '#' && /[a-z]/.test(input[i + 1] || '')) {
				break;
			}
			textContent += input[i];
			i++;
		}

		if (textContent.trim()) {
			nodes.push({
				type: 'plain_text',
				attributes: {},
				content: textContent.trim(),
				children: []
			});
		}
	}

	return nodes;
}

/**
 * Parse content that might contain inline #tags mixed with plain text.
 * Used inside paragraph, quote, note blocks, etc.
 */
function parseInlineContent(input) {
	const nodes = [];
	let remaining = input;

	// Strip leading/trailing newlines
	if (remaining.startsWith('\n')) remaining = remaining.slice(1);
	if (remaining.endsWith('\n')) remaining = remaining.slice(0, -1);

	// Check if this content has any inline tags
	const hasInlineTags = /#[a-z][a-z0-9_]*/.test(remaining);
	if (!hasInlineTags) {
		// Just plain text
		const trimmed = normalizeIndent(remaining).trim();
		if (trimmed) {
			nodes.push({
				type: 'plain_text',
				attributes: {},
				content: trimmed,
				children: []
			});
		}
		return nodes;
	}

	// Has inline tags — split and parse
	// First try to parse as blocks (for nested block tags like #note containing #paragraph)
	const blockNodes = parseBlocks(remaining);
	return blockNodes;
}

/**
 * Find the closing ')' matching the opening '(' at position `start`,
 * respecting nested parens and quoted strings.
 */
function findMatchingParen(input, start) {
	let depth = 0;
	let inString = false;
	for (let i = start; i < input.length; i++) {
		const ch = input[i];
		if (ch === '"' && (i === 0 || input[i - 1] !== '\\')) {
			inString = !inString;
		}
		if (inString) continue;
		if (ch === '(') depth++;
		if (ch === ')') {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

/**
 * Parse "key=value, key2=value2, ..." into an attributes object.
 */
function parseAttributes(attrStr, attrs) {
	// Split on commas that are not inside quotes
	const pairs = [];
	let current = '';
	let inQuote = false;
	for (let i = 0; i < attrStr.length; i++) {
		const ch = attrStr[i];
		if (ch === '"' && (i === 0 || attrStr[i - 1] !== '\\')) {
			inQuote = !inQuote;
		}
		if (ch === ',' && !inQuote) {
			pairs.push(current.trim());
			current = '';
		} else {
			current += ch;
		}
	}
	if (current.trim()) pairs.push(current.trim());

	for (const pair of pairs) {
		const eqIdx = pair.indexOf('=');
		if (eqIdx === -1) continue;
		const k = pair.slice(0, eqIdx).trim();
		let vRaw = pair.slice(eqIdx + 1).trim();
		if (!k) continue;

		let v = vRaw;
		if (v.startsWith('"') && v.endsWith('"')) {
			v = v.slice(1, -1);
		} else if (v === 'true') {
			v = true;
		} else if (v === 'false') {
			v = false;
		} else if (!isNaN(Number(v))) {
			v = Number(v);
		}
		attrs[k] = v;
	}
}

/**
 * Normalize indentation: find the minimum leading whitespace
 * of non-empty lines and strip that prefix from all lines.
 */
function normalizeIndent(text) {
	const lines = text.split('\n');
	let minIndent = Infinity;
	for (const line of lines) {
		if (line.trim().length === 0) continue;
		const match = line.match(/^(\s*)/);
		if (match && match[1].length < minIndent) {
			minIndent = match[1].length;
		}
	}
	if (minIndent === Infinity || minIndent === 0) return text;
	return lines.map((line) => (line.trim().length === 0 ? '' : line.slice(minIndent))).join('\n');
}

window.parseSdox = parseSdox;
