'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-black bg-opacity-30 backdrop-blur-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <SakuraLogo />
              <span className="sr-only">Home</span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="/docs"
              className="text-white hover:text-gray-300 transition duration-300 ease-in-out font-medium px-4 py-2 rounded-md border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10"
            >
              Docs
            </Link>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading'
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus || authenticationStatus === 'authenticated')

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button onClick={openConnectModal} type="button" className="bg-white text-black font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out connect-button">
                            Connect
                          </button>
                        )
                      }

                      if (chain.unsupported) {
                        return (
                          <button onClick={openChainModal} type="button" className="bg-white text-black font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out connect-button">
                            Wrong network
                          </button>
                        )
                      }

                      return (
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={openChainModal}
                            style={{ display: 'flex', alignItems: 'center' }}
                            type="button"
                            className="bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out connect-button"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button onClick={openAccountModal} type="button" className="bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out connect-button">
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>
          </div>
          <div className="flex sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 sm:hidden bg-black bg-opacity-30 backdrop-blur-md flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Close main menu</span>
                <X className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center flex-grow space-y-8 p-4">
              <Link
                href="/docs"
                className="text-white hover:text-gray-300 transition duration-300 ease-in-out font-medium text-2xl px-6 py-3 rounded-md border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10"
                onClick={toggleMenu}
              >
                Docs
              </Link>
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading'
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated')

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button onClick={openConnectModal} type="button" className="bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out connect-button text-xl">
                              Connect
                            </button>
                          )
                        }

                        if (chain.unsupported) {
                          return (
                            <button onClick={openChainModal} type="button" className="bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out connect-button text-xl">
                              Wrong network
                            </button>
                          )
                        }

                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button
                              onClick={openChainModal}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              type="button"
                              className="bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out connect-button text-xl"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 8,
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 24, height: 24 }}
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </button>

                            <button onClick={openAccountModal} type="button" className="bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out connect-button text-xl">
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </button>
                          </div>
                        )
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        .connect-button {
          position: relative;
          overflow: hidden;
        }
        .connect-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.1);
          transform: scale(0);
          transition: transform 0.3s ease-out;
          border-radius: inherit;
        }
        .connect-button:hover::after {
          transform: scale(1);
        }
      `}</style>
    </nav>
  )
}

function SakuraLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#sakuraGlow)">
        <path d="M30 5L35 20L50 25L35 30L30 45L25 30L10 25L25 20L30 5Z" stroke="white" strokeWidth="2.5" fill="none" />
        <circle cx="30" cy="25" r="5" fill="white" opacity="0.7" />
        <path d="M30 15L32 20L37 22L32 24L30 29L28 24L23 22L28 20L30 15Z" fill="white" opacity="0.5" />
      </g>
      <defs>
        <filter id="sakuraGlow" x="-4" y="-4" width="68" height="68" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
      </defs>
    </svg>
  )
}