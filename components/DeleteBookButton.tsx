'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import IconButton from '@/components/atoms/IconButton'

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
      <IconButton
        variant="danger"
        size="sm"
        icon="trash"
        onClick={() => setShowConfirm(true)}
      >
        Supprimer
      </IconButton>
    )
  }

  return (
    <div className="flex gap-2">
      <IconButton
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={deleting}
        className="bg-red-600 text-white hover:bg-red-700 border-0"
      >
        {deleting ? 'Suppression...' : 'Confirmer'}
      </IconButton>
      <IconButton
        variant="secondary"
        size="sm"
        onClick={() => setShowConfirm(false)}
        disabled={deleting}
      >
        Annuler
      </IconButton>
    </div>
  )
}
