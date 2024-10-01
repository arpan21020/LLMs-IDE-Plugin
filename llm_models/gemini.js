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
        return generatedText;
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

module.exports = { textGenTextOnlyPromptStreaming };
