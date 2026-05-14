"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSdox = parseSdox;
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
        // Skip whitespace, but stop at EOF
        while (i < input.length && /\s/.test(input[i]))
            i++;
        if (i >= input.length)
            break;
        // Check if it's a tag
        if (input[i] === '#') {
            const tagMatch = input.slice(i).match(/^#([a-z0-9_]+)/);
            if (tagMatch) {
                const tagName = tagMatch[1];
                i += tagMatch[0].length;
                // Parse attributes
                const attributes = {};
                if (input[i] === '(') {
                    const attrEnd = input.indexOf(')', i);
                    if (attrEnd !== -1) {
                        const attrStr = input.slice(i + 1, attrEnd);
                        const pairs = attrStr.split(',').map((s) => s.trim());
                        for (const pair of pairs) {
                            const [k, vRaw] = pair.split('=').map((s) => s.trim());
                            if (k && vRaw) {
                                let v = vRaw;
                                if (v.startsWith('"') && v.endsWith('"')) {
                                    v = v.slice(1, -1);
                                }
                                else if (v === 'true') {
                                    v = true;
                                }
                                else if (v === 'false') {
                                    v = false;
                                }
                                else if (!isNaN(Number(v))) {
                                    v = Number(v);
                                }
                                attributes[k] = v;
                            }
                        }
                        i = attrEnd + 1;
                    }
                }
                // Skip spaces/tabs before content
                while (i < input.length && /[ \t]/.test(input[i]))
                    i++;
                if (input[i] === '{') {
                    // Block form
                    i++; // skip '{'
                    let braceCount = 1;
                    let blockContent = '';
                    const isRaw = tagName === 'code' || tagName === 'output';
                    while (i < input.length && braceCount > 0) {
                        if (input[i] === '{' && !isRaw)
                            braceCount++;
                        if (input[i] === '}')
                            braceCount--;
                        if (braceCount > 0) {
                            blockContent += input[i];
                        }
                        i++;
                    }
                    if (isRaw) {
                        let cleanContent = blockContent;
                        if (cleanContent.startsWith('\n'))
                            cleanContent = cleanContent.slice(1);
                        if (cleanContent.endsWith('\n'))
                            cleanContent = cleanContent.slice(0, -1);
                        nodes.push({
                            type: tagName,
                            attributes,
                            content: cleanContent,
                            children: []
                        });
                    }
                    else {
                        nodes.push({
                            type: tagName,
                            attributes,
                            content: null,
                            children: parseBlocks(blockContent)
                        });
                    }
                }
                else {
                    // Inline form
                    const newlineIdx = input.indexOf('\n', i);
                    const endIdx = newlineIdx !== -1 ? newlineIdx : input.length;
                    let inlineContent = input.slice(i, endIdx).trim();
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
        // Plain text
        let textContent = '';
        while (i < input.length) {
            if (input[i] === '#' && (i === 0 || input[i - 1] === '\n')) {
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
//# sourceMappingURL=parser.js.map