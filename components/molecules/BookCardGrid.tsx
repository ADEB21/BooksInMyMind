import Card from '../atoms/Card'

interface BookCardGridProps {
  title: string
  author?: string
  year?: number
  coverUrl?: string
  onClick?: () => void
}

export default function BookCardGrid({
  title,
  author,
  year,
  coverUrl,
  onClick
}: BookCardGridProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.src = '/placeholder-book.svg'
  }

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Card
        padding="none"
        hover
        className="overflow-hidden flex flex-col h-full"
      >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] bg-[#232946]/5 overflow-hidden flex-shrink-0">
        <img
          src={coverUrl || '/placeholder-book.svg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
      </div>

      {/* Book Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 
          className="font-semibold text-[#232946] text-sm mb-2 overflow-hidden text-ellipsis whitespace-nowrap" 
          title={title}
        >
          {title}
        </h3>
        
        {author && (
          <p className="text-xs text-gray-600 line-clamp-1 mb-1">
            {author}
          </p>
        )}
        
        {year && (
          <p className="text-xs text-[#C1A15B] font-medium mt-auto">
            {year}
          </p>
        )}
      </div>
      </Card>
    </div>
  )
}
