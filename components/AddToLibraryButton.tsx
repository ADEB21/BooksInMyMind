"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import IconButton from "@/components/atoms/IconButton"

interface AddToLibraryButtonProps {
  bookId: string
}

export default function AddToLibraryButton({ bookId }: AddToLibraryButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    status: "TO_READ",
    rating: "",
    comment: "",
    startDate: "",
    endDate: "",
    pages: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddToLibrary = async () => {
    setError("")
    setLoading(true)

    try {
      const payload: any = {
        status: formData.status,
        ...(formData.rating && { rating: parseInt(formData.rating) }),
        ...(formData.comment && { comment: formData.comment }),
        ...(formData.startDate && { startDate: new Date(formData.startDate).toISOString() }),
        ...(formData.endDate && { endDate: new Date(formData.endDate).toISOString() }),
        ...(formData.pages && { pages: parseInt(formData.pages) }),
      }

      const response = await fetch(`/api/books/${bookId}/add-to-library`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'ajout")
      } else {
        // Rediriger vers la page du livre (qui affichera maintenant la vue personnelle)
        router.push(`/books/${bookId}`)
        router.refresh()
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  if (!showModal) {
    return (
      <div>
        <IconButton
          size="lg"
          icon="plus"
          fullWidth
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          Ajouter à ma bibliothèque
        </IconButton>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#232946]/10 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-[#232946]">
        Ajouter à ma bibliothèque
      </h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
          Statut de lecture
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white border border-[#232946]/10 rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C1A15B] focus:border-transparent transition-all duration-200"
          disabled={loading}
        >
          <option value="TO_READ">À lire</option>
          <option value="READING">En cours</option>
          <option value="FINISHED">Terminé</option>
          <option value="ABANDONED">Abandonné</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
          Note (optionnel)
        </label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white border border-[#232946]/10 rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C1A15B] focus:border-transparent transition-all duration-200"
          disabled={loading}
        >
          <option value="">Pas de note</option>
          <option value="1">⭐ 1/5</option>
          <option value="2">⭐⭐ 2/5</option>
          <option value="3">⭐⭐⭐ 3/5</option>
          <option value="4">⭐⭐⭐⭐ 4/5</option>
          <option value="5">⭐⭐⭐⭐⭐ 5/5</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
          Commentaire (optionnel)
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={3}
          placeholder="Qu'avez-vous pensé de ce livre ?"
          className="w-full px-4 py-3 bg-white border border-[#232946]/10 rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C1A15B] focus:border-transparent transition-all duration-200 resize-none"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
            Date de début
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-[#232946]/10 rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C1A15B] focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
            Date de fin
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-[#232946]/10 rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C1A15B] focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
          Nombre de pages (optionnel)
        </label>
        <input
          type="number"
          name="pages"
          value={formData.pages}
          onChange={handleChange}
          placeholder="350"
          className="w-full px-4 py-3 bg-white border border-[#232946]/10 rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C1A15B] focus:border-transparent transition-all duration-200"
          disabled={loading}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <IconButton
          size="lg"
          icon="plus"
          onClick={handleAddToLibrary}
          disabled={loading}
          fullWidth
        >
          {loading ? "Ajout en cours..." : "Ajouter"}
        </IconButton>
        <button
          onClick={() => setShowModal(false)}
          disabled={loading}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
