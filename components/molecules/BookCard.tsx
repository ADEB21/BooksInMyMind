import Card from '../atoms/Card'
import Badge from '../atoms/Badge'
import Icon from '../atoms/Icon'
import Link from 'next/link'

interface BookCardProps {
  id: string
  title: string
  author?: string
  coverUrl?: string
  rating?: number
  status?: 'reading' | 'finished' | 'to-read'
}

export default function BookCard({ 
  id, 
  title, 
  author, 
  coverUrl, 
  rating,
  status 
}: BookCardProps) {
  const statusColors = {
    reading: 'gold',
    finished: 'success',
    'to-read': 'default',
  } as const
  
  return (
    <Link href={`/books/${id}`}>
      <Card padding="none" hover>
        <div className="relative aspect-[2/3] bg-[#FAF6F0] rounded-t-2xl overflow-hidden">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C1A15B]">
              <Icon name="book" size={48} />
            </div>
          )}
          {status && (
            <div className="absolute top-3 right-3">
              <Badge variant={statusColors[status]} size="sm">
                {status === 'reading' ? 'En cours' : status === 'finished' ? 'Lu' : 'À lire'}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-[#232946] line-clamp-2 mb-1">
            {title}
          </h3>
          {author && (
            <p className="text-sm text-gray-500 line-clamp-1 mb-2">{author}</p>
          )}
          {rating && (
            <div className="flex items-center gap-1 text-[#C1A15B]">
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
