import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'gold' | 'success' | 'warning'
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
