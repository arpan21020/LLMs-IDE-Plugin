

The "IDE Plugin for Large Language Model (LLM) Integration" project is aimed at enhancing the coding and development experience within integrated development environments (IDEs) by allowing seamless integration of LLM functionalities. With the exponential growth of artificial intelligence, LLMs like GPT-4 have shown tremendous potential in aiding developers by generating code snippets, providing explanations, auto-completing code, and more. This plugin was designed to leverage these powerful AI-driven tools directly from the IDE, making it more accessible and user-friendly for developers working across various programming languages.

The plugin supports VS-Code IDEs .Through simple API integration with providers like gpt-35-turbo-0613 , llama3 , gemini , this plugin allows developers to input their API key and interact directly with the LLM, generating text-based outputs based on their prompts. The overall objective was to simplify developer workflows by embedding advanced AI functionalities directly into the IDE, thus enhancing productivity and innovation. 



<h2>Installation</h2> 
<h3>1. Prerequisites:</h3>
Before installing the LLMs IDE Plugin, ensure that you have the following:
Visual Studio Code (VSCode): Make sure you have VSCode installed on your system. You can download it from Visual Studio Code.
Node.js and npm: The plugin is built using Node.js, so you need Node.js and npm (Node package manager) installed. You can download them from Node.js.

<h3>2. Clone the Repository:</h3>
Clone the plugin repository to your local machine using Git:

<h3>3. Install Dependencies:</h3>
After cloning the repository, navigate to the plugin's directory and run the following command to install the required npm packages:



This will install all the dependencies listed in the package.json file into the node_modules/ folder.

<h3>4. Build the Plugin:</h3>
If there are any build scripts defined in package.json, you may need to run them:




<h3>5. Open the Plugin in VSCode:</h3>
Open the project folder in VSCode:
Press F5 to launch a new VSCode window with the plugin loaded in the "Extension Development Host" mode.

<h3>6. Install the Plugin Locally:</h3>
To install the plugin locally:
Open the command palette in VSCode (Ctrl+Shift+P on Windows/Linux or Cmd+Shift+P on macOS).
Type Extensions: Install from VSIX... and select the option.
Browse to the directory where your extension is located and select the .vsix file (you may need to package the plugin using vsce package if it is not pre-packaged).
<h2>Configuration</h2> 
The LLMs IDE Plugin requires certain configurations to connect to various LLM APIs and customize how the models are used within the VSCode environment.
<h3>1. API Key Setup:</h3>
<li>The plugin requires API keys to connect to different language models such as Gemini, Llama3, and GPT-3 Turbo.</li>
<li>When the plugin is launched, it will display a field to input the API key for the selected model. Users must:</li>
<ol>
<li>Enter the API key into the provided input field.</li>
<li>Click Save API Key to store the API key securely within the VSCode global state.</li>
<ol>
The API key for each model can be updated at any time by selecting the model and entering a new API key.


<h2>2. Model Selection:</h2>
<ul>
<li>The plugin supports multiple LLMs, including:
    <ul>
    <li>gemini-1.5-flash</li>
    <li>llama3-8b-8192</li>
    <li>gpt-35-turbo-0613</li>
    </ul>
</li>
<li>Users can select a model from the dropdown menu in the UI. The corresponding API key for the selected model will be retrieved from the global state or prompted if not saved.</li>
<li>The user can then enter a prompt, and the plugin will send the prompt to the selected model for text generation.</li>
</ul>
<h2>3. Customizing Plugin Behavior:</h2>
The plugin includes several predefined models in the conversationalLLMs array within the extension.js file:


To add new models, users can modify this array by adding new entries with the model name and its corresponding API function.
If additional configuration or models are required, users can extend this array with new models and their associated API methods.
<h2>4. Webview Content Customization:</h2>
The webview content displayed to the user can be customized by editing the HTML template inside the getWebviewContent() function in extension.js.

 For instance:
Custom styles can be applied by modifying the linked CSS file in the media/ folder.
Additional input fields or UI elements can be added to further extend the plugin’s capabilities.
<h2>5. ESLint Configuration:</h2>
The project utilizes ESLint to enforce coding standards and improve code quality. The configuration file eslint.config.mjs supports CommonJS, Node.js, and Mocha environments, with the ECMA version set to 2022. Key rules include warnings for unused variables, reassignment of constants, and unreachable code, allowing developers to maintain clean and efficient code.

<h2>6. JSConfig Customization:</h2>
The project includes a jsconfig.json file, which configures JavaScript file handling in VSCode. It specifies Node16 as the module system and ES2022 as the target ECMAScript version, enabling modern features and type-checking. The checkJs option is enabled for error detection, while node_modules are excluded from type-checking.

<h1>Usage of Plugin</h1> 
<h2>Launching the Plugin:</h2>
<li>Open Visual Studio Code (VSCode) and navigate to the Command Palette by pressing Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (Mac).
<li>Type and select the command “LLMs IDE Plugin: Open” to launch the extension interface.

<h2>Selecting a Language Model:</h2>
<li>In the extension interface, a dropdown menu allows users to select from available LLMs, including Gemini, Llama 3, and GPT-3 Turbo.
<li>Choose a model to be used for text generation.
<h2>Configuring the API Key:</h2>
Enter your API key for the selected model in the API Key input field. Click on the “Save API Key” button to store the key securely.
<h2>Entering the Prompt:</h2>
 Type your desired prompt in the Prompt input field. This prompt serves as the input for the selected language model.
<h2>Generating Text:</h2>
<li>Click the “Generate Text” button to initiate the text generation process. A loading indicator will appear during the operation.
<li>The generated text will be displayed in the Generated Text area upon completion.
<h2>Error Handling:</h2>
If the API key is missing or if there are any errors during text generation, an error message will be shown to inform the user.
<h2>Usage Recommendations:</h2>
Ensure that the API keys used are valid and that any model-specific limitations are acknowledged for optimal performance.









