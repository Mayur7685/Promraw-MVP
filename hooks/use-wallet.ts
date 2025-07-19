"use client"

import { useState } from "react"

export function useWallet() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const connectWallet = () => {
    // TODO: Implement real wallet connection
    setIsWalletConnected(true)
    setWalletAddress("0x1234...5678")
  }

  const disconnectWallet = () => {
    setIsWalletConnected(false)
    setWalletAddress("")
  }

  return {
    isWalletConnected,
    walletAddress,
    connectWallet,
    disconnectWallet,
  }
}
