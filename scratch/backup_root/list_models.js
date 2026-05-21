const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  try {
    const url = "https://generativelanguage.googleapis.com/v1/models?key=" + process.env.GEMINI_API_KEY;
    const https = require('https');
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const json = JSON.parse(data);
        console.log("AVAILABLE MODELS:");
        json.models?.forEach(m => console.log(m.name));
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  } catch (err) {
    console.error(err);
  }
}
list();
