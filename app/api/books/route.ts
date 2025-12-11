import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// GET /api/books - Récupérer tous les livres de l'utilisateur
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const books = await prisma.book.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ books }, { status: 200 })
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

    const { title, author, coverUrl, rating, comment, startDate, endDate } =
      validatedFields.data

    const book = await prisma.book.create({
      data: {
        title,
        author,
        coverUrl: coverUrl || null,
        rating,
        comment,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      { message: "Book created successfully", book },
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
