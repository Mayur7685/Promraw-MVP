import { NextRequest, NextResponse } from 'next/server';
import { createCoin } from '@zoralabs/coins-sdk';
import { ethers } from 'ethers';

// POST /api/coin-creation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      symbol,
      uri,
      payoutRecipient,
      owners,
      platformReferrer,
      currency,
      chainId,
      privateKey
    } = body;

    // Validate required fields
    if (!name || !symbol || !uri || !payoutRecipient || !privateKey) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Setup provider and wallet (for demo, use env or provided privateKey)
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://mainnet.base.org');
    const wallet = new ethers.Wallet(privateKey, provider);

    // Prepare coin params
    const coinParams = {
      name,
      symbol,
      uri,
      payoutRecipient,
      owners,
      platformReferrer,
      currency,
      chainId
    };

    // Create coin
    const tx = await createCoin(coinParams, wallet);
    const receipt = await tx.wait();

    return NextResponse.json({ success: true, txHash: receipt.hash });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Coin creation failed.' }, { status: 500 });
  }
}
