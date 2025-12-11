import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false 
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  const hoverClass = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''
  
  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-sm border border-[#232946]/5
        transition-all duration-200
        ${paddings[padding]} ${hoverClass} ${className}
      `}
    >
      {children}
    </div>
  )
}
