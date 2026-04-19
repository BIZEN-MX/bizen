const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return;
  
  try {
    const genAI = new GoogleGenerativeAI(key);
    // There is no listModels on GoogleGenerativeAI itself? 
    // Usually, you use the REST API for that.
    // But let's try a simpler model like gemini-pro.
    
    console.log("Trying gemini-pro...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Test");
    console.log("gemini-pro SUCCESS");
  } catch (err) {
    console.error("gemini-pro failed:", err.message);
  }

  try {
    console.log("Trying gemini-1.5-pro...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent("Test");
    console.log("gemini-1.5-pro SUCCESS");
  } catch (err) {
    console.error("gemini-1.5-pro failed:", err.message);
  }
}

listModels();
