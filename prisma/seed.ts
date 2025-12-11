import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  })

  console.log('✅ User created:', user.email)

  // Créer quelques livres de test
  const books = await prisma.book.createMany({
    data: [
      {
        userId: user.id,
        title: '1984',
        author: 'George Orwell',
        rating: 5,
        comment: 'Un chef-d\'œuvre dystopique',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-15'),
      },
      {
        userId: user.id,
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        rating: 5,
        comment: 'Magnifique conte philosophique',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-05'),
      },
      {
        userId: user.id,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        rating: 4,
        comment: 'Fascinant aperçu de l\'histoire humaine',
        startDate: new Date('2024-03-01'),
      },
    ],
  })

  console.log(`✅ ${books.count} books created`)
  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
