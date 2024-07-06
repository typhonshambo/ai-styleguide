import * as vscode from 'vscode';
import axios from 'axios';

interface Issue {
  line: number;
  message: string;
}

let analyzedDocuments: Map<string, Issue[]> = new Map();
let diagnosticCollection: vscode.DiagnosticCollection;

// Command to analyze code
const analyzeCommand = vscode.commands.registerCommand('extension.analyzeCode', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const document = editor.document;
  const code = document.getText();
  const outputChannel = vscode.window.createOutputChannel("Code Analyzer");

  try {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Analyzing Code...",
      cancellable: false
    }, async (progress) => {
      const response = await axios.post('http://127.0.0.1:5000/analyze', { code });
      const styleGuide = response.data.style_guide;

      outputChannel.clear();
      outputChannel.appendLine("Code Analysis Results:");

      if (styleGuide && Array.isArray(styleGuide.issues)) {
        vscode.window.showInformationMessage('Code analysis complete!');

        // Store issues for the current document
        analyzedDocuments.set(document.uri.toString(), styleGuide.issues);
        
        // Update diagnostics
        updateDiagnostics(document, styleGuide.issues);
      } else {
        vscode.window.showErrorMessage('Code analysis failed or returned unexpected results.');
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      outputChannel.appendLine("Error connecting to the server.");
      vscode.window.showErrorMessage(`Error connecting to the analysis server: ${error.message}`);
    } else {
      outputChannel.appendLine("An unexpected error occurred during code analysis.");
      vscode.window.showErrorMessage(`Code analysis failed: ${error}`);
    }
  }
});

function updateDiagnostics(document: vscode.TextDocument, issues: Issue[]) {
  const diagnostics: vscode.Diagnostic[] = issues.map(issue => {
    const line = issue.line - 1;
    const range = new vscode.Range(line, 0, line, document.lineAt(line).range.end.character);
    const diagnostic = new vscode.Diagnostic(range, issue.message, vscode.DiagnosticSeverity.Warning);
    diagnostic.source = 'Code Analyzer';
    return diagnostic;
  });

  diagnosticCollection.set(document.uri, diagnostics);
}

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Code Analyzer");
  context.subscriptions.push(outputChannel);

  diagnosticCollection = vscode.languages.createDiagnosticCollection('codeAnalyzer');
  context.subscriptions.push(diagnosticCollection);

  context.subscriptions.push(analyzeCommand);

  const statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarButton.text = "$(beaker) Analyze Code";
  statusBarButton.command = "extension.analyzeCode";
  statusBarButton.show();
  context.subscriptions.push(statusBarButton);
}

export function deactivate() {
  analyzedDocuments.clear();
  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }
}
