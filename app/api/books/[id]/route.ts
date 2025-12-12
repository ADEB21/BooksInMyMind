import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const bookUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().optional(),
  datePublished: z.string().datetime().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
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

    const book = await prisma.book.findUnique({
      where: {
        id,
        userId: session.user.id, // S'assurer que le livre appartient à l'utilisateur
      },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ book }, { status: 200 })
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

    // Vérifier que le livre existe et appartient à l'utilisateur
    const existingBook = await prisma.book.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const { title, author, datePublished, coverUrl, rating, comment, startDate, endDate } =
      validatedFields.data

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(author !== undefined && { author }),
        ...(datePublished !== undefined && {
          datePublished: datePublished ? new Date(datePublished) : null,
        }),
        ...(coverUrl !== undefined && { coverUrl: coverUrl || null }),
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
        ...(startDate !== undefined && {
          startDate: startDate ? new Date(startDate) : null,
        }),
        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),
      },
    })

    return NextResponse.json(
      { message: "Book updated successfully", book },
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

    // Vérifier que le livre existe et appartient à l'utilisateur
    const existingBook = await prisma.book.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    await prisma.book.delete({
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
