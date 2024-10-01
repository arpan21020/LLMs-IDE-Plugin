// media/script.js
(function () {
    const vscode = acquireVsCodeApi();

    // Function to hide the API Key container
    function hideApiKeyContainer() {
        const apiKeyContainer = document.getElementById('apiKeyContainer');
        if (apiKeyContainer) {
            apiKeyContainer.style.display = 'none';
        }
    }

    // Function to show the API Key container
    function showApiKeyContainer() {
        const apiKeyContainer = document.getElementById('apiKeyContainer');
        if (apiKeyContainer) {
            apiKeyContainer.style.display = 'block';
        }
    }

    // Function to display the generated text
    function displayGeneratedText(text) {
        const outputArea = document.getElementById('output');
        if (outputArea) {
            outputArea.value = text;
        }
    }

    // Function to show the loading indicator
    function showLoading() {
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.classList.remove('hidden');
        }
    }

    // Function to hide the loading indicator
    function hideLoading() {
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.classList.add('hidden');
        }
    }

    // Listen for messages from the extension
    window.addEventListener('message', event => {
        const message = event.data; // The JSON data our extension sent
        switch (message.command) {
            case 'apiKeySaved':
                hideApiKeyContainer();
                break;
            case 'displayGeneratedText':
                hideLoading(); // Hide loading indicator when text is received
                displayGeneratedText(message.text);
                break;
            case 'showError':
                hideLoading(); // Hide loading indicator in case of error
                vscode.window.showErrorMessage(message.message);
                break;
            case 'showLoading':
                showLoading();
                break;
            // Handle other messages if needed
        }
    });

    // On page load, check if the API key is already saved
    window.addEventListener('DOMContentLoaded', () => {
        if (window.hasApiKey) {
            hideApiKeyContainer();
        } else {
            showApiKeyContainer();
        }
    });

    // Event listener for saving the API key
    document.getElementById('save').addEventListener('click', () => {
        const apiKey = document.getElementById('apikey').value;
        if (apiKey.trim() === '') {
            vscode.postMessage({ command: 'showError', message: 'API Key cannot be empty!' });
            return;
        }
        vscode.postMessage({ command: 'saveApiKey', apiKey });
    });

    // Event listener for generating text
    document.getElementById('generate').addEventListener('click', () => {
        const apiKey = document.getElementById('apikey').value;
        const modelName = document.getElementById('model').value; // Currently unused in gemini.js
        const prompt = document.getElementById('prompt').value;

        vscode.postMessage({ command: 'generateText', apiKey, modelName, prompt });
        showLoading(); // Show loading indicator when generation starts
    });
})();
