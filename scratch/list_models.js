require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai")

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.log("No GEMINI_API_KEY")
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(API_KEY)

async function getAvailableModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    console.log("AVAILABLE MODELS:");
    if (data.models) {
      data.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).forEach(m => {
        console.log(`- ${m.name}`);
      });
    } else {
      console.log('No models returned', data);
    }
  } catch (e) {
    console.error("Error listing models", e)
  }
}

getAvailableModels()
