"use client"

import { useState } from "react"
import { generateAIPrompt, scoreDrawingWithAI } from "@/lib/ai-services"
import type { Scores } from "@/types"

export function useAI() {
  const [prompt, setPrompt] = useState("Alien riding a giraffe in a neon city")
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isScoring, setIsScoring] = useState(false)

  const generateNewPrompt = async () => {
    setIsGeneratingPrompt(true)
    try {
      const newPrompt = await generateAIPrompt()
      setPrompt(newPrompt)
    } catch (error) {
      console.error("Error generating prompt:", error)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const scoreDrawing = async (imageData: string, promptText: string): Promise<Scores | null> => {
    setIsScoring(true)
    try {
      const scores = await scoreDrawingWithAI(imageData, promptText)
      return scores
    } catch (error) {
      console.error("Error scoring drawing:", error)
      return null
    } finally {
      setIsScoring(false)
    }
  }

  return {
    prompt,
    isGeneratingPrompt,
    generateNewPrompt,
    isScoring,
    scoreDrawing,
  }
}
