const vscode = require('vscode');
const { textGenTextOnlyPromptStreaming } = require('./llm_models/gemini');
const { getGroqChatCompletion } = require('./llm_models/llama3');
const { callAzureOpenAI } = require('./llm_models/gpt3turbo');

const conversationalLLMs = [
	{ name: 'gemini-1.5-flash', func: textGenTextOnlyPromptStreaming },
	{ name: 'llama3-8b-8192', func: getGroqChatCompletion },
	{ name: 'gpt-35-turbo-0613', func: callAzureOpenAI },
];

/**
 * LLMWebviewProvider class implements vscode.WebviewViewProvider
 */
class LLMWebviewProvider {
	constructor(context) {
		this.context = context;
	}

	// This method is called when the webview is created or becomes visible
	resolveWebviewView(webviewView) {
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'media')]
		};

		// Set the webview's HTML content
		webviewView.webview.html = this.getWebviewContent(webviewView.webview, this.context.extensionUri);

		// Handle messages from the webview
		webviewView.webview.onDidReceiveMessage(async (message) => {
			if (message.command === 'getApiKey') {
				const apiKey = this.context.globalState.get(message.modelName, '');
				// Send the API key back to the webview
				webviewView.webview.postMessage({ command: 'loadApiKey', apiKey });
			} else if (message.command === 'saveApiKey') {
				this.context.globalState.update(message.modelName, message.apiKey);
				vscode.window.showInformationMessage(`API Key for ${message.modelName} saved.`);
			} else if (message.command === 'generateText') {
				const apiKey = message.apiKey || this.context.globalState.get(message.modelName, '');
				const prompt = message.prompt;

				if (!apiKey) {
					vscode.window.showErrorMessage('API Key is required!');
					return;
				}

				// Show loading indicator
				webviewView.webview.postMessage({ command: 'showLoading' });

				try {
					const selectedModel = conversationalLLMs.find(model => model.name === message.modelName);
					const responseText = await selectedModel.func(apiKey, prompt);
					webviewView.webview.postMessage({ command: 'displayGeneratedText', text: responseText });
				} catch (error) {
					vscode.window.showErrorMessage('Error generating text: ' + error.message);
				}
			}
		});
	}

	// Get the HTML content for the webview
	getWebviewContent(webview, extensionUri) {
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
				<div id="output"></div>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "llms-ide-plugin" is now active!');

	// Register the webview provider
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'llms-ide-plugin.webview',
			new LLMWebviewProvider(context)
		)
	);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
