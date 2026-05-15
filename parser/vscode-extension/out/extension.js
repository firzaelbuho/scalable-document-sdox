"use strict";
/**
 * SDOX Tool — VS Code Extension Entry Point
 *
 * Registers:
 * - Syntax highlighting (via TextMate grammar in package.json)
 * - IntelliSense completion provider
 * - Hover documentation provider
 * - Live Preview commands
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const CompletionProvider_1 = require("./providers/CompletionProvider");
const HoverProvider_1 = require("./providers/HoverProvider");
const PreviewPanel_1 = require("./preview/PreviewPanel");
function activate(context) {
    console.log('SDOX Tool extension activated');
    const sdoxSelector = { language: 'sdox' };
    // Register IntelliSense Completion Provider
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(sdoxSelector, new CompletionProvider_1.SdoxCompletionProvider(), '#', '(', ',', '='));
    // Register Hover Provider
    context.subscriptions.push(vscode.languages.registerHoverProvider(sdoxSelector, new HoverProvider_1.SdoxHoverProvider()));
    // Register Preview Commands
    context.subscriptions.push(vscode.commands.registerCommand('sdox.showPreview', () => {
        PreviewPanel_1.PreviewPanel.createOrShow(context.extensionUri, false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('sdox.showPreviewToSide', () => {
        PreviewPanel_1.PreviewPanel.createOrShow(context.extensionUri, true);
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map