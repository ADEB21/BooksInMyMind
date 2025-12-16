'use client'

import { useState } from 'react'
import BookCoverFallback from './BookCoverFallback'

interface BookCoverImageProps {
  src?: string | null
  alt: string
  title: string
  size?: 'sm' | 'md' | 'lg'
}

export default function BookCoverImage({ src, alt, title, size = 'md' }: BookCoverImageProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return <BookCoverFallback title={title} size={size} />
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  )
}
