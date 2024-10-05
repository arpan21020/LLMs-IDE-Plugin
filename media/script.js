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
            outputArea.innerHTML = text;
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
                vscode.postMessage({ command: 'showError', message: message.message });
                break;
            case 'showLoading':
                showLoading();
                break;
            case 'loadApiKey':
                document.getElementById('apikey').value = message.apiKey; // Populate API key field when received
                break;
            // Handle other messages if needed
        }
    });

    // On page load, check if the API key is already saved
    window.addEventListener('DOMContentLoaded', () => {
        const modelSelect = document.getElementById('model');

        // Event listener for when a model is selected from the dropdown
        modelSelect.addEventListener('change', () => {
            const selectedModel = modelSelect.value;
            if (selectedModel) {
                showApiKeyContainer(); // Show the API key container when a model is selected
                vscode.postMessage({ command: 'getApiKey', modelName: selectedModel }); // Ask for API key for the selected model
            }
        });

        // If the model is preselected (already stored), load its API key
        if (modelSelect.value) {
            vscode.postMessage({ command: 'getApiKey', modelName: modelSelect.value });
        }
    });

    // Event listener for saving the API key
    document.getElementById('save').addEventListener('click', () => {
        const apiKey = document.getElementById('apikey').value;
        const modelName = document.getElementById('model').value; // Use selected model

        if (apiKey.trim() === '') {
            vscode.postMessage({ command: 'showError', message: 'API Key cannot be empty!' });
            return;
        }
        // Save the API key for the selected model
        vscode.postMessage({ command: 'saveApiKey', apiKey, modelName });
    });

    // Event listener for generating text
    document.getElementById('generate').addEventListener('click', () => {
        const apiKey = document.getElementById('apikey').value;
        const modelName = document.getElementById('model').value; // Pass the selected model to generate
        const prompt = document.getElementById('prompt').value;

        vscode.postMessage({ command: 'generateText', apiKey, modelName, prompt });
        showLoading(); // Show loading indicator when generation starts
    });
})();
