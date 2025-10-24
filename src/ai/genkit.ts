'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Function to generate an image using Gemini 1.5 Flash
export async function generateImage(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Ask Gemini to generate an image
    const result = await model.generateContent([
      { text: prompt },
      { media: { mimeType: "image/png" } }
    ]);

    // Extract the generated image as Base64
    const imageBase64 = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!imageBase64) throw new Error("No image data returned from Gemini API");

    return `data:image/png;base64,${imageBase64}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Image generation failed. Check your Gemini API key or model name.");
  }
}
