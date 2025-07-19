import { NextResponse } from "next/server"
import { scoreDrawingWithOpenAI, scoreDrawingWithGemini } from "@/lib/ai-services"

// AI scoring endpoint: Gemini is default, OpenAI is available for future use (see comments below)
export async function POST(request: Request) {
  try {
    const { imageData, prompt, provider } = await request.json()

    if (!imageData || !prompt) {
      return NextResponse.json({ error: "Missing imageData or prompt" }, { status: 400 })
    }

    let result
    // Default to Gemini if no provider specified
    if (!provider || provider === "gemini") {
      result = await scoreDrawingWithGemini(imageData, prompt)
    } 
    // Uncomment below to enable OpenAI as a selectable provider in the future
    /*
    else if (provider === "openai") {
      result = await scoreDrawingWithOpenAI(imageData, prompt)
    }
    */
    else {
      // fallback to Gemini if provider is not recognized
      result = await scoreDrawingWithGemini(imageData, prompt)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error scoring drawing:", error)
    return NextResponse.json({ error: "Failed to score drawing" }, { status: 500 })
  }
}
