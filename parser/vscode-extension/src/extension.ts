import * as vscode from 'vscode';
import { SdoxCompletionProvider } from './providers/CompletionProvider';
import { PreviewPanel } from './preview/PreviewPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('SDOX Tool extension is now active');

    // Register IntelliSense Completion Provider
    const completionProvider = new SdoxCompletionProvider(context);
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: 'sdox' },
            completionProvider,
            '#', '(', ',' // Trigger characters
        )
    );

    // Register Command to Open Live Preview
    context.subscriptions.push(
        vscode.commands.registerCommand('sdox.showPreview', () => {
            PreviewPanel.createOrShow(context.extensionUri);
        })
    );
}

export function deactivate() {}
