/**
 * SDOX Live Preview Panel
 * 
 * WebView panel that renders a live preview of the active SDOX document.
 * Updates automatically when the document changes (debounced).
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { parseSdox } from '../sdoxParser';
import { renderDocument } from '../sdoxRenderer';

export class PreviewPanel {
    public static readonly viewType = 'sdoxPreview';
    private static panels: Map<string, PreviewPanel> = new Map();

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _debounceTimer: ReturnType<typeof setTimeout> | undefined;
    private _documentUri: string;

    public static createOrShow(extensionUri: vscode.Uri, toSide: boolean = true): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'sdox') {
            vscode.window.showWarningMessage('Open an .sdox file first to preview it.');
            return;
        }

        const docUri = editor.document.uri.toString();
        const existing = PreviewPanel.panels.get(docUri);
        if (existing) {
            existing._panel.reveal(toSide ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active);
            return;
        }

        const column = toSide ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active;
        const fileName = path.basename(editor.document.fileName);

        const panel = vscode.window.createWebviewPanel(
            PreviewPanel.viewType,
            `Preview: ${fileName}`,
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        const previewPanel = new PreviewPanel(panel, extensionUri, docUri);
        PreviewPanel.panels.set(docUri, previewPanel);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, documentUri: string) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._documentUri = documentUri;

        this._updatePreview();

        this._disposables.push(
            vscode.workspace.onDidChangeTextDocument(e => {
                if (e.document.uri.toString() === this._documentUri) {
                    this._debouncedUpdate();
                }
            })
        );

        this._disposables.push(
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (editor && editor.document.languageId === 'sdox') {
                    const newUri = editor.document.uri.toString();
                    if (newUri !== this._documentUri) {
                        this._documentUri = newUri;
                        const fileName = path.basename(editor.document.fileName);
                        this._panel.title = `Preview: ${fileName}`;
                        this._updatePreview();
                    }
                }
            })
        );

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    private _debouncedUpdate(): void {
        if (this._debounceTimer) { clearTimeout(this._debounceTimer); }
        this._debounceTimer = setTimeout(() => { this._updatePreview(); }, 300);
    }

    private _updatePreview(): void {
        const doc = vscode.workspace.textDocuments.find(d => d.uri.toString() === this._documentUri);
        if (!doc) { return; }

        const sdoxText = doc.getText();
        const ast = parseSdox(sdoxText);
        const html = renderDocument(ast);
        this._panel.webview.html = this._getFullHtml(html);
    }

    private _getFullHtml(bodyHtml: string): string {
        const stylesPath = path.join(this._extensionUri.fsPath, 'src', 'preview', 'previewStyles.css');
        const libPath = vscode.Uri.file(path.join(this._extensionUri.fsPath, 'lib'));
        const katexJs = this._panel.webview.asWebviewUri(vscode.Uri.joinPath(libPath, 'katex.min.js'));
        const katexCss = this._panel.webview.asWebviewUri(vscode.Uri.joinPath(libPath, 'katex.min.css'));
        const mermaidJs = this._panel.webview.asWebviewUri(vscode.Uri.joinPath(libPath, 'mermaid.min.js'));
        const markedJs = this._panel.webview.asWebviewUri(vscode.Uri.joinPath(libPath, 'marked.min.js'));

        let css = '';
        try {
            css = fs.readFileSync(stylesPath, 'utf-8');
        } catch {
            try {
                css = fs.readFileSync(path.join(this._extensionUri.fsPath, 'out', 'preview', 'previewStyles.css'), 'utf-8');
            } catch {
                css = '/* styles not found */';
            }
        }

        const nonce = this._getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}' ${this._panel.webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${this._panel.webview.cspSource} https: data:; font-src ${this._panel.webview.cspSource} https:;">
    <title>SDOX Preview</title>
    <link rel="stylesheet" href="${katexCss}" nonce="${nonce}">
    <style nonce="${nonce}">${css}</style>
</head>
<body>
    <div class="sdox-preview-container">${bodyHtml}</div>

    <script nonce="${nonce}" src="${katexJs}"></script>
    <script nonce="${nonce}" src="${mermaidJs}"></script>
    <script nonce="${nonce}" src="${markedJs}"></script>
    <script nonce="${nonce}">
        // Initialize Mermaid
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: false, theme: 'dark' });
            mermaid.run({ querySelector: '.mermaid' });
        }
    </script>
</body>
</html>`;
    }

    private _getNonce(): string {
        let text = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) { text += chars.charAt(Math.floor(Math.random() * chars.length)); }
        return text;
    }

    public dispose(): void {
        PreviewPanel.panels.delete(this._documentUri);
        this._panel.dispose();
        if (this._debounceTimer) { clearTimeout(this._debounceTimer); }
        while (this._disposables.length) { const d = this._disposables.pop(); if (d) { d.dispose(); } }
    }
}
