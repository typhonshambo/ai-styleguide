import * as vscode from 'vscode';
import axios from 'axios';
import { updateDiagnostics } from './updateDiagnostics';
import { getLogger } from './logger';
import { getSeverity } from './utils';

const log = getLogger('analyzeCode');

interface Issue {
    line: number;
    message: string;
    start_char: number;
    end_char: number;
    severity: string;
}

let analyzedDocuments: Map<string, Issue[]> = new Map();
const diagnosticCollection = vscode.languages.createDiagnosticCollection('codeAnalyzer');

function updateStatusBar(statusBarButton: vscode.StatusBarItem, text: string) {
    statusBarButton.text = text;
    statusBarButton.show();
}

function setStatusBarButtonEnabled(statusBarButton: vscode.StatusBarItem, enabled: boolean) {
    statusBarButton.command = enabled ? 'extension.analyzeCode' : undefined;
}

export const analyzeCommand = (statusBarButton: vscode.StatusBarItem) => vscode.commands.registerCommand('extension.analyzeCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const document = editor.document;
    const code = document.getText();
    const lines = code.split('/n')
    const outputChannel = vscode.window.createOutputChannel("Code Analyzer");

    try {
        // Disable the button
        setStatusBarButtonEnabled(statusBarButton, false);
        
        // Change status bar item to spinning wheel
        updateStatusBar(statusBarButton, "$(sync~spin) Analyzing...");

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Analyzing Code...",
            cancellable: false
        }, async (progress) => {
            const response = await axios.post('http://127.0.0.1:8000/analyze', { lines });
            const styleGuide = response.data.style_guide;

            outputChannel.clear();
            outputChannel.appendLine("Code Analysis Results:");

            if (styleGuide && Array.isArray(styleGuide.issues)) {
                vscode.window.showInformationMessage('Code analysis complete!');

                // Store issues for the current document
                analyzedDocuments.set(document.uri.toString(), styleGuide.issues);
                // Update diagnostics
                updateDiagnostics(document, styleGuide.issues, diagnosticCollection);
            } else {
                vscode.window.showErrorMessage('Code analysis failed or returned unexpected results.');
            }
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            updateStatusBar(statusBarButton, "$(check) Analysis Complete");
            outputChannel.appendLine("Error connecting to the server.");
            vscode.window.showErrorMessage(`Error connecting to the analysis server: ${error.message}`);
        } else {
            updateStatusBar(statusBarButton, "$(chrome-close) Analysis Failed");
            outputChannel.appendLine("An unexpected error occurred during code analysis.");
            vscode.window.showErrorMessage(`Code analysis failed: ${error}`);
        }
        log.appendLine("Error during code analysis: " + error);
    } finally {
        // Re-enable the button and change status bar item back to the original text
        updateStatusBar(statusBarButton, "$(beaker) Analyze Code");
        setStatusBarButtonEnabled(statusBarButton, true);
    }
});
