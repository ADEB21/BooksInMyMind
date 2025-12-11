import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteBookButton from '@/components/DeleteBookButton'

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const { id } = await params

  const book = await prisma.book.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  })

  if (!book) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Retour au dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Book Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex gap-8">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-48 h-72 bg-gray-200 rounded-lg flex items-center justify-center text-6xl">
                  📖
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                {book.author && (
                  <p className="text-xl text-gray-600 mb-4">par {book.author}</p>
                )}

                {book.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl text-yellow-500">
                      {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                    </span>
                    <span className="text-gray-600">({book.rating}/5)</span>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Link
                    href={`/books/${book.id}/edit`}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
                  >
                    Modifier
                  </Link>
                  <DeleteBookButton bookId={book.id} />
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="p-8 space-y-6">
            {book.comment && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Mon avis</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {book.comment}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {book.startDate && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Date de début
                  </h3>
                  <p className="text-gray-900">
                    {new Date(book.startDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {book.endDate && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Date de fin
                  </h3>
                  <p className="text-gray-900">
                    {new Date(book.endDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {book.startDate && book.endDate && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Durée de lecture
                  </h3>
                  <p className="text-gray-900">
                    {Math.ceil(
                      (new Date(book.endDate).getTime() - new Date(book.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    jours
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Ajouté le
                </h3>
                <p className="text-gray-900">
                  {new Date(book.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
