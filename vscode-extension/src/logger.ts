import * as vscode from 'vscode';

export function getLogger(module: string): vscode.OutputChannel {
  return vscode.window.createOutputChannel(`[${module}]`);
}
