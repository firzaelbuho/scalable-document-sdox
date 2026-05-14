import { ASTNode } from './parser';

export function renderSdoxToHtml(node: ASTNode): string {
    if (node.type === 'document' || node.type === 'section') {
        const titleHtml = node.attributes.title && node.type === 'section' ? `<h2 class="section-title">${escapeHtml(node.attributes.title)}</h2>` : '';
        const idAttr = node.attributes.id ? ` id="${escapeHtml(node.attributes.id)}"` : '';
        const childrenHtml = node.children.map(renderSdoxToHtml).join('\n');
        return `<div class="sdox-container"${idAttr}>\n${titleHtml}\n${childrenHtml}\n</div>`;
    } 
    
    else if (node.type === 'title') {
        const level = node.attributes.level || 1;
        const idAttr = node.attributes.id ? ` id="${escapeHtml(node.attributes.id)}"` : '';
        return `<h${level} class="sdox-title"${idAttr}>${escapeHtml(node.content || '')}</h${level}>`;
    } 
    
    else if (node.type === 'paragraph') {
        const content = node.children.length > 0 
            ? node.children.map(renderSdoxToHtml).join('') 
            : escapeHtml(node.content || '');
        return `<p class="sdox-paragraph">${content}</p>`;
    } 
    
    else if (node.type === 'plain_text') {
        return `<span class="sdox-text">${escapeHtml(node.content || '')}</span>`;
    } 
    
    else if (node.type === 'divider') {
        return `<hr class="sdox-divider" />`;
    } 
    
    else if (node.type === 'note') {
        const type = node.attributes.type || 'info';
        let icon = 'ℹ️';
        if (type === 'warning') icon = '⚠️';
        if (type === 'danger') icon = '🛑';
        if (type === 'success') icon = '✅';

        const content = node.children.length > 0 
            ? node.children.map(renderSdoxToHtml).join('') 
            : escapeHtml(node.content || '');

        return `
            <div class="sdox-note sdox-note-${type}">
                <div class="note-icon">${icon}</div>
                <div class="note-content">${content}</div>
            </div>
        `;
    } 
    
    else if (node.type === 'list') {
        const tag = node.attributes.type === 'ordered' ? 'ol' : 'ul';
        const typeClass = node.attributes.type || 'unordered';
        const childrenHtml = node.children.map(child => {
            if (child.type === 'item') {
                const doneClass = child.attributes.done === true ? 'is-done' : '';
                const checkbox = typeClass === 'checklist' ? `<input type="checkbox" ${child.attributes.done ? 'checked' : ''} disabled />` : '';
                const content = child.children.length > 0 
                    ? child.children.map(renderSdoxToHtml).join('') 
                    : escapeHtml(child.content || '');
                return `<li class="sdox-list-item ${doneClass}">${checkbox}<span>${content}</span></li>`;
            }
            return '';
        }).join('\n');
        
        return `<${tag} class="sdox-list sdox-list-${typeClass}">\n${childrenHtml}\n</${tag}>`;
    } 
    
    else if (node.type === 'code') {
        const language = escapeHtml(node.attributes.language || 'text');
        const code = escapeHtml(node.content || '');
        // We use standard pre/code for VS Code webview
        return `
            <div class="sdox-code-wrapper">
                <pre><code class="language-${language}">${code}</code></pre>
            </div>
        `;
    } 
    
    else {
        // Fallback
        const content = node.children.length > 0 
            ? node.children.map(renderSdoxToHtml).join('') 
            : escapeHtml(node.content || '');
        return `
            <div class="sdox-generic-block">
                <span class="generic-label">#${node.type}</span>
                <div>${content}</div>
            </div>
        `;
    }
}

function escapeHtml(unsafe: any): string {
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
