"use client"

import type React from "react"

import { useState, type RefObject } from "react"
import type { DrawingTool } from "@/types"

export function useCanvasDrawing(canvasRef: RefObject<HTMLCanvasElement>, tool: DrawingTool) {
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineWidth = tool.size
    ctx.lineCap = "round"

    if (tool.type === "brush") {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = tool.color
    } else {
      ctx.globalCompositeOperation = "destination-out"
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  return {
    startDrawing,
    draw,
    stopDrawing,
  }
}
