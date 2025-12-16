import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import StatCard from '@/components/molecules/StatCard'
import BookCard from '@/components/molecules/BookCard'
import IconButton from '@/components/atoms/IconButton'
import Icon from '@/components/atoms/Icon'
import SearchBar from '@/components/molecules/SearchBar'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const userBooks = await prisma.userBook.findMany({
    where: { userId: session.user.id },
    include: {
      book: {
        include: {
          authors: true,
          genres: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: userBooks.length,
    read: userBooks.filter((ub) => ub.status === 'FINISHED').length,
    reading: userBooks.filter((ub) => ub.status === 'READING').length,
    avgRating: userBooks.length > 0 
      ? (userBooks.reduce((acc, ub) => acc + (ub.rating || 0), 0) / userBooks.filter((ub) => ub.rating).length).toFixed(1)
      : '0',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#232946] mb-2">
            Bonjour, {session.user.name} 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Votre bibliothèque personnelle vous attend
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total de livres"
            value={stats.total}
            icon="book"
          />
          <StatCard
            title="Livres terminés"
            value={stats.read}
            icon="star"
          />
          <StatCard
            title="En cours de lecture"
            value={stats.reading}
            icon="book"
          />
          <StatCard
            title="Note moyenne"
            value={`${stats.avgRating} ⭐`}
            icon="chart"
          />
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-96">
            {/* <SearchBar placeholder="Rechercher un livre..." /> */}
          </div>
          <Link href="/books">
            <IconButton size="lg" icon="book">
              Parcourir le catalogue
            </IconButton> 
          </Link>
        </div>

        {/* Books Grid */}
        {userBooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-[#232946] flex items-center justify-center text-[#C1A15B]">
              <Icon name="book" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-[#232946] mb-3">
              Votre bibliothèque est vide
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Commencez votre voyage littéraire en ajoutant votre premier livre
            </p>
            <Link href="/books">
              <IconButton size="lg" icon="book">
                Découvrir le catalogue
              </IconButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {userBooks.map((userBook) => (
              <BookCard
                key={userBook.id}
                id={userBook.bookId}
                title={userBook.book.title}
                author={userBook.book.authors[0]?.name}
                coverUrl={userBook.book.coverUrl || undefined}
                rating={userBook.rating || undefined}
                status={userBook.status}
                datePublished={userBook.book.publicationDate || undefined}
                genres={userBook.book.genres}
              />
            ))}
          </div>
        )}
    </div>
  )
}
