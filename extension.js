const vscode = require('vscode');

const { textGenTextOnlyPromptStreaming } = require('./llm_models/gemini');


const conversationalLLMs = [
	{ name: 'gemini-1.5-flash', func : textGenTextOnlyPromptStreaming},
	
];

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	
	console.log('Congratulations, your extension "llms-ide-plugin" is now active!');

	
	const disposable = vscode.commands.registerCommand('llms-ide-plugin.helloWorld', function () {
		
		vscode.window.showInformationMessage("Running extension........");
		
		const panel = vscode.window.createWebviewPanel(
			'llmExtension', // Identifies the type of the webview
			'LLM Model Selector', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{
				// Enable scripts and set localResourceRoots for security
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.joinPath(context.extensionUri, 'media')
				]
			}
		);

		const savedApiKey = context.globalState.get('geminiApiKey', '');
        
        // panel.webview.html = getWebviewContent(savedApiKey);
		// Set the webview's HTML content
		panel.webview.html = getWebviewContent(panel.webview, context.extensionUri,savedApiKey);

		panel.webview.onDidReceiveMessage(async message => {
            if (message.command === 'saveApiKey') {

                context.globalState.update('geminiApiKey', message.apiKey);
                vscode.window.showInformationMessage('API Key saved.');
            } else if (message.command === 'generateText') {
                const apiKey = message.apiKey || savedApiKey;
                const modelName = selectLLM(message.modelName);
                const prompt = message.prompt;

                if (!apiKey) {
                    vscode.window.showErrorMessage('API Key is required!');
                    return;
                }

				// Notify the webview to show the loading indicator
				panel.webview.postMessage({ command: 'showLoading' });
                // Call the gemini function
                try {
                    const responseText=await modelName.func(apiKey, prompt);
					console.log("RESPONSE TEXT........",responseText);
					panel.webview.postMessage({ command: 'displayGeneratedText', text: responseText });
                    // vscode.window.showInformationMessage('Text generation completed.');
                } catch (error) {
                    vscode.window.showErrorMessage('Error generating text: ' + error.message);
                }
            }
        });


	});

	context.subscriptions.push(disposable);
}
// Function to select a model by name
function selectLLM(selection) {
	const llm = conversationalLLMs.find(model => model.name === selection);
	if (!llm) {
		console.error('Model not found:', selection);
	}
	return llm;
}

// Function to get the webview content
function getWebviewContent(webview, extensionUri,apiKey) {
	// Get URIs for the external CSS and JS files
	const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'styles.css'));
	const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'script.js'));

	

	// Generate options for the dropdown
	const modelOptions = conversationalLLMs.map(llm => `<option value="${llm.name}">${llm.name}</option>`).join('\n');
	
	return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LLM Model Selector</title>
        <link href="${cssUri}" rel="stylesheet" />
    </head>
    <body>
        <h1>Generative AI LLMs</h1>

		<label for="model">Select Model:</label>
		<select id="model" required>
			<option value="" disabled selected>Select a model</option>
			${modelOptions}
			
		</select>

		<div id="apiKeyContainer">
			<label for="apikey">API Key:</label>
			<input type="password" id="apikey" placeholder="Enter your API key">
			<button id="save">Save API Key</button>
    	</div>
		<label for="prompt">Prompt:</label>
		<input type="text" id="prompt" placeholder="Enter your prompt">

		<button id="generate">Generate Text</button>

		<!-- Loading Indicator -->
		<div id="loading" class="hidden">
			<div class="spinner"></div>
			<span>Generating text, please wait...</span>
		</div>

		 <!-- Output Area for Generated Text -->
		<label for="output">Generated Text:</label>
		<textarea id="output" rows="10" cols="80" readonly></textarea>

		<script  src="${scriptUri}"></script>
    </body>
    </html>`;
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
