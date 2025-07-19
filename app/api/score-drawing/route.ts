import { NextResponse } from "next/server"
import { scoreDrawingWithOpenAI, scoreDrawingWithGemini } from "@/lib/ai-services"

export async function POST(request: Request) {
  try {
    const { imageData, prompt, provider = "openai" } = await request.json()

    if (!imageData || !prompt) {
      return NextResponse.json({ error: "Missing imageData or prompt" }, { status: 400 })
    }

    let result
    if (provider === "gemini") {
      result = await scoreDrawingWithGemini(imageData, prompt)
    } else {
      result = await scoreDrawingWithOpenAI(imageData, prompt)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error scoring drawing:", error)
    return NextResponse.json({ error: "Failed to score drawing" }, { status: 500 })
  }
}
