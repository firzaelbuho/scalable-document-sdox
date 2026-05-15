/**
 * SDOX Tool — VS Code Extension Entry Point
 * 
 * Registers:
 * - Syntax highlighting (via TextMate grammar in package.json)
 * - IntelliSense completion provider
 * - Hover documentation provider
 * - Live Preview commands
 */

import * as vscode from 'vscode';
import { SdoxCompletionProvider } from './providers/CompletionProvider';
import { SdoxHoverProvider } from './providers/HoverProvider';
import { PreviewPanel } from './preview/PreviewPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('SDOX Tool extension activated');

    const sdoxSelector: vscode.DocumentSelector = { language: 'sdox' };

    // Register IntelliSense Completion Provider
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            sdoxSelector,
            new SdoxCompletionProvider(),
            '#', '(', ',', '='
        )
    );

    // Register Hover Provider
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            sdoxSelector,
            new SdoxHoverProvider()
        )
    );

    // Register Preview Commands
    context.subscriptions.push(
        vscode.commands.registerCommand('sdox.showPreview', () => {
            PreviewPanel.createOrShow(context.extensionUri, false);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sdox.showPreviewToSide', () => {
            PreviewPanel.createOrShow(context.extensionUri, true);
        })
    );
}

export function deactivate() {}
