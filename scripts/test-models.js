const { GoogleGenerativeAI } = require("@google/generative-ai");

async function list() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    // Note: The SDK might not have a direct listModels yet in all versions
    // or it's on a different object.
    // But we can try to hit a known model.
    console.log("Checking gemini-1.5-flash...");
    const m1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const r1 = await m1.generateContent("test");
    console.log("gemini-1.5-flash works!");
    
    console.log("Checking gemini-2.0-flash...");
    const m2 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const r2 = await m2.generateContent("test");
    console.log("gemini-2.0-flash works!");

    console.log("Checking gemini-2.0-flash-exp...");
    const m3 = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const r3 = await m3.generateContent("test");
    console.log("gemini-2.0-flash-exp works!");
  } catch (e) {
    console.error("Error:", e.message);
  }
}

list();
