import * as vscode from 'vscode';
import axios from 'axios';

interface Issue {
    line: number;
    message: string;
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

    // Register commands
    context.subscriptions.push(analyzeCommand);
    
    // Status bar button
    const statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarButton.text = "$(beaker) Analyze Code";
    statusBarButton.command = "extension.analyzeCode";
    statusBarButton.show();
    context.subscriptions.push(statusBarButton);


    // CodeLens provider
    class CodeAnalyzerCodeLensProvider implements vscode.CodeLensProvider {
        async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
            const code = document.getText();

            try {
                const response = await axios.post('http://127.0.0.1:5000/analyze', { code });
                const styleGuide = response.data.style_guide;

                if (styleGuide && Array.isArray(styleGuide.issues)) {
                    return styleGuide.issues.map((issue: Issue) => {
                        const line = issue.line - 1; // Adjust for zero-based indexing
                        const range = new vscode.Range(line, 0, line, 0); // Start of the line

                        return new vscode.CodeLens(range, {
                            title: issue.message, // Display the full issue message
                            command: 'extension.showIssueDetails', 
                            arguments: [issue] 
                        });
                    });
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Error during code analysis: ${error}`);
            }

            return []; 
        }
    }
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider('*', new CodeAnalyzerCodeLensProvider()) // * for all languages
    );

    // Command to show issue details when CodeLens is clicked
    vscode.commands.registerCommand('extension.showIssueDetails', (issue) => {
        outputChannel.clear(); 
        outputChannel.appendLine("Issue Details:");
        outputChannel.appendLine(`Line ${issue.line}: ${issue.message}`);
        outputChannel.show(); 
    });

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            const codeLensProvider = new CodeAnalyzerCodeLensProvider();
            codeLensProvider.provideCodeLenses(editor.document); 
        }
    }, null, context.subscriptions);
}


export function deactivate() {}