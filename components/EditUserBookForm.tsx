"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import IconButton from "@/components/atoms/IconButton"
import Textarea from "@/components/atoms/Textarea"

interface EditUserBookFormProps {
  userBookId: string
  bookId: string
  initialData: {
    status: string
    rating?: number | null
    comment?: string | null
    startDate?: Date | null
    endDate?: Date | null
    pages?: number | null
  }
}

export default function EditUserBookForm({ userBookId, bookId, initialData }: EditUserBookFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    status: initialData.status || "TO_READ",
    rating: initialData.rating?.toString() || "",
    comment: initialData.comment || "",
    startDate: initialData.startDate 
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "",
    endDate: initialData.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : "",
    pages: initialData.pages?.toString() || "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payload: any = {
        status: formData.status,
        ...(formData.rating && { rating: parseInt(formData.rating) }),
        ...(formData.comment && { comment: formData.comment }),
        ...(formData.startDate && {
          startDate: new Date(formData.startDate).toISOString(),
        }),
        ...(formData.endDate && {
          endDate: new Date(formData.endDate).toISOString(),
        }),
        ...(formData.pages && { pages: parseInt(formData.pages) }),
      }

      const response = await fetch(`/api/books/${userBookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erreur lors de la modification")
      } else {
        setIsEditing(false)
        router.refresh()
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <IconButton
        variant="secondary"
        size="sm"
        icon="edit"
        onClick={() => setIsEditing(true)}
      >
        Modifier mes infos
      </IconButton>
    )
  }

  return (
    <div className="bg-white border border-[#232946]/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#232946]">
          Modifier mes informations
        </h3>
        <button
          onClick={() => setIsEditing(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            Note
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-[#232946]/10 rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C1A15B] focus:border-transparent transition-all duration-200"
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

        <Textarea
          label="Mes pensées"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows={4}
          placeholder="Qu'avez-vous pensé de ce livre ?"
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
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
            Nombre de pages
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
            type="submit"
            size="lg"
            icon="edit"
            disabled={loading}
            fullWidth
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </IconButton>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
