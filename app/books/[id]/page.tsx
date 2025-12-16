import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteBookButton from "@/components/DeleteBookButton";
import Card from "@/components/atoms/Card";
import IconButton from "@/components/atoms/IconButton";
import Badge from "@/components/atoms/Badge";
import Icon from "@/components/atoms/Icon";
import AddToLibraryButton from "@/components/AddToLibraryButton";
import EditUserBookForm from "@/components/EditUserBookForm";
import BookCoverImage from "@/components/BookCoverImage";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  // D'abord, chercher le livre (Book)
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      authors: true,
      genres: true,
      _count: {
        select: { userBooks: true },
      },
    },
  });

  if (!book) {
    notFound();
  }

  // Ensuite, vérifier si l'utilisateur a ce livre dans sa bibliothèque
  let userBook = null;
  if (session?.user?.id) {
    userBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: id,
        },
      },
    });
  }

  // Déterminer les données à afficher
  const displayBook = book;
  const isInLibrary = !!userBook;

  const status = userBook
    ? userBook.status === "FINISHED"
      ? "finished"
      : userBook.status === "READING"
      ? "reading"
      : userBook.status === "ABANDONED"
      ? "abandoned"
      : "to-read"
    : null;

  const statusLabels = {
    finished: "Terminé",
    reading: "En cours",
    "to-read": "À lire",
    abandoned: "Abandonné",
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-[#232946]/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={isInLibrary ? "/dashboard" : "/books"}
              className="flex items-center gap-2 text-gray-600 hover:text-[#232946] transition-colors"
            >
              <Icon name="book" size={20} />
              <span className="font-medium">
                {isInLibrary ? "Retour au dashboard" : "Retour au catalogue"}
              </span>
            </Link>
            {isInLibrary && userBook && (
              <div className="flex items-center gap-3">
                <DeleteBookButton bookId={userBook.id} />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card padding="lg">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover */}
            <div className="w-full md:w-64 h-96 rounded-xl shadow-lg overflow-hidden">
              <BookCoverImage
                src={displayBook.coverUrl}
                alt={displayBook.title}
                title={displayBook.title}
                size="lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {status && (
                    <Badge
                      variant={
                        status === "finished"
                          ? "success"
                          : status === "reading"
                          ? "reading"
                          : status === "abandoned"
                          ? "abandoned"
                          : "to-read"
                      }
                    >
                      {statusLabels[status as keyof typeof statusLabels]}
                    </Badge>
                  )}
                  {!isInLibrary && (
                    <Badge variant="default">
                      {displayBook._count.userBooks} lecteur
                      {displayBook._count.userBooks > 1 ? "s" : ""}
                    </Badge>
                  )}
                  {displayBook.genres.map((genre) => (
                    <Badge key={genre.id} variant="gold">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-4xl font-bold text-[#232946] mb-2">
                  {displayBook.title}
                </h1>
                {displayBook.authors.length > 0 && (
                  <p className="text-xl text-gray-600">
                    par {displayBook.authors.map((a) => a.name).join(", ")}
                  </p>
                )}
              </div>

              {userBook?.rating && (
                <div className="flex items-center gap-3">
                  <div className="flex text-3xl text-[#C1A15B]">
                    {"★".repeat(userBook.rating)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - userBook.rating)}
                    </span>
                  </div>
                  <span className="text-lg text-gray-600 font-medium">
                    {userBook.rating}/5
                  </span>
                </div>
              )}

              {displayBook.summary && (
                <div className="bg-[#FAF6F0] rounded-xl p-6">
                  <h2 className="text-lg font-bold text-[#232946] mb-3 flex items-center gap-2">
                    <Icon name="book" size={20} />
                    Résumé
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {displayBook.summary}
                  </p>
                </div>
              )}

              {userBook?.comment && (
                <div className="bg-[#FAF6F0] rounded-xl p-6">
                  <h2 className="text-lg font-bold text-[#232946] mb-3 flex items-center gap-2">
                    <Icon name="star" size={20} />
                    Mes pensées
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {userBook.comment}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {displayBook.publicationDate && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="calendar" size={16} />
                      <span>Publié le</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {new Date(displayBook.publicationDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}

                {displayBook.publisher && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="book" size={16} />
                      <span>Éditeur</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {displayBook.publisher}
                    </p>
                  </div>
                )}

                {displayBook.language && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="book" size={16} />
                      <span>Langue d'origine</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {displayBook.language}
                    </p>
                  </div>
                )}

                {displayBook.isbn && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="book" size={16} />
                      <span>ISBN</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {displayBook.isbn}
                    </p>
                  </div>
                )}

                {userBook?.startDate && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="calendar" size={16} />
                      <span>Commencé le</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {new Date(userBook.startDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}

                {userBook?.endDate && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="calendar" size={16} />
                      <span>Terminé le</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {new Date(userBook.endDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {userBook?.startDate && userBook?.endDate && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="chart" size={16} />
                      <span>Durée</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {Math.ceil(
                        (new Date(userBook.endDate).getTime() -
                          new Date(userBook.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      jours
                    </p>
                  </div>
                )}

                {userBook && (
                  <div className="bg-white rounded-lg p-4 border border-[#232946]/10">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Icon name="plus" size={16} />
                      <span>Ajouté le</span>
                    </div>
                    <p className="text-[#232946] font-semibold">
                      {new Date(userBook.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit or Add to Library */}
              {isInLibrary && userBook ? (
                <EditUserBookForm
                  userBookId={userBook.id}
                  bookId={id}
                  initialData={{
                    status: userBook.status,
                    rating: userBook.rating,
                    comment: userBook.comment,
                    startDate: userBook.startDate,
                    endDate: userBook.endDate,
                    pages: userBook.pages,
                  }}
                />
              ) : session?.user ? (
                <AddToLibraryButton bookId={id} />
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-blue-700 mb-3">
                    Connectez-vous pour ajouter ce livre à votre bibliothèque
                  </p>
                  <Link href="/login">
                    <IconButton size="lg" icon="plus">
                      Se connecter
                    </IconButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
