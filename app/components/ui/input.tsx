import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full p-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${className}`}
      {...props}
    />
  )
}