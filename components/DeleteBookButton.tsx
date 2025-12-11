'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteBookButton({ bookId }: { bookId: string }) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (err) {
      alert('Une erreur est survenue')
    } finally {
      setDeleting(false)
    }
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
      >
        Supprimer
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50"
      >
        {deleting ? 'Suppression...' : 'Confirmer'}
      </button>
      <button
        onClick={() => setShowConfirm(false)}
        disabled={deleting}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
      >
        Annuler
      </button>
    </div>
  )
}
