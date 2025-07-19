"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import {
  Brush,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Loader2,
  RefreshCw,
  Sparkles,
  Circle,
  Square,
  Triangle,
  Minus,
  Wallet,
} from "lucide-react"
import type { Scores, DrawingTool } from "@/types"
import { generateAIPrompt, scoreDrawingWithAI } from "@/lib/ai-services"

export function PromrawApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<DrawingTool>({ type: "brush", color: "#000000", size: 15 })
  const [prompt, setPrompt] = useState("Alien riding a giraffe in a neon city")
  const [scores, setScores] = useState<Scores | null>(null)
  const [isScoring, setIsScoring] = useState(false)
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [drawingDataUrl, setDrawingDataUrl] = useState("")
  const [artworkName, setArtworkName] = useState("")
  const [description, setDescription] = useState("")
  const [supply, setSupply] = useState(1)
  const [isMinting, setIsMinting] = useState(false)

  // Drawing functions
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

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const downloadDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "promraw-drawing.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const generateNewPrompt = async () => {
    setIsGeneratingPrompt(true)
    try {
      const newPrompt = await generateAIPrompt()
      setPrompt(newPrompt)
      setScores(null)
      setDrawingDataUrl("")
    } catch (error) {
      console.error("Error generating prompt:", error)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const submitForScoring = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsScoring(true)
    const dataUrl = canvas.toDataURL()
    setDrawingDataUrl(dataUrl)

    try {
      const aiScores = await scoreDrawingWithAI(dataUrl, prompt)
      setScores(aiScores)
      setArtworkName(`${prompt.split(" ").slice(0, 2).join("")}Dream`)
      setDescription(
        `A creative interpretation scoring ${aiScores.overall}/100. This piece shows ${aiScores.creativity >= 8 ? "exceptional" : aiScores.creativity >= 6 ? "good" : "developing"} creativity!`,
      )
    } catch (error) {
      console.error("Error scoring drawing:", error)
    } finally {
      setIsScoring(false)
    }
  }

  const connectWallet = () => {
    setIsWalletConnected(true)
    setWalletAddress("0x1234...5678")
  }

  const coinOnZora = async () => {
    setIsMinting(true)
    setTimeout(() => {
      setIsMinting(false)
      alert("Successfully minted on Zora!")
    }, 3000)
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-6xl space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-mono font-bold text-gray-900">Promraw</h1>
              <p className="text-sm text-gray-500 font-mono mt-1">AI prompts. Draw. Mint. Create.</p>
            </div>
            <Button
              onClick={connectWallet}
              variant="outline"
              className={`font-mono text-sm ${isWalletConnected ? "bg-green-50 border-green-200 text-green-700" : ""}`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isWalletConnected ? walletAddress : "Connect Wallet"}
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Panel - Creative Challenge */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4 lg:col-span-2">
            <div>
              <h2 className="text-lg font-mono font-bold text-gray-900">Creative Challenge</h2>
              <p className="text-sm text-gray-500 mt-1">Create your masterpiece based on the AI prompt</p>
            </div>

            {/* AI Prompt Box */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-black text-white text-xs px-2 py-1 rounded font-mono">🤖 AI-Generated</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateNewPrompt}
                  disabled={isGeneratingPrompt}
                  className="text-xs font-mono"
                >
                  {isGeneratingPrompt ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3 mr-1" />
                  )}
                  New Prompt
                </Button>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded-sm flex-shrink-0 mt-0.5"></div>
                <p className="font-mono text-sm text-gray-700">{prompt}</p>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-2">Generated: 6/26/2025, 11:05:05 AM</p>
            </div>

            {/* Drawing Tools */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant={tool.type === "brush" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool((prev) => ({ ...prev, type: "brush" }))}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <Circle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
                  <Brush className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  variant={tool.type === "eraser" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool((prev) => ({ ...prev, type: "eraser" }))}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <Eraser className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
                  <Square className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
                  <Triangle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={clearCanvas} className="w-8 h-8 p-0 rounded-full">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-full">
                  <Redo2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={downloadDrawing} className="w-8 h-8 p-0 rounded-full">
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Brush Settings */}
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="color"
                  value={tool.color}
                  onChange={(e) => setTool((prev) => ({ ...prev, color: e.target.value }))}
                  className="w-6 h-6 rounded border border-gray-300"
                />
                <div className="w-8 h-6 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <Slider
                    value={[tool.size]}
                    onValueChange={(value) => setTool((prev) => ({ ...prev, size: value[0] }))}
                    max={30}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                </div>
                <span className="text-sm font-mono text-gray-600">Size: {tool.size}</span>
              </div>

              {/* Canvas */}
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                className="w-full h-64 bg-white border border-gray-200 rounded cursor-crosshair mx-auto block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={submitForScoring}
              disabled={isScoring}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-mono"
            >
              {isScoring ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <Sparkles className="w-4 h-4 mr-2" />
                  Submit for AI Scoring
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Submit for AI Scoring
                </>
              )}
            </Button>

            {/* Coin It Button */}
            {scores && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white font-mono">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Coin it
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-mono">Coin your imagination</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      <img
                        src={drawingDataUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-24 h-24 object-contain mx-auto rounded border"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Artwork Name</Label>
                        <Input
                          id="name"
                          value={artworkName}
                          onChange={(e) => setArtworkName(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="supply">Initial Supply</Label>
                        <Input
                          id="supply"
                          type="number"
                          value={supply}
                          onChange={(e) => setSupply(Number.parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </DialogTrigger>
                      <Button
                        onClick={coinOnZora}
                        disabled={isMinting}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        {isMinting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Minting...
                          </>
                        ) : (
                          "Coin It"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Right Panel - Your Scores */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4 lg:col-span-1">
            <div>
              <h2 className="text-lg font-mono font-bold text-gray-900">Your Scores</h2>
              <p className="text-sm text-gray-500 mt-1">Submit your drawing to get AI-generated scores</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="font-mono text-sm text-gray-700">Creativity</span>
                <span className="font-mono text-sm text-gray-500">{scores?.creativity ?? "–"}/10</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-mono text-sm text-gray-700">Prompt Adherence</span>
                <span className="font-mono text-sm text-gray-500">{scores?.promptAdherence ?? "–"}/10</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-mono text-sm text-gray-700">Artistic Quality</span>
                <span className="font-mono text-sm text-gray-500">{scores?.artisticQuality ?? "–"}/10</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-base font-bold text-gray-900">Overall Score</span>
                  <span className="font-mono text-lg font-bold text-gray-900">{scores?.overall ?? "–"}</span>
                </div>
              </div>
            </div>

            {/* Preview Action Card */}
            {scores && drawingDataUrl && (
              <div className="mt-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                <h3 className="font-mono text-sm font-bold text-center mb-3">Action Card Preview</h3>
                <div className="bg-white p-3 rounded border shadow-sm">
                  <img
                    src={drawingDataUrl || "/placeholder.svg"}
                    alt="Your drawing"
                    className="w-full h-24 object-contain rounded mb-2"
                  />
                  <div className="text-center">
                    <h4 className="font-mono text-xs font-bold">{artworkName}</h4>
                    <p className="text-xs text-gray-600 mt-1 truncate">{prompt}</p>
                    <div className="flex justify-around mt-2 text-xs">
                      <div>
                        <div className="font-bold">CRT</div>
                        <div>{scores.creativity}</div>
                      </div>
                      <div>
                        <div className="font-bold">ADH</div>
                        <div>{scores.promptAdherence}</div>
                      </div>
                      <div>
                        <div className="font-bold">ART</div>
                        <div>{scores.artisticQuality}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
