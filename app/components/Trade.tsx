'use client'

import { useState } from 'react'
import { ChevronDown, ArrowDown, Settings } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"

const tokens = [
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '🟠' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '💲' },
  { id: 'dai', name: 'Dai', symbol: 'DAI', icon: '🟨' },
]

export default function LeverageTrade() {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [leverage, setLeverage] = useState(2)
  const [isLong, setIsLong] = useState(true)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    const amount = parseFloat(value)
    if (!isNaN(amount)) {
      setToAmount((amount * leverage).toFixed(4))
    } else {
      setToAmount('')
    }
  }

  const handleTokenSelect = (token: typeof tokens[0], isFrom: boolean) => {
    if (isFrom) {
      setFromToken(token)
      setShowFromDropdown(false)
    } else {
      setToToken(token)
      setShowToDropdown(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen pt-20 px-4 pb-8">
      <div className="w-full max-w-sm bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-5 shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Leverage Trade</h2>
          <Button variant="outline" size="sm" className="text-white hover:bg-gray-800">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex justify-center items-center space-x-3 mb-4">
          <span className={`text-sm font-bold ${isLong ? 'text-[#4EC9B0]' : 'text-gray-500'}`}>
            OoLong
          </span>
          <div 
            className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              isLong
                ? 'bg-gradient-to-r from-[#4EC9B0] to-[#3EACB4]'
                : 'bg-gradient-to-r from-[#e74c3c] to-[#e26888]'
            }`}
            onClick={() => setIsLong(!isLong)}
          >
            <div 
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                isLong ? 'translate-x-0' : 'translate-x-6'
              }`}
            />
          </div>
          <span className={`text-sm font-bold ${!isLong ? 'text-[#e74c3c]' : 'text-gray-500'}`}>
            OoShort
          </span>
        </div>
        <div className="space-y-4">
          {/* From Section */}
          <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-3">
            <div className="flex justify-between mb-1">
              <Label htmlFor="from-amount" className="text-xs text-gray-300">From</Label>
              <span className="text-xs text-gray-300">Balance: 0.0</span>
            </div>
            <div className="flex items-center">
              <Input
                id="from-amount"
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-grow bg-transparent text-lg text-white placeholder-gray-400 border-none focus:ring-0 focus:outline-none"
                step="any"
              />
              <div className="relative ml-2">
                <div 
                  className="flex items-center bg-white bg-opacity-10 rounded-lg py-1 px-2 cursor-pointer hover:bg-opacity-20 transition duration-200"
                  onClick={() => setShowFromDropdown(!showFromDropdown)}
                >
                  <span className="text-lg mr-1">{fromToken.icon}</span>
                  <span className="text-white text-sm font-medium mr-1">{fromToken.symbol}</span>
                  <ChevronDown className="h-4 w-4 text-white" />
                </div>
                {showFromDropdown && (
                  <div className="absolute right-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    {tokens.map((token) => (
                      <div
                        key={token.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer transition duration-200"
                        onClick={() => handleTokenSelect(token, true)}
                      >
                        <span className="text-lg mr-2">{token.icon}</span>
                        <span className="text-white text-sm font-medium">{token.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Arrow Down */}
          <div className="flex justify-center">
            <div className="bg-white bg-opacity-10 rounded-full p-1">
              <ArrowDown className="h-4 w-4 text-white" />
            </div>
          </div>
          {/* To Section */}
          <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-3">
            <div className="flex justify-between mb-1">
              <Label htmlFor="to-amount" className="text-xs text-gray-300">To (estimated)</Label>
            </div>
            <div className="flex items-center">
              <Input
                id="to-amount"
                type="number"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="flex-grow bg-transparent text-lg text-white placeholder-gray-400 border-none focus:ring-0 focus:outline-none"
              />
              <div className="relative ml-2">
                <div 
                  className="flex items-center bg-white bg-opacity-10 rounded-lg py-1 px-2 cursor-pointer hover:bg-opacity-20 transition duration-200"
                  onClick={() => setShowToDropdown(!showToDropdown)}
                >
                  <span className="text-lg mr-1">{toToken.icon}</span>
                  <span className="text-white text-sm font-medium mr-1">{toToken.symbol}</span>
                  <ChevronDown className="h-4 w-4 text-white" />
                </div>
                {showToDropdown && (
                  <div className="absolute right-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    {tokens.map((token) => (
                      <div
                        key={token.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer transition duration-200"
                        onClick={() => handleTokenSelect(token, false)}
                      >
                        <span className="text-lg mr-2">{token.icon}</span>
                        <span className="text-white text-sm font-medium">{token.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Leverage Slider */}
          <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-3">
            <Label className="text-xs text-gray-300 mb-2">Leverage: {leverage}x</Label>
            <Slider
              value={[leverage]}
              onValueChange={([value]) => setLeverage(value)}
              max={5}
              min={1}
              step={0.1}
              className="my-2"
            />
          </div>
          {/* Fees and Liquidation Price */}
          <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Liquidation Price</span>
              <span className="text-white font-medium">$1,234.56</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Fees</span>
              <span className="text-white font-medium">$12.34</span>
            </div>
          </div>
          {/* Trade Button */}
          <Button 
            className={`w-full py-3 text-base font-bold text-white rounded-xl shadow-lg transform hover:scale-105 transition duration-200 ${
              isLong
                ? 'bg-gradient-to-r from-[#4EC9B0] to-[#3EACB4]'
                : 'bg-gradient-to-r from-[#e74c3c] to-[#e26888]'
            }`}
          >
            {isLong ? 'OoLong' : 'OoShort'} Trade
          </Button>
        </div>
      </div>
    </div>
  )
}