# 📚 Books in My Mind

Application web de suivi de livres lus avec Next.js 16, Prisma, PostgreSQL et NextAuth v5.

## ✨ Fonctionnalités

- 🔐 **Authentification** : NextAuth v5 avec Credentials (email/password)
- 📖 **Gestion de livres** : CRUD complet (Create, Read, Update, Delete)
- 👤 **Multi-utilisateurs** : Chaque utilisateur a ses propres livres
- 🗄️ **Base PostgreSQL** : Via Prisma ORM
- 🎨 **TailwindCSS** : Styling moderne
- 🔒 **Sécurité** : Mots de passe hashés, validation Zod, routes protégées

## 🚀 Démarrage Rapide

### 1. Générer un secret NextAuth

```bash
openssl rand -base64 32
```

Copier le résultat dans `.env` à la ligne `NEXTAUTH_SECRET=`

### 2. Démarrer PostgreSQL

```bash
npx prisma dev
```

### 3. Configurer la base de données

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrir **http://localhost:3000**

**Utilisateur de test :**
- Email : `test@example.com`
- Password : `password123`

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Démarrage rapide en 5 étapes
- **[SETUP.md](./SETUP.md)** - Guide de configuration complet
- **[COMMANDS.md](./COMMANDS.md)** - Toutes les commandes disponibles
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Structure du projet
- **[docs/API_EXAMPLES.md](./docs/API_EXAMPLES.md)** - Exemples d'utilisation de l'API
- **[docs/GOOGLE_OAUTH.md](./docs/GOOGLE_OAUTH.md)** - Ajouter Google OAuth

## 🛠️ Stack Technique

- **Next.js 16** (App Router)
- **TypeScript**
- **Prisma** (ORM)
- **PostgreSQL**
- **NextAuth v5** (Authentification)
- **Zod** (Validation)
- **bcryptjs** (Hashing)
- **TailwindCSS** (Styling)

## 📡 API Routes

| Route | Méthodes | Description |
|-------|----------|-------------|
| `/api/auth/register` | POST | Inscription utilisateur |
| `/api/auth/[...nextauth]` | GET, POST | Handlers NextAuth |
| `/api/books` | GET, POST | Liste et création de livres |
| `/api/books/[id]` | GET, PUT, DELETE | Opérations sur un livre |

## 🗄️ Modèles de Données

### User
```typescript
{
  id: string
  name?: string
  email?: string
  password?: string  // Hashé avec bcrypt
  books: Book[]
  createdAt: Date
}
```

### Book
```typescript
{
  id: string
  userId: string
  title: string
  author?: string
  coverUrl?: string
  rating?: number    // 1-5
  comment?: string
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Démarrer le serveur de dev
npm run build        # Build de production
npm run start        # Démarrer en production
npm run lint         # Linter le code

npm run db:generate  # Générer le client Prisma
npm run db:push      # Synchroniser le schéma (dev)
npm run db:migrate   # Créer une migration (prod)
npm run db:seed      # Peupler avec des données de test
npm run db:studio    # Ouvrir Prisma Studio (GUI)
```

## 🎯 Prochaines Étapes

- [ ] Créer les pages frontend (login, dashboard, etc.)
- [ ] Ajouter la pagination
- [ ] Implémenter la recherche et les filtres
- [ ] Ajouter des catégories/tags
- [ ] Intégrer Google Books API pour les couvertures
- [ ] Créer des statistiques de lecture
- [ ] Ajouter Google OAuth

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://authjs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

**Développé avec ❤️ et Next.js**
