import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { ReadingStatus } from "@prisma/client"

const bookUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  authors: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  publicationDate: z.string().datetime().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  summary: z.string().optional(),
  publisher: z.string().optional(),
  language: z.string().optional(),
  isbn: z.string().optional(),
  status: z.enum(["TO_READ", "READING", "FINISHED", "ABANDONED"]).optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  pages: z.number().optional(),
})

// GET /api/books/[id] - Récupérer un livre spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const userBook = await prisma.userBook.findFirst({
      where: {
        id,
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
    })

    if (!userBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ userBook }, { status: 200 })
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/books/[id] - Mettre à jour un livre
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const validatedFields = bookUpdateSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    // Vérifier que le UserBook existe et appartient à l'utilisateur
    const existingUserBook = await prisma.userBook.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        book: true,
      },
    })

    if (!existingUserBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const { 
      status,
      rating, 
      comment, 
      startDate, 
      endDate,
      pages
    } = validatedFields.data

    // Mettre à jour uniquement les données personnelles UserBook
    const userBookUpdateData: any = {}
    if (status !== undefined) userBookUpdateData.status = status as ReadingStatus
    if (rating !== undefined) userBookUpdateData.rating = rating
    if (comment !== undefined) userBookUpdateData.comment = comment
    if (startDate !== undefined) userBookUpdateData.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) userBookUpdateData.endDate = endDate ? new Date(endDate) : null
    if (pages !== undefined) userBookUpdateData.pages = pages

    const updatedUserBook = await prisma.userBook.update({
      where: { id },
      data: userBookUpdateData,
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
      { message: "Book updated successfully", userBook: updatedUserBook },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/books/[id] - Supprimer un livre
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Vérifier que le UserBook existe et appartient à l'utilisateur
    const existingUserBook = await prisma.userBook.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingUserBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    await prisma.userBook.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
