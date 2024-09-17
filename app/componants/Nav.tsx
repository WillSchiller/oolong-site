'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-transparent fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <SakuraLogo />
              <span className="sr-only">Home</span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="/docs"
              className="text-white hover:text-gray-200 transition duration-300 ease-in-out font-medium px-4 py-2 rounded-md border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10"
            >
              Docs
            </Link>
            <button
              className="bg-white text-black font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out connect-button"
              onClick={() => console.log('Connect clicked')}
            >
              Connect
            </button>
          </div>
          <div className="flex sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
            className="sm:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black bg-opacity-80 backdrop-blur-md">
              <Link
                href="/docs"
                className="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10"
                onClick={toggleMenu}
              >
                Docs
              </Link>
              <button
                className="w-full text-left bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out connect-button"
                onClick={() => {
                  console.log('Connect clicked')
                  toggleMenu()
                }}
              >
                Connect
              </button>
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
          background: rgba(255, 255, 255, 0.2);
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
    <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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