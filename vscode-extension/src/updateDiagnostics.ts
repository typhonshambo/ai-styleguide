import * as vscode from 'vscode';
import { getSeverity } from './utils';

interface Issue {
  line: number;
  message: string;
  start_char: number;
  end_char: number;
  severity: string;
}

export function updateDiagnostics(document: vscode.TextDocument, issues: Issue[], diagnosticCollection: vscode.DiagnosticCollection) {
  const diagnostics: vscode.Diagnostic[] = issues.map(issue => {
    const range = new vscode.Range(new vscode.Position(issue.line - 1, issue.start_char), new vscode.Position(issue.line - 1, issue.end_char));
    const diagnostic = new vscode.Diagnostic(range, issue.message, getSeverity(issue.severity));
    diagnostic.source = 'Style Guide AI';
    return diagnostic;
  });

  diagnosticCollection.set(document.uri, diagnostics);
}
