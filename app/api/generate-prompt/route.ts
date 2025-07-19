import { NextResponse } from "next/server"
import { generatePromptWithOpenAI, generatePromptWithGemini } from "@/lib/ai-services"

export async function POST(request: Request) {
  try {
    const { provider = "openai" } = await request.json()

    let result
    if (provider === "gemini") {
      result = await generatePromptWithGemini()
    } else {
      result = await generatePromptWithOpenAI()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating prompt:", error)
    return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 })
  }
}
