// llama3.js
const Groq = require("groq-sdk");

async function getGroqChatCompletion(API_KEY, prompt) {
  try {
    const groq = new Groq({ apiKey: API_KEY });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt, // Dynamically pass the prompt
        },
      ],
      model: "llama3-8b-8192", // Change the model as needed
    });

    return parseGeneratedText(chatCompletion.choices[0]?.message?.content || "");
  } catch (error) {
    console.error("Error getting chat completion:", error);
    throw error;
  }
}

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

module.exports = { getGroqChatCompletion };
