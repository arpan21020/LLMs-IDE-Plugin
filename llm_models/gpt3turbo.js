const axios = require('axios');

// Set environment variables
process.env.OPENAI_API_KEY = 'ee8f6da682bc44f6ae468b5beb01a509';
process.env.OPENAI_API_TYPE = 'azure';
process.env.OPENAI_API_VERSION = '2023-03-15-preview';
process.env.OPENAI_API_BASE = 'https://ai-test-rajat.openai.azure.com/';

// const apiKey = process.env.OPENAI_API_KEY;
const endpoint = process.env.OPENAI_API_BASE; // Azure OpenAI base URL
const apiVersion = process.env.OPENAI_API_VERSION; // API version (e.g., 2023-03-15-preview)
const deploymentName = "gpt-35-turbo-0613"; // Your Azure deployment name

// Define a prompt variable
// const prompt = "const configuration = new Configuration({TypeError: Configuration is not a constructor?"; // You can change this to any dynamic input

// Example function to call the Azure OpenAI API
async function callAzureOpenAI(apiKey,prompt) {
  const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

  const headers = {
    'Content-Type': 'application/json',
    'api-key': apiKey,
  };

  const data = {
    messages: [
      { role: "system", content: "You are an AI assistant." },
      { role: "user", content: prompt } // Use the prompt variable here
    ],
    max_tokens: 100,
    temperature: 0.7
  };

  try {
    const response = await axios.post(url, data, { headers });
    return parseGeneratedText(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error with Azure OpenAI API request:", error.response ? error.response.data : error.message);
  }
};

function parseGeneratedText(generatedText) {
  // Basic parsing to convert text into HTML with bullet points, bold text, code blocks
  // This is a simple parser and can be extended based on AI's output format

  // Handle bullet points (lines starting with '-')
  let htmlContent = generatedText
      .replace(/(?:^|\n)- (.*?)(?=\n|$)/g, '<li>$1</li>') // Convert bullet points into list items
      .replace(/(?:^|\n)# (.*?)(?=\n|$)/g, '<h2>$1</h2>') // Convert headings starting with '#' to <h2>
      .replace(/(?:^|\n)```(.*?)(?:```|$)/gs, '<pre><code>$1</code></pre>') // Code blocks between ``` to <pre><code>
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Convert **bold** to <b>
      .replace(/\n/g, '<br>'); // Replace newlines with <br> for better readability
  console.log(htmlContent);
  return htmlContent;
}


module.exports={callAzureOpenAI}