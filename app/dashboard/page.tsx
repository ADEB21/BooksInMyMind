import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Header from '@/components/organisms/Header'
import StatCard from '@/components/molecules/StatCard'
import BookCard from '@/components/molecules/BookCard'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import SearchBar from '@/components/molecules/SearchBar'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const books = await prisma.book.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: books.length,
    read: books.filter((b: typeof books[0]) => b.endDate).length,
    reading: books.filter((b: typeof books[0]) => b.startDate && !b.endDate).length,
    avgRating: books.length > 0 
      ? (books.reduce((acc: number, b: typeof books[0]) => acc + (b.rating || 0), 0) / books.filter((b: typeof books[0]) => b.rating).length).toFixed(1)
      : '0',
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <Header 
        userName={session.user.name || undefined} 
        isAuthenticated={true} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <SearchBar placeholder="Rechercher un livre..." />
          </div>
          <Link href="/books/new">
            <Button size="lg">
              <Icon name="plus" size={20} />
              Ajouter un livre
            </Button> 
          </Link>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
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
            <Link href="/books/new">
              <Button size="lg">
                <Icon name="plus" size={20} />
                Ajouter mon premier livre
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book: typeof books[0]) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author || undefined}
                coverUrl={book.coverUrl || undefined}
                rating={book.rating || undefined}
                status={book.endDate ? 'finished' : book.startDate ? 'reading' : 'to-read'}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
