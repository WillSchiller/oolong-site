'use client'

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from 'react';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";


const config = getDefaultConfig({
  appName: 'oolong.xyz',
  projectId: '23914b3953c2c1d7776e427fe8300679',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
          {children}
          </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
  );
}