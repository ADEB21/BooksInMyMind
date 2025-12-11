import Link from "next/link"
import { auth } from "@/auth"
import Header from "@/components/organisms/Header"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Icon from "@/components/atoms/Icon"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <Header 
        userName={session?.user?.name || undefined} 
        isAuthenticated={!!session} 
      />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-32 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#232946] mb-6 leading-tight">
            Votre voyage de lecture,
            <br />
            <span className="text-[#C1A15B]">en toute sérénité</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Capturez vos pensées, suivez votre progression et redécouvrez 
            le plaisir de la lecture avec BooksInMyMind.
          </p>

          {session ? (
            <Link href="/dashboard">
              <Button size="lg">
                <Icon name="book" size={20} />
                Accéder à ma bibliothèque
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" fullWidth>
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary" fullWidth>
                  Se connecter
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="pb-20 lg:pb-32">
          <div className="grid md:grid-cols-3 gap-8">
            <Card padding="lg">
              <div className="w-14 h-14 rounded-2xl bg-[#232946] flex items-center justify-center text-[#C1A15B] mb-6">
                <Icon name="book" size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#232946] mb-3">
                Suivez vos lectures
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Organisez votre bibliothèque personnelle et gardez une trace de chaque livre lu.
              </p>
            </Card>

            <Card padding="lg">
              <div className="w-14 h-14 rounded-2xl bg-[#232946] flex items-center justify-center text-[#C1A15B] mb-6">
                <Icon name="star" size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#232946] mb-3">
                Capturez vos pensées
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Notez vos impressions et créez un journal de lecture personnel et intime.
              </p>
            </Card>

            <Card padding="lg">
              <div className="w-14 h-14 rounded-2xl bg-[#232946] flex items-center justify-center text-[#C1A15B] mb-6">
                <Icon name="chart" size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#232946] mb-3">
                Visualisez votre parcours
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Découvrez vos statistiques et célébrez votre progression de lecture.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232946]/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-500">
            © 2026 BooksInMyMind - Développé par Arthur DEBRUILLE pour les amoureux de la lecture
          </p>
        </div>
      </footer>
    </div>
  )
}
