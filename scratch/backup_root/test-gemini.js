const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function test() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Testing with key:", key ? key.substring(0, 5) + "..." : "MISSING");
  
  if (!key) return;
  
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hola, responde con solo una palabra: Test");
    const response = await result.response;
    console.log("Success! Response:", response.text());
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
