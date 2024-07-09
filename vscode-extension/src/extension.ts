import * as vscode from 'vscode';
import axios from 'axios';

interface Issue {
  line: number;
  message: string;
  start_char: number;
  end_char: number;
  severity: string;
}

let analyzedDocuments: Map<string, Issue[]> = new Map();
const diagnosticCollection = vscode.languages.createDiagnosticCollection('codeAnalyzer');

// Convert severity from string to DiagnosticSeverity
function getSeverity(severity: string): vscode.DiagnosticSeverity {
  switch (severity.toUpperCase()) {
    case 'ERROR':
      return vscode.DiagnosticSeverity.Error;
    case 'WARNING':
      return vscode.DiagnosticSeverity.Warning;
    case 'INFORMATION':
      return vscode.DiagnosticSeverity.Information;
    case 'HINT':
      return vscode.DiagnosticSeverity.Hint;
    default:
      return vscode.DiagnosticSeverity.Information;
  }
}

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
    const range = new vscode.Range(new vscode.Position(issue.line - 1, issue.start_char), new vscode.Position(issue.line - 1, issue.end_char));
    const diagnostic = new vscode.Diagnostic(range, issue.message, getSeverity(issue.severity));
    diagnostic.source = 'Code Analyzer';
    return diagnostic;
  });

  diagnosticCollection.set(document.uri, diagnostics);
}

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Code Analyzer");
  context.subscriptions.push(outputChannel);

  context.subscriptions.push(analyzeCommand);

  const statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarButton.text = "$(beaker) Analyze Code";
  statusBarButton.command = "extension.analyzeCode";
  statusBarButton.show();
  context.subscriptions.push(statusBarButton);

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
