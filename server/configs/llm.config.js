import Openai from "openai";
console.log(process.env.GEMINI_API_KEY);

const openai = new Openai({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  timeout: 120 * 1000,
  maxRetries:3
});

export { openai };