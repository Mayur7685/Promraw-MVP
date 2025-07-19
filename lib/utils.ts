import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWalletAddress(address: string): string {
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function generateArtworkName(prompt: string): string {
  return `${prompt.split(" ").slice(0, 2).join("")}Dream`
}

export function generateDescription(scores: { creativity: number; overall: number }): string {
  const creativityLevel = scores.creativity >= 8 ? "exceptional" : scores.creativity >= 6 ? "good" : "developing"
  return `A creative interpretation scoring ${scores.overall}/100. This piece shows ${creativityLevel} creativity!`
}
