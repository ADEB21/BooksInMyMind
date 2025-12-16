import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { ReadingStatus } from "@prisma/client"

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  publicationDate: z.string().datetime().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  summary: z.string().optional(),
  publisher: z.string().optional(),
  language: z.string().optional(),
  isbn: z.string().optional(),
  status: z.enum(["TO_READ", "READING", "FINISHED", "ABANDONED"]),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  pages: z.number().optional(),
})

// GET /api/books - Récupérer tous les livres de l'utilisateur
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userBooks = await prisma.userBook.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        book: {
          include: {
            authors: true,
            genres: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ books: userBooks }, { status: 200 })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/books - Créer un nouveau livre
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedFields = bookSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    const { 
      title, 
      authors, 
      genres,
      publicationDate, 
      coverUrl, 
      summary,
      publisher,
      language,
      isbn,
      status,
      rating, 
      comment, 
      startDate, 
      endDate,
      pages
    } = validatedFields.data

    // Créer ou connecter les auteurs
    const authorConnections = authors && authors.length > 0
      ? await Promise.all(
          authors.map(async (authorName) => {
            const author = await prisma.author.upsert({
              where: { name: authorName },
              update: {},
              create: { name: authorName },
            })
            return { id: author.id }
          })
        )
      : []

    // Créer ou connecter les genres
    const genreConnections = genres && genres.length > 0
      ? await Promise.all(
          genres.map(async (genreName) => {
            const genre = await prisma.genre.upsert({
              where: { name: genreName },
              update: {},
              create: { name: genreName },
            })
            return { id: genre.id }
          })
        )
      : []

    // Créer le livre
    const book = await prisma.book.create({
      data: {
        title,
        summary,
        coverUrl: coverUrl || null,
        publicationDate: publicationDate ? new Date(publicationDate) : null,
        publisher,
        language,
        isbn,
        authors: {
          connect: authorConnections,
        },
        genres: {
          connect: genreConnections,
        },
      },
      include: {
        authors: true,
        genres: true,
      },
    })

    // Créer la relation UserBook
    const userBook = await prisma.userBook.create({
      data: {
        userId: session.user.id,
        bookId: book.id,
        status: status as ReadingStatus,
        rating,
        comment,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        pages,
      },
    })

    return NextResponse.json(
      { message: "Book created successfully", book, userBook },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
