const noteIcons = { warning: '⚠️', danger: '🛑', success: '✅', info: 'ℹ️' };
const priorityColors = { high: '#f87171', medium: '#fbbf24', low: '#60a5fa' };
const aiTagMeta = {
    dataset: { icon: '📊', color: '#a78bfa', label: 'Dataset' },
    embedding: { icon: '🧬', color: '#2dd4bf', label: 'Embedding' },
    chunk: { icon: '🧩', color: '#fb923c', label: 'Chunk' },
    context: { icon: '🎯', color: '#38bdf8', label: 'Context' },
    completion: { icon: '✨', color: '#f472b6', label: 'Completion' },
};

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderChildren(children) {
    if (!children || children.length === 0) return '';
    return children.map(child => renderSdoxAST(child)).join('');
}

function renderCodeBlock(code, language, title, showLineNumbers) {
    const escapedCode = escapeHtml(code);
    return `
    <div class="sdox-code-wrap">
        ${title ? `<div class="code-header"><span class="code-title">${escapeHtml(title)}</span><span class="code-lang">${escapeHtml(language)}</span></div>` : ''}
        <div class="code-body">
            <pre><code class="language-${escapeHtml(language)}">${escapedCode}</code></pre>
        </div>
    </div>`;
}

function renderSdoxAST(node) {
    if (!node) return '';

    const attr = node.attributes || {};
    const content = node.content || '';
    const childrenHTML = renderChildren(node.children);
    const innerContent = node.children && node.children.length > 0 ? childrenHTML : escapeHtml(content);

    switch (node.type) {
        case 'document':
            return `<main class="sdox-doc">${childrenHTML}</main>`;

        case 'section':
            return `
            <section class="sdox-section" ${attr.id ? `id="${escapeHtml(attr.id)}"` : ''}>
                ${attr.title ? `<h2 class="section-title"><span class="section-accent"></span>${escapeHtml(attr.title)}</h2>` : ''}
                <div class="section-body">${childrenHTML}</div>
            </section>`;

        case 'title':
            const level = attr.level || 1;
            return `<h${level} ${attr.id ? `id="${escapeHtml(attr.id)}"` : ''} class="sdox-title level-${level}">${escapeHtml(content)}</h${level}>`;

        case 'paragraph':
            return `<p class="sdox-paragraph">${innerContent}</p>`;

        case 'plain_text':
            return `<span class="sdox-text">${escapeHtml(content)}</span>`;

        case 'divider':
            return `<div class="sdox-divider"><span class="divider-diamond">◆</span></div>`;

        case 'text':
            let styleClasses = [];
            if (attr.style === 'bold') styleClasses.push('is-bold');
            if (attr.style === 'italic') styleClasses.push('is-italic');
            if (attr.style === 'underline') styleClasses.push('is-underline');
            if (attr.style === 'strikethrough') styleClasses.push('is-strike');
            
            let inlineStyle = '';
            if (attr.color) inlineStyle += `color:${escapeHtml(attr.color)};`;
            if (attr.size) inlineStyle += `font-size:${escapeHtml(attr.size)};`;

            return `<span class="sdox-inline-text ${styleClasses.join(' ')}" style="${inlineStyle}">${escapeHtml(content)}</span>`;

        case 'quote':
            return `
            <blockquote class="sdox-quote">
                <span class="quote-mark">"</span>
                <div class="quote-body">
                    ${node.children.length > 0 ? childrenHTML : `<p>${escapeHtml(content)}</p>`}
                    ${attr.author ? `<footer class="quote-author">— ${escapeHtml(attr.author)}</footer>` : ''}
                </div>
            </blockquote>`;

        case 'note':
            const noteType = attr.type || 'info';
            return `
            <div class="sdox-note note-${escapeHtml(noteType)}">
                <div class="note-sidebar"><span class="note-icon">${noteIcons[noteType] || 'ℹ️'}</span></div>
                <div class="note-content">
                    <div class="note-type">${escapeHtml(noteType)}</div>
                    <div class="note-body">
                        ${node.children.length > 0 ? childrenHTML : `<p>${escapeHtml(content)}</p>`}
                    </div>
                </div>
            </div>`;

        case 'list':
            const listType = attr.type || 'unordered';
            const ListTag = listType === 'ordered' ? 'ol' : 'ul';
            const itemsHTML = node.children.filter(c => c.type === 'item').map(child => {
                const cAttr = child.attributes || {};
                const isChecklist = listType === 'checklist';
                const isDone = cAttr.done === true;
                const cInner = child.children.length > 0 ? renderChildren(child.children) : escapeHtml(child.content);
                return `
                <li class="sdox-item ${isDone ? 'done' : ''}">
                    ${isChecklist ? `<span class="check-box ${isDone ? 'checked' : ''}">${isDone ? '✓' : ''}</span>` : ''}
                    <span class="item-text">${cInner}</span>
                </li>`;
            }).join('');
            return `<${ListTag} class="sdox-list list-${escapeHtml(listType)}">${itemsHTML}</${ListTag}>`;

        case 'url':
            return `
            <a href="${escapeHtml(attr.href)}" target="${escapeHtml(attr.target || '_blank')}" class="sdox-url" title="${escapeHtml(attr.title || '')}">
                ${escapeHtml(content)}<svg class="link-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>`;

        case 'image':
            return `
            <figure class="sdox-figure">
                <div class="img-frame"><img src="${escapeHtml(attr.src)}" alt="${escapeHtml(attr.alt || '')}" width="${escapeHtml(attr.width || '')}" height="${escapeHtml(attr.height || '')}" /></div>
                ${attr.alt ? `<figcaption>${escapeHtml(attr.alt)}</figcaption>` : ''}
            </figure>`;

        case 'code':
            return renderCodeBlock(content, attr.language || 'text', attr.title, attr.line_number === true);

        case 'output':
            return `
            <div class="sdox-output">
                <div class="output-header"><span class="output-dots"><i class="dot-red"></i><i class="dot-yellow"></i><i class="dot-green"></i></span><span class="output-label">${escapeHtml(attr.type || 'terminal')}</span></div>
                <pre class="output-body">${escapeHtml(content)}</pre>
            </div>`;

        case 'table':
            return `
            <div class="sdox-table-wrap">
                <table class="sdox-table">${childrenHTML}</table>
            </div>`;

        case 'row':
            return `<tr class="sdox-row">${childrenHTML}</tr>`;

        case 'cell':
            if (attr.header) {
                return `<th class="sdox-th">${innerContent}</th>`;
            }
            return `<td class="sdox-td">${innerContent}</td>`;

        case 'card':
            return `
            <div class="sdox-card">
                ${attr.title ? `<div class="card-header"><span class="card-dot"></span>${escapeHtml(attr.title)}</div>` : ''}
                <div class="card-body">${node.children.length > 0 ? childrenHTML : `<p>${escapeHtml(content)}</p>`}</div>
            </div>`;

        case 'tab':
            return `
            <div class="sdox-tab">
                <div class="tab-bar"><span class="tab-active">${escapeHtml(attr.title || 'Tab')}</span></div>
                <div class="tab-content">${childrenHTML}</div>
            </div>`;

        case 'accordion':
            return `
            <details class="sdox-accordion">
                <summary class="accordion-toggle">
                    <span class="accordion-chevron">▶</span>
                    <span>${escapeHtml(attr.title || 'Details')}</span>
                </summary>
                <div class="accordion-body">${childrenHTML}</div>
            </details>`;

        case 'include':
            return `<div class="sdox-chip chip-include"><span class="chip-icon">📎</span> <code>${escapeHtml(attr.src)}</code></div>`;

        case 'template':
            return `
            <div class="sdox-template">
                <div class="template-header"><span class="chip-icon">📐</span> Template: <code>${escapeHtml(attr.name)}</code></div>
                <div class="template-body">${childrenHTML}</div>
            </div>`;

        case 'use':
            return `<div class="sdox-chip chip-use"><span class="chip-icon">⚡</span> <code>${escapeHtml(attr.template)}</code></div>`;

        case 'instruction':
            return `
            <div class="sdox-ai-block ai-instruction">
                <div class="ai-header"><span class="ai-icon">📝</span><span class="ai-label">Instruction</span>
                    ${attr.priority ? `<span class="model-badge" style="background:${priorityColors[attr.priority] || '#64748b'}33;color:${priorityColors[attr.priority] || '#64748b'}; border-color: ${priorityColors[attr.priority] || '#64748b'}80;">${escapeHtml(attr.priority)}</span>` : ''}
                </div>
                <div class="ai-body">${node.children.length > 0 ? childrenHTML : `<p>${escapeHtml(content)}</p>`}</div>
            </div>`;

        case 'response':
            return `
            <div class="sdox-ai-block ai-response">
                <div class="ai-header"><span class="ai-icon">🤖</span><span class="ai-label">Response</span>
                    ${attr.model ? `<span class="model-badge">${escapeHtml(attr.model)}</span>` : ''}
                </div>
                <div class="ai-body">${node.children.length > 0 ? childrenHTML : `<p>${escapeHtml(content)}</p>`}</div>
            </div>`;

        case 'example':
            return `
            <div class="sdox-ai-block ai-example">
                <div class="ai-header"><span class="ai-icon">💡</span><span class="ai-label">Example</span>
                    ${attr.language ? `<span class="model-badge">${escapeHtml(attr.language)}</span>` : ''}
                </div>
                <div class="ai-body p-0">
                    <pre class="example-code">${escapeHtml(content)}</pre>
                </div>
            </div>`;

        case 'metadata':
            const metaRows = node.children.filter(c => c.type === 'item').map(child => {
                return `<div class="meta-row"><div class="meta-key">${escapeHtml(child.attributes.key)}</div><div class="meta-val">${escapeHtml(child.content)}</div></div>`;
            }).join('');
            return `
            <div class="sdox-ai-block ai-metadata">
                <div class="ai-header"><span class="ai-icon">📋</span><span class="ai-label">Metadata</span></div>
                <div class="ai-body p-0">
                    <div class="metadata-grid">${metaRows}</div>
                </div>
            </div>`;

        case 'dataset':
        case 'embedding':
        case 'chunk':
        case 'context':
        case 'completion':
            const meta = aiTagMeta[node.type] || { icon: '🔷', color: '#38bdf8', label: node.type };
            return `
            <div class="sdox-ai-block" style="--ai-color:${meta.color}">
                <div class="ai-header"><span class="ai-icon">${meta.icon}</span><span class="ai-label">${meta.label}</span>
                    ${attr.name ? `<span class="model-badge">${escapeHtml(attr.name)}</span>` : ''}
                    ${attr.scope ? `<span class="model-badge">${escapeHtml(attr.scope)}</span>` : ''}
                    ${attr.model ? `<span class="model-badge">${escapeHtml(attr.model)}</span>` : ''}
                    ${attr.size ? `<span class="model-badge">${escapeHtml(attr.size)} tokens</span>` : ''}
                </div>
                ${(node.children.length > 0 || content) ? `
                <div class="ai-body">${node.children.length > 0 ? childrenHTML : `<p>${escapeHtml(content)}</p>`}</div>
                ` : ''}
            </div>`;

        default:
            return `
            <div class="sdox-unknown"><span class="unknown-tag">#${escapeHtml(node.type)}</span>
                ${node.children.length > 0 ? childrenHTML : `<p>${escapeHtml(content)}</p>`}
            </div>`;
    }
}

window.renderSdoxAST = renderSdoxAST;
