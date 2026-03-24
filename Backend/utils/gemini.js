import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(message);
    const response = await result.response;

    return response.text();

  } catch (error) {
    console.log("Gemini error:", error);
    return "AI response failed";
  }
};

export default getGeminiResponse;
