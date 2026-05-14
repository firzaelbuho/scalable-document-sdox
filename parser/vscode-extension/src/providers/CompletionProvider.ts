import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class SdoxCompletionProvider implements vscode.CompletionItemProvider {
    private tags: any[] = [];

    constructor(context: vscode.ExtensionContext) {
        this.loadTags(context);
    }

    private loadTags(context: vscode.ExtensionContext) {
        try {
            // Find the tags.json file. In our workspace it's at docs/tags/0.1.0.json
            // We'll hardcode the path relative to the workspace root for now since it's a monorepo structure.
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders) {
                const rootPath = workspaceFolders[0].uri.fsPath;
                const tagsPath = path.join(rootPath, 'docs', 'tags', '0.1.0.json');
                
                if (fs.existsSync(tagsPath)) {
                    const data = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
                    this.tags = data.categories.flatMap((cat: any) => cat.tags);
                }
            }
        } catch (e) {
            console.error('Failed to load SDOX tags', e);
        }
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // Suggest tags after '#'
        if (linePrefix.endsWith('#')) {
            return this.tags.map(tag => {
                const item = new vscode.CompletionItem(tag.name, vscode.CompletionItemKind.Keyword);
                item.detail = "SDOX Tag";
                item.documentation = new vscode.MarkdownString(tag.description);
                
                // Add attributes snippet if there are any required attributes
                const requiredAttrs = tag.attributes?.filter((a: any) => a.required) || [];
                if (requiredAttrs.length > 0) {
                    const snippetParams = requiredAttrs.map((a: any, idx: number) => `${a.name}="\${${idx + 1}}"`).join(", ");
                    item.insertText = new vscode.SnippetString(`${tag.name}(${snippetParams})`);
                } else {
                    item.insertText = tag.name;
                }
                
                return item;
            });
        }

        // Suggest attributes inside '()'
        // Check if we are inside parentheses and after a tag name
        const match = linePrefix.match(/#([a-zA-Z0-9_]+)\([^)]*$/);
        if (match) {
            const tagName = match[1];
            const tagDef = this.tags.find(t => t.name === tagName);
            
            if (tagDef && tagDef.attributes) {
                // If ending with a comma or space, or just starting to type an attribute
                if (/[(\s,]$/.test(linePrefix)) {
                    return tagDef.attributes.map((attr: any) => {
                        const item = new vscode.CompletionItem(attr.name, vscode.CompletionItemKind.Property);
                        item.detail = attr.type + (attr.required ? " (required)" : "");
                        item.documentation = attr.description;
                        item.insertText = new vscode.SnippetString(`${attr.name}="\${1}"`);
                        return item;
                    });
                }
            }
        }

        return undefined;
    }
}
