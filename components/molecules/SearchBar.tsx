'use client'

import { useState } from 'react'
import Icon from '../atoms/Icon'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function SearchBar({ 
  placeholder = 'Rechercher un livre...', 
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }
  
  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon name="search" size={20} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-4 py-3
          bg-white border border-[#232946]/10 rounded-xl
          text-[#1A1A1A] placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#C1A15B] focus:border-transparent
          transition-all duration-200
        "
      />
    </form>
  )
}
