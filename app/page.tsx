'use client'

import { useAccount } from 'wagmi';
import OoLongHero from './components/Hero';
import LeverageTrade from './components/Trade';

export default function Home() {
  const account = useAccount();

  return (
    <div>
      {account.isConnected ? (
        <LeverageTrade />
      ) : (
        <div>
          <OoLongHero />
          <div className="text-center mt-8">

          </div>
        </div>
      )}
    </div>
  );
}