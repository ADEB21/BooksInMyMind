"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Icon from "@/components/atoms/Icon";
import Textarea from "@/components/atoms/Textarea";
import IconButton from "@/components/atoms/IconButton";

interface BookFormProps {
  bookId?: string;
  mode?: "create" | "edit";
}

function BookForm({ bookId, mode = "create" }: BookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === "edit");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    datePublished: "",
    coverUrl: "",
    rating: "",
    comment: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (mode === "edit" && bookId) {
      const fetchBook = async () => {
        try {
          const response = await fetch(`/api/books/${bookId}`);
          if (response.ok) {
            const data = await response.json();
            const book = data.book;
            setFormData({
              title: book.title || "",
              author: book.author || "",
              datePublished: book.datePublished
                ? new Date(book.datePublished).toISOString().split("T")[0]
                : "",
              coverUrl: book.coverUrl || "",
              rating: book.rating?.toString() || "",
              comment: book.comment || "",
              startDate: book.startDate
                ? new Date(book.startDate).toISOString().split("T")[0]
                : "",
              endDate: book.endDate
                ? new Date(book.endDate).toISOString().split("T")[0]
                : "",
            });
          } else {
            setError("Livre non trouvé");
          }
        } catch (err) {
          setError("Erreur lors du chargement");
        } finally {
          setFetching(false);
        }
      };

      fetchBook();
    }
  }, [mode, bookId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        ...(formData.author && { author: formData.author }),
        ...(formData.datePublished && {
          datePublished: new Date(formData.datePublished).toISOString(),
        }),
        ...(formData.coverUrl && { coverUrl: formData.coverUrl }),
        ...(formData.rating && { rating: parseInt(formData.rating) }),
        ...(formData.comment && { comment: formData.comment }),
        ...(formData.startDate && {
          startDate: new Date(formData.startDate).toISOString(),
        }),
        ...(formData.endDate && {
          endDate: new Date(formData.endDate).toISOString(),
        }),
      };

      const url = mode === "edit" ? `/api/books/${bookId}` : "/api/books";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            (mode === "edit"
              ? "Erreur lors de la modification"
              : "Erreur lors de l'ajout du livre")
        );
      } else {
        const redirectUrl = mode === "edit" ? `/books/${bookId}` : "/dashboard";
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  const isEditMode = mode === "edit";
  const cancelUrl = isEditMode ? `/books/${bookId}` : "/dashboard";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#232946] mb-2">
          {isEditMode ? "Modifier le livre" : "Ajouter un livre"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Mettez à jour les informations de votre livre"
            : "Enrichissez votre bibliothèque personnelle"}
        </p>
      </div>

      <Card padding="lg">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Titre"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Le Seigneur des Anneaux"
            required
            disabled={loading}
          />

          <Input
            label="Auteur"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder="J.R.R. Tolkien"
            disabled={loading}
          />

          <Input
            label="Date de publication"
            name="datePublished"
            type="date"
            value={formData.datePublished}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="URL de la couverture"
            name="coverUrl"
            type="url"
            value={formData.coverUrl}
            onChange={handleChange}
            placeholder="https://example.com/cover.jpg"
            helperText="Lien vers l'image de couverture du livre"
            disabled={loading}
          />

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
            label="Vos pensées"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={5}
            placeholder="Qu'avez-vous pensé de ce livre ? Partagez vos impressions..."
            disabled={loading}
          />

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Date de début"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              label="Date de fin"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <IconButton
              type="submit"
              disabled={loading}
              fullWidth
              size="lg"
              icon={isEditMode ? "edit" : "plus"}
            >
              {loading
                ? isEditMode
                  ? "Modification..."
                  : "Ajout en cours..."
                : isEditMode
                ? "Enregistrer les modifications"
                : "Ajouter le livre"}
            </IconButton>
            <Link href={cancelUrl} className="sm:w-auto">
              <IconButton
                type="button"
                variant="secondary"
                fullWidth
                size="lg"
              >
                Annuler
              </IconButton>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default BookForm;
