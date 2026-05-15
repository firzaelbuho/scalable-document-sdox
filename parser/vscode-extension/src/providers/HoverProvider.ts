/**
 * SDOX Hover Provider
 * 
 * Shows rich documentation when hovering over SDOX tags and attributes.
 */

import * as vscode from 'vscode';
import { TAG_SCHEMA } from './CompletionProvider';

export class SdoxHoverProvider implements vscode.HoverProvider {

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): vscode.Hover | undefined {

        const line = document.lineAt(position).text;
        const wordRange = document.getWordRangeAtPosition(position, /#?[a-z][a-z0-9_]*/);
        if (!wordRange) { return undefined; }

        const word = document.getText(wordRange);

        // Case 1: Hovering over a tag (starts with #)
        if (word.startsWith('#')) {
            const tagName = word.slice(1);
            return this.getTagHover(tagName);
        }

        // Case 2: Hovering over a word that could be an attribute name
        // Check if it's inside parentheses context
        const charBefore = line.substring(0, wordRange.start.character);
        const tagContext = this.findTagContext(charBefore, line);
        if (tagContext) {
            return this.getAttributeHover(tagContext, word);
        }

        // Case 3: Check if the word itself is a tag name (without #)
        const tag = TAG_SCHEMA.find(t => t.name === word);
        if (tag) {
            // Check if preceded by # (could be at line start)
            const charIdx = wordRange.start.character;
            if (charIdx > 0 && line[charIdx - 1] === '#') {
                return this.getTagHover(word);
            }
        }

        return undefined;
    }

    private getTagHover(tagName: string): vscode.Hover | undefined {
        const tag = TAG_SCHEMA.find(t => t.name === tagName);
        if (!tag) { return undefined; }

        const md = new vscode.MarkdownString();
        md.isTrusted = true;
        md.supportHtml = true;

        md.appendMarkdown(`## ${tag.categoryIcon} \`#${tag.name}\`\n\n`);
        md.appendMarkdown(`${tag.description}\n\n`);
        md.appendMarkdown(`**Category:** ${tag.category}\n\n`);

        if (tag.attributes.length > 0) {
            md.appendMarkdown(`### Attributes\n\n`);
            md.appendMarkdown(`| Name | Type | Required | Description |\n`);
            md.appendMarkdown(`|------|------|----------|-------------|\n`);
            for (const attr of tag.attributes) {
                const reqStr = attr.required ? '✅' : '—';
                const typeStr = attr.type === 'enum' && attr.values
                    ? `\`${attr.values.join('` \\| `')}\``
                    : `\`${attr.type}\``;
                md.appendMarkdown(`| \`${attr.name}\` | ${typeStr} | ${reqStr} | ${attr.description} |\n`);
            }
            md.appendMarkdown(`\n`);
        }

        if (tag.examples.length > 0) {
            md.appendMarkdown(`### Example\n\n`);
            md.appendMarkdown(`\`\`\`sdox\n${tag.examples[0].code}\n\`\`\`\n`);
        }

        return new vscode.Hover(md);
    }

    private getAttributeHover(tagName: string, attrName: string): vscode.Hover | undefined {
        const tag = TAG_SCHEMA.find(t => t.name === tagName);
        if (!tag) { return undefined; }

        const attr = tag.attributes.find(a => a.name === attrName);
        if (!attr) { return undefined; }

        const md = new vscode.MarkdownString();
        md.isTrusted = true;

        md.appendMarkdown(`**\`${attrName}\`** — *${attr.type}*${attr.required ? ' *(required)*' : ''}\n\n`);
        md.appendMarkdown(`${attr.description}\n\n`);

        if (attr.values) {
            md.appendMarkdown(`**Values:** ${attr.values.map(v => `\`${v}\``).join(' | ')}\n\n`);
        }

        if (attr.default) {
            md.appendMarkdown(`**Default:** \`${attr.default}\`\n`);
        }

        return new vscode.Hover(md);
    }

    private findTagContext(textBefore: string, _fullLine: string): string | null {
        const match = textBefore.match(/#([a-z][a-z0-9_]*)\s*\([^)]*$/);
        if (match) {
            return match[1];
        }
        return null;
    }
}
