# Books in My Mind

Application web de suivi de lecture construite avec Next.js (App Router), Prisma et PostgreSQL.

## Fonctionnalités

- **Authentification**
  - NextAuth v5 (Credentials email/password)
  - Persistance via Prisma Adapter
- **Bibliothèque personnelle**
  - Un catalogue `Book` partagé (métadonnées: titre, auteurs, genres, ISBN, couverture, résumé...)
  - Une relation `UserBook` par utilisateur (statut, dates, note, commentaire, pages)
- **Statuts de lecture**
  - `TO_READ`, `READING`, `FINISHED`, `ABANDONED`
- **API sécurisée**
  - Endpoints protégés par session (`auth()`)
  - Validation des entrées via Zod

## Prérequis

- **Node.js**: voir `.nvmrc` (actuellement `24.11.1`)
- **PostgreSQL**: en local ou via Prisma Postgres

## Démarrage (développement)

### 1) Installer les dépendances

```bash
npm install
```

### 2) Configurer les variables d’environnement

Copier l’exemple:

```bash
cp .env.example .env
```

Puis renseigner au minimum:

- `DATABASE_URL`
- `NEXTAUTH_SECRET` (générer avec `openssl rand -base64 32`)
- `NEXTAUTH_URL` (par défaut `http://localhost:3000`)

Optionnel:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### 3) Démarrer la base de données

Deux options:

- **PostgreSQL local**
  - Utilise un `DATABASE_URL` du type: `postgresql://USER:PASSWORD@localhost:5432/books_db`
- **Prisma Postgres (dev)**
  - Démarre une instance de dev:

```bash
npx prisma dev
```

### 4) Initialiser la base

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5) Lancer l’application

```bash
npm run dev
```

Ouvrir `http://localhost:3000`.

Compte de test (seed):

- **Email**: `test@example.com`
- **Password**: `password123`

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Prisma 6**
- **PostgreSQL**
- **NextAuth v5** + `@auth/prisma-adapter`
- **Zod**
- **TailwindCSS v4**

## Architecture

L’application est une **Next.js App Router**.

- **UI / Pages**: `app/*` (Server Components par défaut)
- **API**: `app/api/*/route.ts` (Route Handlers)
- **Auth**: `auth.ts` (NextAuth v5)
- **DB**: `lib/prisma.ts` (singleton PrismaClient)

### Auth & protection

- **Handlers NextAuth**: `app/api/auth/[...nextauth]/route.ts` (ré-exporte `GET`/`POST` depuis `auth.ts`)
- **Inscription**: `app/api/auth/register/route.ts` (validation Zod + hash `bcryptjs`)
- **Protection des routes**:
  - API: vérification de session via `auth()` au début des handlers
  - Pages: la protection est gérée côté pages / appels API (le `middleware.ts` laisse passer les requêtes)

### Accès aux données

- Le modèle sépare:
  - `Book` (métadonnées partagées)
  - `UserBook` (données “bibliothèque” propres à l’utilisateur: statut, notes, dates, etc.)
- Les handlers API utilisent Prisma et incluent souvent `book` + (`authors`, `genres`) pour retourner des objets complets.

### Conventions API

- **Validation**: Zod via `safeParse()` avec erreurs détaillées (`400`)
- **Auth**: `401` si pas de session
- **Accès aux ressources**: les routes `app/api/books/[id]` manipulent un **`UserBook.id`** (pas `Book.id`) pour garantir l’isolation par utilisateur

## Arborescence (simplifiée)

```text
books-in-my-mind/
  app/
    api/
      auth/
        register/route.ts
        [...nextauth]/route.ts
      books/
        route.ts
        [id]/route.ts
        [id]/add-to-library/route.ts
    books/
    dashboard/
    login/
    register/
    layout.tsx
    page.tsx
    globals.css
  components/
    atoms/
    molecules/
    organisms/
  lib/
    prisma.ts
    actions.ts
  prisma/
    schema.prisma
    migrations/
    seed.ts
  public/
  types/
    next-auth.d.ts
  auth.ts
  middleware.ts
  next.config.ts
  package.json
```

## Modèle de données (résumé)

- **User**
  - Auth + profils
- **Book**
  - Métadonnées globales (titre, auteurs, genres, ISBN, etc.)
- **Author / Genre**
  - Tables de référence reliées à `Book`
- **UserBook**
  - Données spécifiques utilisateur (statut, dates, note, commentaire...)

## API

Les routes API se trouvent dans `app/api/*`.

| Route | Méthodes | Description |
|------|----------|-------------|
| `/api/auth/register` | POST | Inscription (credentials) |
| `/api/auth/[...nextauth]` | GET, POST | Handlers NextAuth |
| `/api/books` | GET, POST | Liste + création (crée `Book` + `UserBook`) |
| `/api/books/[id]` | GET, PUT, DELETE | Opérations sur **un `UserBook`** (id de la relation utilisateur) |

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint

npm run db:generate
npm run db:push
npm run db:migrate
npm run db:seed
npm run db:studio
```

Note: le repo contient aussi `vercel-build` pour builder en CI (Prisma generate + migrate deploy + build Next).

## Déploiement (production)

- Variables d’environnement minimales:
  - `DATABASE_URL`
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
- Prisma:
  - En prod, on applique les migrations via `prisma migrate deploy` (déjà inclus dans `npm run vercel-build`).

Pour un exemple de configuration, voir `.env.production.example`.

## Structure du projet

- `app/`
  - Pages (home, login, register, dashboard, books)
  - API (`app/api/...`)
- `prisma/`
  - `schema.prisma`
  - `seed.ts`
- `auth.ts`
  - Configuration NextAuth
