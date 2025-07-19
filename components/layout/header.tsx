"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface HeaderProps {
  isWalletConnected: boolean
  walletAddress: string
  onConnectWallet: () => void
}

export function Header({ isWalletConnected, walletAddress, onConnectWallet }: HeaderProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-mono font-bold text-gray-900">Promraw</h1>
          <p className="text-sm text-gray-500 font-mono mt-1">AI prompts. Draw. Mint. Create.</p>
        </div>
        <Button
          onClick={onConnectWallet}
          variant="outline"
          className={`font-mono text-sm ${isWalletConnected ? "bg-green-50 border-green-200 text-green-700" : ""}`}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isWalletConnected ? walletAddress : "Connect Wallet"}
        </Button>
      </div>
    </div>
  )
}
