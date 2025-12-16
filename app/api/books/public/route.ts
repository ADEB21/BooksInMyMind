import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/books/public - Récupérer tous les livres de la base de données
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const genre = searchParams.get("genre")
    const author = searchParams.get("author")

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
      ]
    }

    if (genre) {
      where.genres = {
        some: {
          name: { contains: genre, mode: "insensitive" }
        }
      }
    }

    if (author) {
      where.authors = {
        some: {
          name: { contains: author, mode: "insensitive" }
        }
      }
    }

    const books = await prisma.book.findMany({
      where,
      include: {
        authors: true,
        genres: true,
        _count: {
          select: { userBooks: true }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ books }, { status: 200 })
  } catch (error) {
    console.error("Error fetching public books:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
