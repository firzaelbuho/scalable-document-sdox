import * as vscode from 'vscode';
import { parseSdox } from './parser';
import { renderSdoxToHtml } from './renderer';

export class PreviewPanel {
    public static currentPanel: PreviewPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.One;

        if (PreviewPanel.currentPanel) {
            PreviewPanel.currentPanel._panel.reveal(column);
            PreviewPanel.currentPanel.update();
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'sdoxPreview',
            'SDOX Preview',
            column,
            {
                enableScripts: true,
            }
        );

        PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;

        this.update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update when active editor changes
        vscode.window.onDidChangeActiveTextEditor(
            e => {
                if (e && e.document.languageId === 'sdox') {
                    this.update();
                }
            },
            null,
            this._disposables
        );

        // Update when the document changes
        vscode.workspace.onDidChangeTextDocument(
            e => {
                if (vscode.window.activeTextEditor && e.document === vscode.window.activeTextEditor.document && e.document.languageId === 'sdox') {
                    this.update();
                }
            },
            null,
            this._disposables
        );
    }

    public update() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        if (document.languageId !== 'sdox') {
            return;
        }

        const text = document.getText();
        const ast = parseSdox(text);
        const htmlBody = renderSdoxToHtml(ast);

        this._panel.webview.html = this._getHtmlForWebview(htmlBody);
    }

    private _getHtmlForWebview(body: string) {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SDOX Preview</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-background);
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .sdox-container {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    .section-title, .sdox-title {
                        color: var(--vscode-editor-foreground);
                        font-weight: 800;
                        margin-top: 24px;
                        margin-bottom: 8px;
                    }
                    .sdox-paragraph {
                        color: var(--vscode-descriptionForeground);
                        white-space: pre-wrap;
                        margin: 0;
                    }
                    .sdox-divider {
                        border: 0;
                        height: 1px;
                        background: var(--vscode-widget-border);
                        margin: 24px 0;
                    }
                    .sdox-note {
                        display: flex;
                        gap: 12px;
                        padding: 16px;
                        border-radius: 8px;
                        background: var(--vscode-textBlockQuote-background);
                        border: 1px solid var(--vscode-textBlockQuote-border);
                        border-left-width: 4px;
                    }
                    .sdox-note-warning { border-left-color: var(--vscode-editorWarning-foreground); }
                    .sdox-note-danger { border-left-color: var(--vscode-editorError-foreground); }
                    .sdox-note-success { border-left-color: #10b981; }
                    .sdox-note-info { border-left-color: var(--vscode-editorInfo-foreground); }
                    .note-icon { font-size: 1.2rem; flex-shrink: 0; }
                    .note-content { font-size: 0.9em; }
                    .sdox-list {
                        padding-left: 24px;
                        color: var(--vscode-descriptionForeground);
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .sdox-list-checklist {
                        list-style: none;
                        padding-left: 0;
                    }
                    .sdox-list-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 8px;
                    }
                    .sdox-list-item input[type="checkbox"] { margin-top: 5px; }
                    .sdox-code-wrapper {
                        margin: 8px 0;
                        background: var(--vscode-textCodeBlock-background);
                        padding: 12px;
                        border-radius: 6px;
                    }
                    pre { margin: 0; }
                    code { font-family: var(--vscode-editor-font-family); }
                    .sdox-generic-block {
                        padding: 12px;
                        border: 1px dashed var(--vscode-widget-border);
                        border-radius: 6px;
                        background: rgba(255, 255, 255, 0.02);
                    }
                    .generic-label {
                        display: inline-block;
                        font-family: var(--vscode-editor-font-family);
                        font-size: 0.8em;
                        color: var(--vscode-descriptionForeground);
                        margin-bottom: 8px;
                    }
                </style>
            </head>
            <body>
                ${body}
            </body>
            </html>`;
    }

    public dispose() {
        PreviewPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
