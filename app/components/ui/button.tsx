import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const baseStyles = 'font-bold rounded-md transition duration-300 ease-in-out'
  const variantStyles = {
    default: 'bg-white text-black hover:bg-opacity-90',
    outline: 'bg-transparent border border-white text-white hover:bg-white hover:text-black',
  }
  const sizeStyles = {
    default: 'py-2 px-4',
    sm: 'py-1 px-2 text-sm',
    lg: 'py-3 px-6 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}