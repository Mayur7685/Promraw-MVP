import { NextRequest, NextResponse } from 'next/server';
import { ZoraApiClient } from '@zoralabs/zora-creator-sdk';

// GET /api/gallery?address=0x123...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    if (!address) {
      return NextResponse.json({ error: 'Missing address parameter.' }, { status: 400 });
    }

    // Initialize Zora API client
    const zora = new ZoraApiClient();
    // Fetch coins (ERC-20) created by this address (or use NFTs if your app uses them)
    const coins = await zora.coins.getCoinsByOwner(address);
    // Optionally, filter or map results for frontend
    return NextResponse.json({ coins });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch gallery.' }, { status: 500 });
  }
}
