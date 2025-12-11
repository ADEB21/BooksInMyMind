import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Protection : secret dans les headers
    const authHeader = request.headers.get('authorization')
    const secret = process.env.SEED_SECRET || 'change-me-in-production'
    
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Vérifier si déjà seedé
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Database already seeded' })
    }

    // Créer l'utilisateur de test
    const hashedPassword = await bcrypt.hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      },
    })

    // Créer des livres de test
    await prisma.book.create({
      data: {
        title: '1984',
        author: 'George Orwell',
        rating: 5,
        comment: 'Un chef-d\'œuvre dystopique',
        userId: user.id,
      },
    })

    await prisma.book.create({
      data: {
        title: 'Le Seigneur des Anneaux',
        author: 'J.R.R. Tolkien',
        rating: 5,
        comment: 'Une épopée fantastique inoubliable',
        userId: user.id,
      },
    })

    await prisma.book.create({
      data: {
        title: 'Harry Potter à l\'école des sorciers',
        author: 'J.K. Rowling',
        rating: 4,
        comment: 'Le début d\'une saga magique',
        userId: user.id,
      },
    })

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      user: { email: user.email, name: user.name }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
