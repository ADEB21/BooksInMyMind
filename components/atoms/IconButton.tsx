import { ButtonHTMLAttributes, ReactNode } from 'react'
import Icon from './Icon'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconSize?: number
  children: ReactNode
  fullWidth?: boolean
}

export default function IconButton({
  variant = 'primary',
  size = 'md',
  icon,
  iconSize,
  children,
  fullWidth = false,
  className = '',
  ...props
}: IconButtonProps) {
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-[#232946] text-white hover:bg-[#1a1f35] active:scale-95 shadow-sm',
    secondary: 'bg-[#FAF6F0] text-[#232946] hover:bg-[#f0ebe3] border border-[#232946]/10',
    ghost: 'text-[#232946] hover:bg-[#FAF6F0]',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  const finalIconSize = iconSize || iconSizes[size]
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {icon && <Icon name={icon} size={finalIconSize} />}
      {children}
    </button>
  )
}
