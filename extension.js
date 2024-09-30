const vscode = require('vscode');



/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	
	console.log('Congratulations, your extension "llms-ide-plugin" is now active!');

	
	const disposable = vscode.commands.registerCommand('llms-ide-plugin.helloWorld', function () {
		
		vscode.window.showInformationMessage('Hello World from llms IDE plugin!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
