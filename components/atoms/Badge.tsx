import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'reading' | 'to-read' | 'abandoned'
  size?: 'sm' | 'md'
}

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md' 
}: BadgeProps) {
  const variants = {
    default: 'bg-[#FAF6F0] text-[#232946] border-[#232946]/10',
    gold: 'bg-[#C1A15B]/10 text-[#C1A15B] border-[#C1A15B]/20',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    reading: 'bg-blue-50 text-blue-700 border-blue-200',
    'to-read': 'bg-purple-50 text-purple-700 border-purple-200',
    abandoned: 'bg-gray-100 text-gray-600 border-gray-300',
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${variants[variant]} ${sizes[size]}
      `}
    >
      {children}
    </span>
  )
}
