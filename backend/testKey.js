// testKey.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testKey() {
  try {
    const response = await openai.models.list(); // simple call to check key
    console.log("✅ API key works! Models available:");
    response.data.forEach((model) => console.log(model.id));
  } catch (err) {
    console.error("❌ API key error:", err.message);
  }
}

testKey();