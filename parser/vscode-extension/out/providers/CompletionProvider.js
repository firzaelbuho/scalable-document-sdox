"use strict";
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
exports.SdoxCompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SdoxCompletionProvider {
    tags = [];
    constructor(context) {
        this.loadTags(context);
    }
    loadTags(context) {
        try {
            // Find the tags.json file. In our workspace it's at docs/tags/0.1.0.json
            // We'll hardcode the path relative to the workspace root for now since it's a monorepo structure.
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders) {
                const rootPath = workspaceFolders[0].uri.fsPath;
                const tagsPath = path.join(rootPath, 'docs', 'tags', '0.1.0.json');
                if (fs.existsSync(tagsPath)) {
                    const data = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
                    this.tags = data.categories.flatMap((cat) => cat.tags);
                }
            }
        }
        catch (e) {
            console.error('Failed to load SDOX tags', e);
        }
    }
    provideCompletionItems(document, position, token, context) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        // Suggest tags after '#'
        if (linePrefix.endsWith('#')) {
            return this.tags.map(tag => {
                const item = new vscode.CompletionItem(tag.name, vscode.CompletionItemKind.Keyword);
                item.detail = "SDOX Tag";
                item.documentation = new vscode.MarkdownString(tag.description);
                // Add attributes snippet if there are any required attributes
                const requiredAttrs = tag.attributes?.filter((a) => a.required) || [];
                if (requiredAttrs.length > 0) {
                    const snippetParams = requiredAttrs.map((a, idx) => `${a.name}="\${${idx + 1}}"`).join(", ");
                    item.insertText = new vscode.SnippetString(`${tag.name}(${snippetParams})`);
                }
                else {
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
                    return tagDef.attributes.map((attr) => {
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
exports.SdoxCompletionProvider = SdoxCompletionProvider;
//# sourceMappingURL=CompletionProvider.js.map