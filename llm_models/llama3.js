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

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error getting chat completion:", error);
    throw error;
  }
}

module.exports = { getGroqChatCompletion };
