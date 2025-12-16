import Card from '../atoms/Card'
import Badge from '../atoms/Badge'
import Icon from '../atoms/Icon'
import Link from 'next/link'
import BookCoverImage from '../BookCoverImage'

interface BookCardProps {
  id: string
  title: string
  author?: string
  coverUrl?: string
  rating?: number
  status?: 'READING' | 'FINISHED' | 'TO_READ' | 'ABANDONED'
  datePublished?: Date | string
  genres?: Array<{ id: string; name: string }>
}

export default function BookCard({ 
  id, 
  title, 
  author, 
  coverUrl, 
  rating,
  status,
  datePublished,
  genres = []
}: BookCardProps) {
  // Conversion du statut Prisma vers le variant du Badge
  const getStatusVariant = (status?: string) => {
    if (!status) return null
    switch (status) {
      case 'FINISHED': return 'success'
      case 'READING': return 'reading'
      case 'ABANDONED': return 'abandoned'
      case 'TO_READ': return 'to-read'
      default: return 'to-read'
    }
  }

  const getStatusLabel = (status?: string) => {
    if (!status) return ''
    switch (status) {
      case 'FINISHED': return 'Lu'
      case 'READING': return 'En cours'
      case 'ABANDONED': return 'Abandonné'
      case 'TO_READ': return 'À lire'
      default: return 'À lire'
    }
  }

  const statusVariant = getStatusVariant(status)
  const statusLabel = getStatusLabel(status)
  
  return (
    <Link href={`/books/${id}`}>
      <Card padding="none" hover>
        <div className="relative aspect-[2/3] bg-[#FAF6F0] rounded-t-2xl overflow-hidden">
          <BookCoverImage 
            src={coverUrl}
            alt={title}
            title={title}
            size="sm"
          />
          {statusVariant && (
            <div className="absolute top-3 right-3">
              <Badge variant={statusVariant} size="sm">
                {statusLabel}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 h-40 flex flex-col gap-2">
          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genres.slice(0, 2).map((genre) => (
                <span 
                  key={genre.id}
                  className="text-xs px-2 py-0.5 bg-[#C1A15B]/10 text-[#C1A15B] rounded-full font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Titre */}
          <h3 className="font-bold text-[#232946] line-clamp-2 leading-tight">
            {title}
          </h3>

          {/* Auteur et année sur la même ligne */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {author && (
              <p className="line-clamp-1 flex-1">{author}</p>
            )}
            {datePublished && (
              <span className="text-xs text-gray-400 shrink-0">
                {new Date(datePublished).getFullYear()}
              </span>
            )}
          </div>

          {/* Note en bas */}
          {rating && (
            <div className="flex items-center gap-1 text-[#C1A15B] mt-auto">
              {[...Array(5)].map((_, i) => (
                <Icon 
                  key={i} 
                  name="star" 
                  size={14}
                  className={i < rating ? 'opacity-100' : 'opacity-20'}
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
