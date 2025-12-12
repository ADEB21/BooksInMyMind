import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteBookButton from "@/components/DeleteBookButton";
import Card from "@/components/atoms/Card";
import IconButton from "@/components/atoms/IconButton";
import Badge from "@/components/atoms/Badge";
import Icon from "@/components/atoms/Icon";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!book) {
    notFound();
  }

  const status = book.endDate
    ? "finished"
    : book.startDate
    ? "reading"
    : "to-read";
  const statusLabels = {
    finished: "Terminé",
    reading: "En cours",
    "to-read": "À lire",
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-[#232946]/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-[#232946] transition-colors"
            >
              <Icon name="book" size={20} />
              <span className="font-medium">Retour au dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href={`/books/${id}/edit`}>
                <IconButton variant="secondary" size="sm" icon="edit">
                  Modifier
                </IconButton>
              </Link>
              <DeleteBookButton bookId={id} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card padding="lg">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover */}
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full md:w-64 h-96 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-full md:w-64 h-96 bg-gradient-to-br from-[#232946] to-[#232946]/80 rounded-xl flex items-center justify-center text-8xl">
                📖
              </div>
            )}

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <Badge
                  variant={
                    status === "finished"
                      ? "success"
                      : status === "reading"
                      ? "gold"
                      : "default"
                  }
                >
                  {statusLabels[status]}
                </Badge>
                <h1 className="text-4xl font-bold text-[#232946] mt-4 mb-2">
                  {book.title}
                </h1>
                {book.author && (
                  <p className="text-xl text-gray-600">par {book.author}</p>
                )}
              </div>

              {book.rating && (
                <div className="flex items-center gap-3">
                  <div className="flex text-3xl text-[#C1A15B]">
                    {"★".repeat(book.rating)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - book.rating)}
                    </span>
                  </div>
                  <span className="text-lg text-gray-600 font-medium">
                    {book.rating}/5
                  </span>
                </div>
              )}

              {book.comment && (
                <div className="bg-[#FAF6F0] rounded-xl p-6">
                  <h2 className="text-lg font-bold text-[#232946] mb-3 flex items-center gap-2">
                    <Icon name="star" size={20} />
                    Mes pensées
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {book.comment}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {book.datePublished && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="calendar" size={16} />
                      <span>Publié le</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {new Date(book.datePublished).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {book.startDate && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="calendar" size={16} />
                      <span>Commencé le</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {new Date(book.startDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {book.endDate && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="calendar" size={16} />
                      <span>Terminé le</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {new Date(book.endDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {book.startDate && book.endDate && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="chart" size={16} />
                      <span>Durée</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {Math.ceil(
                        (new Date(book.endDate).getTime() - new Date(book.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{' '}
                      jours
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Icon name="plus" size={16} />
                    <span>Ajouté le</span>
                  </div>
                  <p className="text-[#232946] font-semibold">
                    {new Date(book.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
