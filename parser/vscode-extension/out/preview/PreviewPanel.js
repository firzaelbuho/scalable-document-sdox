"use strict";
/**
 * SDOX Live Preview Panel
 *
 * WebView panel that renders a live preview of the active SDOX document.
 * Updates automatically when the document changes (debounced).
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewPanel = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const sdoxParser_1 = require("../sdoxParser");
const sdoxRenderer_1 = require("../sdoxRenderer");
class PreviewPanel {
    static createOrShow(extensionUri, toSide = true) {
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
        const panel = vscode.window.createWebviewPanel(PreviewPanel.viewType, `Preview: ${fileName}`, column, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [extensionUri]
        });
        const previewPanel = new PreviewPanel(panel, extensionUri, docUri);
        PreviewPanel.panels.set(docUri, previewPanel);
    }
    constructor(panel, extensionUri, documentUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._documentUri = documentUri;
        this._updatePreview();
        this._disposables.push(vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === this._documentUri) {
                this._debouncedUpdate();
            }
        }));
        this._disposables.push(vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && editor.document.languageId === 'sdox') {
                const newUri = editor.document.uri.toString();
                if (newUri !== this._documentUri) {
                    this._documentUri = newUri;
                    const fileName = path.basename(editor.document.fileName);
                    this._panel.title = `Preview: ${fileName}`;
                    this._updatePreview();
                }
            }
        }));
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    _debouncedUpdate() {
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }
        this._debounceTimer = setTimeout(() => { this._updatePreview(); }, 300);
    }
    _updatePreview() {
        const doc = vscode.workspace.textDocuments.find(d => d.uri.toString() === this._documentUri);
        if (!doc) {
            return;
        }
        const sdoxText = doc.getText();
        const ast = (0, sdoxParser_1.parseSdox)(sdoxText);
        const html = (0, sdoxRenderer_1.renderDocument)(ast);
        this._panel.webview.html = this._getFullHtml(html);
    }
    _getFullHtml(bodyHtml) {
        const stylesPath = path.join(this._extensionUri.fsPath, 'src', 'preview', 'previewStyles.css');
        let css = '';
        try {
            css = fs.readFileSync(stylesPath, 'utf-8');
        }
        catch {
            try {
                css = fs.readFileSync(path.join(this._extensionUri.fsPath, 'out', 'preview', 'previewStyles.css'), 'utf-8');
            }
            catch {
                css = '/* styles not found */';
            }
        }
        const nonce = this._getNonce();
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; img-src ${this._panel.webview.cspSource} https: data:; font-src https:;">
    <title>SDOX Preview</title>
    <style nonce="${nonce}">${css}</style>
</head>
<body>
    <div class="sdox-preview-container">${bodyHtml}</div>
</body>
</html>`;
    }
    _getNonce() {
        let text = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return text;
    }
    dispose() {
        PreviewPanel.panels.delete(this._documentUri);
        this._panel.dispose();
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }
        while (this._disposables.length) {
            const d = this._disposables.pop();
            if (d) {
                d.dispose();
            }
        }
    }
}
exports.PreviewPanel = PreviewPanel;
PreviewPanel.viewType = 'sdoxPreview';
PreviewPanel.panels = new Map();
//# sourceMappingURL=PreviewPanel.js.map