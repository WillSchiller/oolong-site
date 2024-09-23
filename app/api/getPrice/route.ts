// app/api/getOwner/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { Address } from 'viem';

// Pool Manager address on Base Sepolia
const POOL_MANAGER_ADDRESS: string = '0xFC885F37F5A9FA8159c8dBb907fc1b0C2fB31323';

// Define the ABI for the relevant functions
const poolManagerABI: string[] = [
  "function owner() view returns (address)"
];



export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const poolId = searchParams.get('poolId');


  if (!process.env.RPC_URL) {
    console.error('RPC_URL is not defined in environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    // Initialize ethers provider
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    // Create a contract instance
    const poolManagerContract = new ethers.Contract(
      POOL_MANAGER_ADDRESS,
      poolManagerABI,
      provider
    );

    // Fetch the owner of the Pool Manager
    const owner: Address = await poolManagerContract.owner();

    // Note: We can't directly fetch pool info with just a poolId
    // Typically, you'd need the PoolKey struct (currency0, currency1, fee, tickSpacing, hooks)
    // to interact with specific pool functions

    return NextResponse.json({
      poolManagerAddress: POOL_MANAGER_ADDRESS,
      owner,
      message: "To get specific pool info, you need to provide the PoolKey components (currency0, currency1, fee, tickSpacing, hooks)"
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contract info:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contract info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
