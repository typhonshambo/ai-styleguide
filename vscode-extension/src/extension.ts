import * as vscode from 'vscode';
import axios from 'axios';

interface Issue {
  line: number;
  message: string;
}

let analyzedDocuments: Map<string, Issue[]> = new Map();

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
        
        // Manually trigger CodeLens refresh
        vscode.languages.registerCodeLensProvider({ scheme: 'file', language: document.languageId }, new CodeAnalyzerCodeLensProvider(document.uri));
        
        // Refresh CodeLenses
        vscode.commands.executeCommand('vscode.executeCodeLensProvider', document.uri);
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

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Code Analyzer");
  context.subscriptions.push(outputChannel);

  context.subscriptions.push(analyzeCommand);

  const statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarButton.text = "$(beaker) Analyze Code";
  statusBarButton.command = "extension.analyzeCode";
  statusBarButton.show();
  context.subscriptions.push(statusBarButton);

  vscode.commands.registerCommand('extension.showIssueDetails', (issue) => {
    outputChannel.clear();
    outputChannel.appendLine("Issue Details:");
    outputChannel.appendLine(`Line ${issue.line}: ${issue.message}`);
    outputChannel.show();
  });

  vscode.workspace.onDidOpenTextDocument((document) => {
    // Clear CodeLenses for other documents
    if (!analyzedDocuments.has(document.uri.toString())) {
      vscode.commands.executeCommand('vscode.executeCodeLensProvider', document.uri);
    }
  });
}

class CodeAnalyzerCodeLensProvider implements vscode.CodeLensProvider {
  private documentUri: vscode.Uri;

  constructor(documentUri: vscode.Uri) {
    this.documentUri = documentUri;
  }

  async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
    if (document.uri.toString() !== this.documentUri.toString()) {
      return [];
    }

    const issues = analyzedDocuments.get(document.uri.toString());
    if (!issues) {
      return [];
    }

    return issues.map((issue: Issue) => {
      const line = issue.line - 1;
      const range = new vscode.Range(line, 0, line, 0);

      return new vscode.CodeLens(range, {
        title: issue.message,
        command: 'extension.showIssueDetails',
        arguments: [issue]
      });
    });
  }
}

export function deactivate() {
  analyzedDocuments.clear();
}
