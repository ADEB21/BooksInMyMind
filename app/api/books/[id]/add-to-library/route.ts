import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { ReadingStatus } from "@prisma/client"

const addToLibrarySchema = z.object({
  status: z.enum(["TO_READ", "READING", "FINISHED", "ABANDONED"]).optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  pages: z.number().optional(),
})

// POST /api/books/[id]/add-to-library - Ajouter un livre à sa bibliothèque
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: bookId } = await params
    const body = await req.json()
    const validatedFields = addToLibrarySchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    // Vérifier que le livre existe
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Vérifier si l'utilisateur a déjà ce livre
    const existingUserBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: bookId,
        },
      },
    })

    if (existingUserBook) {
      return NextResponse.json(
        { error: "Book already in your library" },
        { status: 400 }
      )
    }

    const { status, rating, comment, startDate, endDate, pages } = validatedFields.data

    // Créer la relation UserBook
    const userBook = await prisma.userBook.create({
      data: {
        userId: session.user.id,
        bookId: bookId,
        status: (status as ReadingStatus) || "TO_READ",
        rating,
        comment,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        pages,
      },
      include: {
        book: {
          include: {
            authors: true,
            genres: true,
          },
        },
      },
    })

    return NextResponse.json(
      { message: "Book added to library successfully", userBook },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding book to library:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
