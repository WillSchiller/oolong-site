'use client'

import { motion, useAnimation } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'

export default function OoLongHero() {
  const [typedText, setTypedText] = useState('')
  const fullText = "Margin Trading DApp built on Uniswap"

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <section className="relative bg-[#0a0b1e] min-h-screen flex flex-col items-center justify-start md:justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimeTradeVisualization />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start md:justify-center z-10 pt-16 md:pt-0">
        <motion.h1 
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold tracking-tight mb-4 text-center relative flex items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className="relative z-10 text-white">oo</span>
          <span className="relative z-10 inline-block bg-gradient-to-r from-[#4EC9B0] to-[#3EACB4] text-transparent bg-clip-text">LONG</span>
          <JapaneseInspiredElement />
        </motion.h1>
        <motion.p 
          className="mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#C586C0] font-mono max-w-4xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {typedText}<span className="animate-pulse">|</span>
        </motion.p>
      </div>
      <BladeRunnerOverlay />
    </section>
  )
}

function AnimeTradeVisualization() {
  const [particles, setParticles] = useState(() => generateParticles())
  const [candlesticks, setCandlesticks] = useState(() => generateCandlesticks())
  const controls = useAnimation()

  const updateVisualization = useCallback(() => {
    setParticles(prevParticles => 
      prevParticles.map(particle => ({
        ...particle,
        x: (particle.x + particle.speed) % 100,
        y: (particle.y + particle.speed * 0.5) % 100
      }))
    )

    setCandlesticks(prevCandlesticks => 
      prevCandlesticks.map(candle => {
        const change = (Math.random() - 0.5) * 2
        const newClose = Math.max(20, Math.min(80, candle.close + change))
        return {
          ...candle,
          open: candle.close,
          close: newClose
        }
      })
    )
  }, [])

  useEffect(() => {
    const interval = setInterval(updateVisualization, 50)
    return () => clearInterval(interval)
  }, [updateVisualization])

  useEffect(() => {
    controls.start(i => ({
      scaleY: [candlesticks[i].open / 100, candlesticks[i].close / 100],
      y: [100 - candlesticks[i].open, 100 - candlesticks[i].close],
      transition: { duration: 1, ease: "easeInOut" }
    }))
  }, [candlesticks, controls])

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#4EC9B0" stopOpacity="1" />
          <stop offset="100%" stopColor="#3EACB4" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Particles */}
      {particles.map((particle, index) => (
        <motion.circle
          key={index}
          cx={particle.x}
          cy={particle.y}
          r="0.3"
          fill="url(#particleGradient)"
          filter="url(#glow)"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3 + Math.random(),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Candlesticks */}
      {candlesticks.map((candle, index) => (
        <motion.rect
          key={candle.id}
          x={index * 50 + 22}
          width="6"
          height="100"
          fill="#4EC9B0"
          opacity="0.3"
          custom={index}
          animate={controls}
          style={{ originY: "100%" }}
        />
      ))}
    </svg>
  )
}

function generateParticles() {
  return Array.from({ length: 100 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    speed: 0.02 + Math.random() * 0.05,
  }))
}

function generateCandlesticks() {
  return Array.from({ length: 2 }, (_, i) => ({
    id: i,
    open: 50,
    close: 50
  }))
}

function JapaneseInspiredElement() {
  return (
    <motion.div
      className="inline-block ml-2 sm:ml-4"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay: 1.5 }}
    >
      <svg width="0.8em" height="0.8em" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sakuraGradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4EC9B0" />
            <stop offset="1" stopColor="#3EACB4" />
          </linearGradient>
          <filter id="sakuraGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Stylized Cherry Blossom (Sakura) */}
        <g filter="url(#sakuraGlow)">
          <path d="M30 5L35 20L50 25L35 30L30 45L25 30L10 25L25 20L30 5Z" stroke="url(#sakuraGradient)" strokeWidth="2" fill="none" />
          <circle cx="30" cy="25" r="5" fill="url(#sakuraGradient)" opacity="0.6" />
          <path d="M30 15L32 20L37 22L32 24L30 29L28 24L23 22L28 20L30 15Z" fill="url(#sakuraGradient)" opacity="0.4" />
        </g>
      </svg>
    </motion.div>
  )
}

function BladeRunnerOverlay() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0b1e40] to-[#0a0b1e80]" />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#C586C020] to-[#4EC9B020]"
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0a0b1e] to-transparent" />
      <div className="absolute inset-0 bg-[url('/blade-runner-overlay.png')] opacity-30 mix-blend-overlay" />
      <div className="scanline" />
    </div>
  )
}