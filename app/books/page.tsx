import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Icon from '@/components/atoms/Icon'
import Badge from '@/components/atoms/Badge'
import BookCard from '@/components/molecules/BookCard'

export default async function BooksPage() {
  const session = await auth()

  const books = await prisma.book.findMany({
    include: {
      authors: true,
      genres: true,
      _count: {
        select: { userBooks: true }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Si l'utilisateur est connecté, récupérer ses livres
  let userBookIds: string[] = []
  if (session?.user?.id) {
    const userBooks = await prisma.userBook.findMany({
      where: { userId: session.user.id },
      select: { bookId: true }
    })
    userBookIds = userBooks.map(ub => ub.bookId)
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-[#232946]/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={session?.user ? "/dashboard" : "/"}
              className="flex items-center gap-2 text-gray-600 hover:text-[#232946] transition-colors"
            >
              <Icon name="book" size={20} />
              <span className="font-medium">
                {session?.user ? "Mon dashboard" : "Accueil"}
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-[#232946]">
              Catalogue de livres
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#232946] mb-2">
            Découvrez notre collection
          </h2>
          <p className="text-gray-600">
            {books.length} livre{books.length > 1 ? 's' : ''} disponible{books.length > 1 ? 's' : ''}
          </p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-[#232946] flex items-center justify-center text-[#C1A15B]">
              <Icon name="book" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-[#232946] mb-3">
              Aucun livre disponible
            </h3>
            <p className="text-gray-600">
              La bibliothèque est vide pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => {
              const inLibrary = userBookIds.includes(book.id)
              
              return (
                <div key={book.id} className="relative">
                  <BookCard
                    id={book.id}
                    title={book.title}
                    author={book.authors[0]?.name}
                    coverUrl={book.coverUrl || undefined}
                    datePublished={book.publicationDate || undefined}
                    genres={book.genres}
                  />
                  {/* Badges spécifiques au catalogue */}
                  {inLibrary && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant="success" size="sm">
                        Dans ma bibliothèque
                      </Badge>
                    </div>
                  )}
                  {book._count.userBooks > 0 && !inLibrary && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant="default" size="sm">
                        {book._count.userBooks} lecteur{book._count.userBooks > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
