import * as vscode from 'vscode';
import { analyzeCommand } from './analyzeCode';
import { getLogger } from './logger';

const log = getLogger('extension');

let analyzedDocuments: Map<string, any[]> = new Map();
const diagnosticCollection = vscode.languages.createDiagnosticCollection('codeAnalyzer');

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Code Analyzer");
  context.subscriptions.push(outputChannel);

  const statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarButton.text = "$(type-hierarchy-super) Analyze Code";
  statusBarButton.command = "extension.analyzeCode";
  statusBarButton.show();
  context.subscriptions.push(statusBarButton);

  const analyzeCmd = analyzeCommand(statusBarButton);
  context.subscriptions.push(analyzeCmd);

  context.subscriptions.push(diagnosticCollection);

  vscode.commands.registerCommand('extension.showIssueDetails', (issue) => {
    outputChannel.clear();
    outputChannel.appendLine("Issue Details:");
    outputChannel.appendLine(`Line ${issue.line}: ${issue.message}`);
    outputChannel.show();
  });

  vscode.workspace.onDidOpenTextDocument((document) => {
    // Clear diagnostics for other documents
    if (!analyzedDocuments.has(document.uri.toString())) {
      diagnosticCollection.delete(document.uri);
    }
  });
}

export function deactivate() {
  analyzedDocuments.clear();
  diagnosticCollection.clear();
}
