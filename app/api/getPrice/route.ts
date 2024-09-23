import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, Address, PublicClient } from 'viem';
import { baseSepolia } from 'viem/chains';

const STATE_VIEWER = '0x4cd8D683f8301EaF268c3B66578ea2ceA0DCEe96' as Address;

const StateViewABI = [
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "getSlot0",
        outputs: [
          { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
          { internalType: "int24", name: "tick", type: "int24" },
          { internalType: "uint24", name: "protocolFee", type: "uint24" },
          { internalType: "uint24", name: "lpFee", type: "uint24" }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "getLiquidity",
        outputs: [{ internalType: "uint128", name: "liquidity", type: "uint128" }],
        stateMutability: "view",
        type: "function"
      }
] as const;

// Helper function to convert BigInt to string
function bigIntToString(value: bigint | number): string {
    return typeof value === 'bigint' ? value.toString() : value.toString();
  }

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const poolId = searchParams.get('poolId');
  
    if (!poolId) {
      return NextResponse.json({ 
        error: 'Missing required parameter: poolId',
        usage: 'Please provide a valid Uniswap V4 poolId'
      }, { status: 400 });
    }
  
    if (!process.env.RPC_URL) {
      console.error('RPC_URL is not defined in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
  
    try {
      const client: PublicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(process.env.RPC_URL),
      });
  
      const [slot0, liquidity] = await Promise.all([
        client.readContract({
          address: STATE_VIEWER,
          abi: StateViewABI,
          functionName: 'getSlot0',
          args: [poolId as `0x${string}`],
        }),
        client.readContract({
          address: STATE_VIEWER,
          abi: StateViewABI,
          functionName: 'getLiquidity',
          args: [poolId as `0x${string}`],
        })
      ]);
  
      return NextResponse.json({
        poolId,
        sqrtPriceX96: bigIntToString(slot0[0]),
        tick: slot0[1],
        protocolFee: slot0[2],
        lpFee: slot0[3],
        liquidity: bigIntToString(liquidity)
      }, { status: 200 });
    } catch (error) {
      console.error('Error fetching pool info:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch pool info',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }