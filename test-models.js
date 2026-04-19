const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function run() {
  // wait, the sdk might not have listModels exposed easily. Let's just fetch it via REST.
}
