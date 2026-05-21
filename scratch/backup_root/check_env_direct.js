const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log("Checking .env file directly:");
console.log("GEMINI_API_KEY exists:", !!envConfig.GEMINI_API_KEY);
if (envConfig.GEMINI_API_KEY) {
  console.log("Length:", envConfig.GEMINI_API_KEY.length);
  console.log("Ends with dot:", envConfig.GEMINI_API_KEY.endsWith('.'));
}
