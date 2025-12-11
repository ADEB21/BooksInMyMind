'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'

export default function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverUrl: '',
    rating: '',
    comment: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`)
        if (response.ok) {
          const data = await response.json()
          const book = data.book
          setFormData({
            title: book.title || '',
            author: book.author || '',
            coverUrl: book.coverUrl || '',
            rating: book.rating?.toString() || '',
            comment: book.comment || '',
            startDate: book.startDate ? new Date(book.startDate).toISOString().split('T')[0] : '',
            endDate: book.endDate ? new Date(book.endDate).toISOString().split('T')[0] : '',
          })
        } else {
          setError('Livre non trouvé')
        }
      } catch (err) {
        setError('Erreur lors du chargement')
      } finally {
        setFetching(false)
      }
    }

    fetchBook()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        title: formData.title,
        ...(formData.author && { author: formData.author }),
        ...(formData.coverUrl && { coverUrl: formData.coverUrl }),
        ...(formData.rating && { rating: parseInt(formData.rating) }),
        ...(formData.comment && { comment: formData.comment }),
        ...(formData.startDate && { startDate: new Date(formData.startDate).toISOString() }),
        ...(formData.endDate && { endDate: new Date(formData.endDate).toISOString() }),
      }

      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la modification')
      } else {
        router.push(`/books/${id}`)
        router.refresh()
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/books/${id}`} className="text-gray-600 hover:text-gray-900">
              ← Retour
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Modifier le livre</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                required
                disabled={loading}
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Auteur
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Cover URL */}
            <div>
              <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-2">
                URL de la couverture
              </label>
              <input
                id="coverUrl"
                name="coverUrl"
                type="url"
                value={formData.coverUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                disabled={loading}
              >
                <option value="">Sélectionner une note</option>
                <option value="1">⭐ 1/5</option>
                <option value="2">⭐⭐ 2/5</option>
                <option value="3">⭐⭐⭐ 3/5</option>
                <option value="4">⭐⭐⭐⭐ 4/5</option>
                <option value="5">⭐⭐⭐⭐⭐ 5/5</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Modification en cours...' : 'Enregistrer les modifications'}
              </button>
              <Link
                href={`/books/${id}`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
