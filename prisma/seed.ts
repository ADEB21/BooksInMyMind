import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Créer un utilisateur de test
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: await bcrypt.hash('password123', 10),
    },
  })

  console.log('✅ User created')

  // Créer des auteurs
  const authors = {
    orwell: await prisma.author.upsert({ where: { name: 'George Orwell' }, update: {}, create: { name: 'George Orwell' } }),
    tolkien: await prisma.author.upsert({ where: { name: 'J.R.R. Tolkien' }, update: {}, create: { name: 'J.R.R. Tolkien' } }),
    rowling: await prisma.author.upsert({ where: { name: 'J.K. Rowling' }, update: {}, create: { name: 'J.K. Rowling' } }),
    saintExupery: await prisma.author.upsert({ where: { name: 'Antoine de Saint-Exupéry' }, update: {}, create: { name: 'Antoine de Saint-Exupéry' } }),
    harari: await prisma.author.upsert({ where: { name: 'Yuval Noah Harari' }, update: {}, create: { name: 'Yuval Noah Harari' } }),
    camus: await prisma.author.upsert({ where: { name: 'Albert Camus' }, update: {}, create: { name: 'Albert Camus' } }),
    hugo: await prisma.author.upsert({ where: { name: 'Victor Hugo' }, update: {}, create: { name: 'Victor Hugo' } }),
    austen: await prisma.author.upsert({ where: { name: 'Jane Austen' }, update: {}, create: { name: 'Jane Austen' } }),
    hemingway: await prisma.author.upsert({ where: { name: 'Ernest Hemingway' }, update: {}, create: { name: 'Ernest Hemingway' } }),
    fitzgerald: await prisma.author.upsert({ where: { name: 'F. Scott Fitzgerald' }, update: {}, create: { name: 'F. Scott Fitzgerald' } }),
    bradbury: await prisma.author.upsert({ where: { name: 'Ray Bradbury' }, update: {}, create: { name: 'Ray Bradbury' } }),
    asimov: await prisma.author.upsert({ where: { name: 'Isaac Asimov' }, update: {}, create: { name: 'Isaac Asimov' } }),
    christie: await prisma.author.upsert({ where: { name: 'Agatha Christie' }, update: {}, create: { name: 'Agatha Christie' } }),
    dumas: await prisma.author.upsert({ where: { name: 'Alexandre Dumas' }, update: {}, create: { name: 'Alexandre Dumas' } }),
    verne: await prisma.author.upsert({ where: { name: 'Jules Verne' }, update: {}, create: { name: 'Jules Verne' } }),
    dostoievski: await prisma.author.upsert({ where: { name: 'Fiodor Dostoïevski' }, update: {}, create: { name: 'Fiodor Dostoïevski' } }),
    kafka: await prisma.author.upsert({ where: { name: 'Franz Kafka' }, update: {}, create: { name: 'Franz Kafka' } }),
    proust: await prisma.author.upsert({ where: { name: 'Marcel Proust' }, update: {}, create: { name: 'Marcel Proust' } }),
    cervantes: await prisma.author.upsert({ where: { name: 'Miguel de Cervantes' }, update: {}, create: { name: 'Miguel de Cervantes' } }),
    shakespeare: await prisma.author.upsert({ where: { name: 'William Shakespeare' }, update: {}, create: { name: 'William Shakespeare' } }),
  }

  console.log('✅ Authors created')

  // Créer des genres
  const genres = {
    fiction: await prisma.genre.upsert({ where: { name: 'Fiction' }, update: {}, create: { name: 'Fiction' } }),
    dystopie: await prisma.genre.upsert({ where: { name: 'Dystopie' }, update: {}, create: { name: 'Dystopie' } }),
    fantasy: await prisma.genre.upsert({ where: { name: 'Fantasy' }, update: {}, create: { name: 'Fantasy' } }),
    scienceFiction: await prisma.genre.upsert({ where: { name: 'Science-Fiction' }, update: {}, create: { name: 'Science-Fiction' } }),
    philosophie: await prisma.genre.upsert({ where: { name: 'Philosophie' }, update: {}, create: { name: 'Philosophie' } }),
    histoire: await prisma.genre.upsert({ where: { name: 'Histoire' }, update: {}, create: { name: 'Histoire' } }),
    classique: await prisma.genre.upsert({ where: { name: 'Classique' }, update: {}, create: { name: 'Classique' } }),
    romance: await prisma.genre.upsert({ where: { name: 'Romance' }, update: {}, create: { name: 'Romance' } }),
    policier: await prisma.genre.upsert({ where: { name: 'Policier' }, update: {}, create: { name: 'Policier' } }),
    aventure: await prisma.genre.upsert({ where: { name: 'Aventure' }, update: {}, create: { name: 'Aventure' } }),
    jeunesse: await prisma.genre.upsert({ where: { name: 'Jeunesse' }, update: {}, create: { name: 'Jeunesse' } }),
    theatre: await prisma.genre.upsert({ where: { name: 'Théâtre' }, update: {}, create: { name: 'Théâtre' } }),
  }

  console.log('✅ Genres created')

  // Créer des livres avec toutes les métadonnées
  const books = [
    {
      title: '1984',
      summary: 'Dans un monde totalitaire, Winston Smith travaille au Ministère de la Vérité où il réécrit l\'histoire. Mais il rêve de se rebeller contre Big Brother.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
      publicationDate: new Date('1949-06-08'),
      publisher: 'Secker & Warburg',
      language: 'Anglais',
      isbn: '978-0451524935',
      authors: [authors.orwell.id],
      genres: [genres.dystopie.id, genres.fiction.id, genres.classique.id],
    },
    {
      title: 'Le Seigneur des Anneaux',
      summary: 'L\'épopée de Frodon Sacquet qui doit détruire l\'Anneau Unique pour sauver la Terre du Milieu de Sauron.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/91jBdIDqZGL.jpg',
      publicationDate: new Date('1954-07-29'),
      publisher: 'Allen & Unwin',
      language: 'Anglais',
      isbn: '978-0544003415',
      authors: [authors.tolkien.id],
      genres: [genres.fantasy.id, genres.aventure.id, genres.classique.id],
    },
    {
      title: 'Harry Potter à l\'école des sorciers',
      summary: 'Harry Potter découvre qu\'il est un sorcier et entre à Poudlard, l\'école de sorcellerie.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg',
      publicationDate: new Date('1997-06-26'),
      publisher: 'Bloomsbury',
      language: 'Anglais',
      isbn: '978-0439708180',
      authors: [authors.rowling.id],
      genres: [genres.fantasy.id, genres.jeunesse.id, genres.aventure.id],
    },
    {
      title: 'Le Petit Prince',
      summary: 'Un conte philosophique et poétique qui raconte la rencontre d\'un aviateur et d\'un petit prince venu d\'une autre planète.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71OZY035FKL.jpg',
      publicationDate: new Date('1943-04-06'),
      publisher: 'Reynal & Hitchcock',
      language: 'Français',
      isbn: '978-0156012195',
      authors: [authors.saintExupery.id],
      genres: [genres.fiction.id, genres.philosophie.id, genres.classique.id],
    },
    {
      title: 'Sapiens : Une brève histoire de l\'humanité',
      summary: 'Une exploration fascinante de l\'histoire de l\'humanité, de l\'âge de pierre à l\'ère moderne.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg',
      publicationDate: new Date('2011-01-01'),
      publisher: 'Harvill Secker',
      language: 'Anglais',
      isbn: '978-0062316097',
      authors: [authors.harari.id],
      genres: [genres.histoire.id, genres.philosophie.id],
    },
    {
      title: 'L\'Étranger',
      summary: 'Meursault, un homme indifférent, tue un Arabe sur une plage algérienne et doit affronter la justice.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71Q3zGn9j6L.jpg',
      publicationDate: new Date('1942-01-01'),
      publisher: 'Gallimard',
      language: 'Français',
      isbn: '978-2070360024',
      authors: [authors.camus.id],
      genres: [genres.fiction.id, genres.philosophie.id, genres.classique.id],
    },
    {
      title: 'Les Misérables',
      summary: 'L\'histoire de Jean Valjean, ancien forçat en quête de rédemption dans la France du XIXe siècle.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/91HHxxtA1wL.jpg',
      publicationDate: new Date('1862-01-01'),
      publisher: 'A. Lacroix, Verboeckhoven & Cie',
      language: 'Français',
      isbn: '978-2070409228',
      authors: [authors.hugo.id],
      genres: [genres.classique.id, genres.fiction.id, genres.histoire.id],
    },
    {
      title: 'Orgueil et Préjugés',
      summary: 'Elizabeth Bennet et Mr Darcy surmontent leurs préjugés pour trouver l\'amour.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg',
      publicationDate: new Date('1813-01-28'),
      publisher: 'T. Egerton',
      language: 'Anglais',
      isbn: '978-0141439518',
      authors: [authors.austen.id],
      genres: [genres.romance.id, genres.classique.id, genres.fiction.id],
    },
    {
      title: 'Le Vieil Homme et la Mer',
      summary: 'Un vieux pêcheur cubain lutte contre un marlin géant dans une bataille épique.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71FV7P7H8yL.jpg',
      publicationDate: new Date('1952-09-01'),
      publisher: 'Charles Scribner\'s Sons',
      language: 'Anglais',
      isbn: '978-0684801223',
      authors: [authors.hemingway.id],
      genres: [genres.fiction.id, genres.classique.id, genres.aventure.id],
    },
    {
      title: 'Gatsby le Magnifique',
      summary: 'L\'histoire de Jay Gatsby et son amour obsessionnel pour Daisy Buchanan dans l\'Amérique des années 1920.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71FTb9X6wsL.jpg',
      publicationDate: new Date('1925-04-10'),
      publisher: 'Charles Scribner\'s Sons',
      language: 'Anglais',
      isbn: '978-0743273565',
      authors: [authors.fitzgerald.id],
      genres: [genres.fiction.id, genres.classique.id, genres.romance.id],
    },
    {
      title: 'Fahrenheit 451',
      summary: 'Dans un futur dystopique, les pompiers brûlent les livres et Guy Montag commence à remettre en question son rôle.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71OFqSRFDgL.jpg',
      publicationDate: new Date('1953-10-19'),
      publisher: 'Ballantine Books',
      language: 'Anglais',
      isbn: '978-1451673319',
      authors: [authors.bradbury.id],
      genres: [genres.dystopie.id, genres.scienceFiction.id, genres.classique.id],
    },
    {
      title: 'Fondation',
      summary: 'Hari Seldon prédit la chute de l\'Empire Galactique et crée la Fondation pour préserver le savoir.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81gPHQJr7VL.jpg',
      publicationDate: new Date('1951-06-01'),
      publisher: 'Gnome Press',
      language: 'Anglais',
      isbn: '978-0553293357',
      authors: [authors.asimov.id],
      genres: [genres.scienceFiction.id, genres.classique.id],
    },
    {
      title: 'Le Crime de l\'Orient-Express',
      summary: 'Hercule Poirot enquête sur un meurtre dans le célèbre train Orient-Express.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71W4aCbvXyL.jpg',
      publicationDate: new Date('1934-01-01'),
      publisher: 'Collins Crime Club',
      language: 'Anglais',
      isbn: '978-0062693662',
      authors: [authors.christie.id],
      genres: [genres.policier.id, genres.fiction.id, genres.classique.id],
    },
    {
      title: 'Les Trois Mousquetaires',
      summary: 'D\'Artagnan rejoint les mousquetaires du roi et vit de nombreuses aventures.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81zN7udGRUL.jpg',
      publicationDate: new Date('1844-01-01'),
      publisher: 'Le Siècle',
      language: 'Français',
      isbn: '978-2070413676',
      authors: [authors.dumas.id],
      genres: [genres.aventure.id, genres.classique.id, genres.histoire.id],
    },
    {
      title: 'Vingt Mille Lieues sous les mers',
      summary: 'Le capitaine Nemo et son sous-marin Nautilus explorent les profondeurs océaniques.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81kJLC7h8qL.jpg',
      publicationDate: new Date('1870-01-01'),
      publisher: 'Pierre-Jules Hetzel',
      language: 'Français',
      isbn: '978-2253006329',
      authors: [authors.verne.id],
      genres: [genres.aventure.id, genres.scienceFiction.id, genres.classique.id],
    },
    {
      title: 'Crime et Châtiment',
      summary: 'Raskolnikov, un étudiant pauvre, commet un meurtre et doit affronter sa conscience.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71O2XIytdqL.jpg',
      publicationDate: new Date('1866-01-01'),
      publisher: 'The Russian Messenger',
      language: 'Russe',
      isbn: '978-0140449136',
      authors: [authors.dostoievski.id],
      genres: [genres.classique.id, genres.fiction.id, genres.philosophie.id],
    },
    {
      title: 'La Métamorphose',
      summary: 'Gregor Samsa se réveille un matin transformé en insecte géant.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71qKQ8xKFQL.jpg',
      publicationDate: new Date('1915-01-01'),
      publisher: 'Kurt Wolff Verlag',
      language: 'Allemand',
      isbn: '978-0553213690',
      authors: [authors.kafka.id],
      genres: [genres.fiction.id, genres.classique.id, genres.philosophie.id],
    },
    {
      title: 'Du côté de chez Swann',
      summary: 'Premier tome de À la recherche du temps perdu, une exploration de la mémoire et du temps.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71vK0rE0cYL.jpg',
      publicationDate: new Date('1913-11-14'),
      publisher: 'Grasset',
      language: 'Français',
      isbn: '978-2070754205',
      authors: [authors.proust.id],
      genres: [genres.classique.id, genres.fiction.id],
    },
    {
      title: 'Don Quichotte',
      summary: 'Les aventures d\'un hidalgo devenu fou qui se prend pour un chevalier errant.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/81a5KHEkwIL.jpg',
      publicationDate: new Date('1605-01-16'),
      publisher: 'Francisco de Robles',
      language: 'Espagnol',
      isbn: '978-0060934347',
      authors: [authors.cervantes.id],
      genres: [genres.classique.id, genres.fiction.id, genres.aventure.id],
    },
    {
      title: 'Hamlet',
      summary: 'Le prince Hamlet cherche à venger la mort de son père.',
      coverUrl: 'https://images-na.ssl-images-amazon.com/images/I/71XJ8R8qTYL.jpg',
      publicationDate: new Date('1603-01-01'),
      publisher: 'Nicholas Ling and John Trundell',
      language: 'Anglais',
      isbn: '978-0743477124',
      authors: [authors.shakespeare.id],
      genres: [genres.theatre.id, genres.classique.id],
    },
  ]

  console.log('📚 Creating books...')
  
  for (const bookData of books) {
    await prisma.book.create({
      data: {
        title: bookData.title,
        summary: bookData.summary,
        coverUrl: bookData.coverUrl,
        publicationDate: bookData.publicationDate,
        publisher: bookData.publisher,
        language: bookData.language,
        isbn: bookData.isbn,
        authors: {
          connect: bookData.authors.map(id => ({ id })),
        },
        genres: {
          connect: bookData.genres.map(id => ({ id })),
        },
      },
    })
  }

  console.log('✅ Books created')

  // Ajouter quelques livres à la bibliothèque de l'utilisateur
  const allBooks = await prisma.book.findMany()
  
  await prisma.userBook.create({
    data: {
      userId: user.id,
      bookId: allBooks.find(b => b.title === '1984')!.id,
      status: 'FINISHED',
      rating: 5,
      comment: 'Un chef-d\'œuvre dystopique qui reste terriblement actuel.',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-15'),
      pages: 328,
    },
  })

  await prisma.userBook.create({
    data: {
      userId: user.id,
      bookId: allBooks.find(b => b.title === 'Le Petit Prince')!.id,
      status: 'FINISHED',
      rating: 5,
      comment: 'Magnifique conte philosophique, à relire régulièrement.',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-05'),
      pages: 96,
    },
  })

  await prisma.userBook.create({
    data: {
      userId: user.id,
      bookId: allBooks.find(b => b.title === 'Sapiens : Une brève histoire de l\'humanité')!.id,
      status: 'READING',
      rating: 4,
      comment: 'Fascinant aperçu de l\'histoire humaine, très bien documenté.',
      startDate: new Date('2024-03-01'),
      pages: 512,
    },
  })

  await prisma.userBook.create({
    data: {
      userId: user.id,
      bookId: allBooks.find(b => b.title === 'Le Seigneur des Anneaux')!.id,
      status: 'TO_READ',
    },
  })

  await prisma.userBook.create({
    data: {
      userId: user.id,
      bookId: allBooks.find(b => b.title === 'Harry Potter à l\'école des sorciers')!.id,
      status: 'FINISHED',
      rating: 5,
      comment: 'Le début d\'une saga magique inoubliable !',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2023-12-10'),
      pages: 309,
    },
  })

  console.log('✅ UserBooks created')
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
