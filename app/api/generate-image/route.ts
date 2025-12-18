// app/api/generate-image/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize the client with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Call the model using the syntax from your docs
    // FIX: Removed the 'config' block that caused the JSON mode error
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    const candidates = response.candidates;
    
    if (!candidates || candidates.length === 0) {
        throw new Error("No candidates returned from Gemini.");
    }

    const parts = candidates[0].content?.parts;

    // Search for the part containing the image (inlineData)
    const imagePart = parts?.find((part) => part.inlineData);

    if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
        console.error("No image found in response parts:", parts);
        return new NextResponse("Model generated text but no image", { status: 500 });
    }

    // Extract the Base64 string
    const base64Image = imagePart.inlineData.data;

    // Return it to the frontend
    return NextResponse.json({ b64: base64Image });

  } catch (error: any) {
    console.error("[IMAGE_GENERATE_ERROR]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}