// gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function textGenTextOnlyPromptStreaming(API_KEY, prompt) {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
        const result = await model.generateContentStream(prompt);
      
        let generatedText = '';
        // Print text as it comes in.
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            generatedText += chunkText;
            // process.stdout.write(chunkText);
        }
        return parseGeneratedText(generatedText);
    } catch (error) {
        console.error("Error generating content:", error);
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

module.exports = { textGenTextOnlyPromptStreaming };
