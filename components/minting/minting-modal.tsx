"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Sparkles } from "lucide-react"
import type { Scores } from "@/types"

interface MintingModalProps {
  scores: Scores
  drawingDataUrl: string
  prompt: string
  isWalletConnected: boolean
}

export function MintingModal({ scores, drawingDataUrl, prompt, isWalletConnected }: MintingModalProps) {
  const [artworkName, setArtworkName] = useState(`${prompt.split(" ").slice(0, 2).join("")}Dream`)
  const [description, setDescription] = useState(
    `A creative interpretation scoring ${scores.overall}/100. This piece shows ${
      scores.creativity >= 8 ? "exceptional" : scores.creativity >= 6 ? "good" : "developing"
    } creativity!`,
  )
  const [supply, setSupply] = useState(1)
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = async () => {
    setIsMinting(true)
    setTimeout(() => {
      setIsMinting(false)
      alert("Successfully minted on Zora!")
    }, 3000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-600 hover:bg-gray-700 text-white font-mono" disabled={!isWalletConnected}>
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
              onClick={handleMint}
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
  )
}
