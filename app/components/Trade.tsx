'use client'

import { useState, useEffect, useCallback } from 'react'
import { SwapVert, Settings, ArrowDropDown, Search } from '@mui/icons-material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Button, TextField, Slider, IconButton, Popover, InputAdornment } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
          fontFamily: 'inherit',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#4EC9B0',
        },
        thumb: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
})

const tokens = [
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '🟠' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '💲' },
  { id: 'dai', name: 'Dai', symbol: 'DAI', icon: '🟨' },
]

const pools = [
  { id: 'eth-btc', name: 'ETH/BTC', tokens: ['eth', 'btc'], poolId: "0x71fe0d9ca57665142f5b6c52685de796fcdcf948912035cb41cf5d363df22181" },
  { id: 'eth-usdc', name: 'ETH/USDC', tokens: ['eth', 'usdc'], poolId: "0x71fe0d9ca57665142f5b6c52685de796fcdcf948912035cb41cf5d363df22181" }
]

interface PoolInfo {
  sqrtPriceX96: string;
  tick: number;
  protocolFee: number;
  lpFee: number;
  liquidity: string;
}

export default function LeverageTrade() {
  const [fromToken, setFromToken] = useState<typeof tokens[0] | null>(null)
  const [toToken, setToToken] = useState<typeof tokens[0] | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [leverage, setLeverage] = useState(2)
  const [isLong, setIsLong] = useState(true)
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null)
  const [isReversed, setIsReversed] = useState(false)
  const [fromAnchorEl, setFromAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [toAnchorEl, setToAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPoolInfo = useCallback(async () => {
    if (!fromToken || !toToken) return

    const pool = pools.find(p => 
      (p.tokens.includes(fromToken.id) && p.tokens.includes(toToken.id)) ||
      (p.tokens.includes(toToken.id) && p.tokens.includes(fromToken.id))
    )
    if (pool) {
      try {
        const response = await fetch(`/api/getSlot0?poolId=${pool.poolId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch pool info')
        }
        const data: PoolInfo = await response.json()
        setPoolInfo(data)
        setIsReversed(pool.tokens[0] !== fromToken.id)
      } catch (error) {
        console.error('Error fetching pool info:', error)
      }
    } else {
      setPoolInfo(null)
    }
  }, [fromToken, toToken])

  useEffect(() => {
    fetchPoolInfo()
  }, [fetchPoolInfo])

  const calculatePrice = useCallback((sqrtPriceX96: string, isReversed: boolean) => {
    const sqrtPriceX96Big = BigInt(sqrtPriceX96)
    const Q96 = BigInt(1) << BigInt(96)
    const price = Number((sqrtPriceX96Big * sqrtPriceX96Big * BigInt(10**18)) / (Q96 * Q96)) / 10**18
    return isReversed ? 1 / price : price
  }, [])

  const updateToAmount = useCallback(() => {
    const amount = parseFloat(fromAmount)
    if (!isNaN(amount) && poolInfo) {
      const price = calculatePrice(poolInfo.sqrtPriceX96, isReversed)
      const exchangedAmount = amount * price
      setToAmount((exchangedAmount * leverage).toFixed(4))
    } else {
      setToAmount('')
    }
  }, [fromAmount, leverage, poolInfo, isReversed, calculatePrice])

  useEffect(() => {
    updateToAmount()
  }, [updateToAmount, fromToken, toToken])

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    updateToAmount()
  }

  const handleTokenSelect = (token: typeof tokens[0], isFrom: boolean) => {
    if (isFrom) {
      setFromToken(token)
      if (token.id === toToken?.id) {
        setToToken(null)
        setToAmount('')
      }
      setFromAnchorEl(null)
    } else {
      setToToken(token)
      setToAnchorEl(null)
    }
    setSearchQuery('')
  }

  const getExchangeRate = () => {
    if (!poolInfo || !fromToken || !toToken) return 1
    return calculatePrice(poolInfo.sqrtPriceX96, isReversed)
  }

  const swapTokens = () => {
    if (!fromToken || !toToken) return

    const exchangeRate = getExchangeRate()
    const currentFromAmount = parseFloat(fromAmount)
    const currentToAmount = parseFloat(toAmount)

    if (!isNaN(currentFromAmount) && !isNaN(currentToAmount)) {
      const newFromAmount = (currentToAmount / leverage / exchangeRate).toFixed(4)
      const newToAmount = (currentFromAmount * exchangeRate * leverage).toFixed(4)

      setFromToken(toToken)
      setToToken(fromToken)
      setFromAmount(newFromAmount)
      setToAmount(newToAmount)
      setIsReversed(!isReversed)
    } else {
      setFromToken(toToken)
      setToToken(fromToken)
      setFromAmount('')
      setToAmount('')
      setIsReversed(!isReversed)
    }
  }

  const filteredTokens = (isFrom: boolean) => tokens.filter(
    token => 
      (isFrom || (fromToken && token.id !== fromToken.id)) &&
      (token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       token.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  interface TokenSelectorProps {
    isFrom: boolean;
    selectedToken: typeof tokens[0] | null;
    onSelect: (token: typeof tokens[0], isFrom: boolean) => void;
  }

  const TokenSelector = ({ isFrom, selectedToken, onSelect }: TokenSelectorProps) => (
    <div>
      <Button
        onClick={(event) => isFrom ? setFromAnchorEl(event.currentTarget) : setToAnchorEl(event.currentTarget)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors duration-200"
      >
        {selectedToken ? (
          <>
            <span className="flex items-center">
              <span className="text-lg mr-2">{selectedToken.icon}</span>
              <span className="text-white">{selectedToken.symbol}</span>
            </span>
            <ArrowDropDown className="h-5 w-5 text-white opacity-50" />
          </>
        ) : (
          <span className="text-white opacity-50">Select token</span>
        )}
      </Button>
      <Popover
        open={isFrom ? Boolean(fromAnchorEl) : Boolean(toAnchorEl)}
        anchorEl={isFrom ? fromAnchorEl : toAnchorEl}
        onClose={() => {
          isFrom ? setFromAnchorEl(null) : setToAnchorEl(null)
          setSearchQuery('')
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className="bg-gray-800 rounded-lg shadow-lg p-2 w-64">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search tokens"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-400" />
                </InputAdornment>
              ),
            }}
          />
          {filteredTokens(isFrom).map((token) => (
            <Button
              key={token.id}
              className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors duration-200"
              onClick={() => onSelect(token, isFrom)}
            >
              <span className="text-lg mr-2">{token.icon}</span>
              <span className="text-white">{token.name}</span>
              <span className="text-gray-400 ml-auto">{token.symbol}</span>
            </Button>
          ))}
        </div>
      </Popover>
    </div>
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="flex items-center justify-center min-h-screen pt-20 px-4 pb-8">
        <div className="w-full max-w-sm bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-5 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Leverage Trade</h2>
            <IconButton size="small" className="text-white hover:bg-gray-800">
              <Settings className="h-5 w-5" />
            </IconButton>
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
              Short
            </span>
          </div>
          <div className="space-y-4">
            {/* From Section */}
            <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-300">From</span>
                <span className="text-xs text-gray-300">Balance: 0.0</span>
              </div>
              <div className="flex items-center space-x-2">
                <TextField
                  type="number"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  placeholder="0.0"
                  fullWidth
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    classes: {
                      input: 'text-white text-lg bg-transparent',
                    },
                  }}
                />
                <TokenSelector isFrom={true} selectedToken={fromToken} onSelect={handleTokenSelect} />
              </div>
            </div>
            {/* Swap Button */}
            <div className="flex justify-center">
              <IconButton onClick={swapTokens} className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white">
                <SwapVert />
              </IconButton>
            </div>
            {/* To Section */}
            <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-300">To (estimated)</span>
              </div>
              <div className="flex items-center space-x-2">
                <TextField
                  type="number"
                  value={toAmount}
                  inputProps={{ readOnly: true }}
                  placeholder="0.0"
                  fullWidth
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    classes: {
                      input: 'text-white text-lg bg-transparent',
                    },
                  }}
                />
                <TokenSelector isFrom={false} selectedToken={toToken} onSelect={handleTokenSelect} />
              </div>
            </div>
            {/* Leverage Slider */}
            <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-3">
              <span className="text-xs text-gray-300 mb-2">Leverage: {leverage}x</span>
              <Slider
                value={leverage}
                onChange={(_, value) => {
                  setLeverage(value as number)
                  updateToAmount()
                }}
                min={1}
                max={5}
                step={0.1}
                valueLabelDisplay="auto"
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
              variant="contained"
              fullWidth
              className={`py-3 text-base font-bold text-white rounded-xl shadow-lg transform hover:scale-105 transition duration-200 ${
                isLong
                  ? 'bg-gradient-to-r from-[#4EC9B0] to-[#3EACB4]'
                  : 'bg-gradient-to-r from-[#e74c3c] to-[#e26888]'
              }`}
            >
              {isLong ? 'OoLong' : 'OoShort'} Execute Trade
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}