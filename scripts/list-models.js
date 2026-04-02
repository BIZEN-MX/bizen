const { GoogleGenerativeAI } = require("@google/generative-ai");

async function list() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
     // We use a low level fetch logic to call the listModels endpoint
     const key = process.env.GEMINI_API_KEY;
     const fetch = require('node-fetch'); // assuming it's available or use native one if available
     const response = await (fetch || global.fetch)(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
     const data = await response.json();
     console.log("AVAILABLE MODELS (v1):", (data.models || []).map(m => m.name));
     
     const responseBeta = await (fetch || global.fetch)(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
     const dataBeta = await responseBeta.json();
     console.log("AVAILABLE MODELS (v1beta):", (dataBeta.models || []).map(m => m.name));
  } catch (e) {
    console.error("Error:", e.message);
  }
}

list();
