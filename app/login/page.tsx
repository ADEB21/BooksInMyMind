'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import IconButton from '@/components/atoms/IconButton'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Icon from '@/components/atoms/Icon'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="w-12 h-12 rounded-xl bg-[#232946] flex items-center justify-center text-[#C1A15B] group-hover:scale-105 transition-transform">
            <Icon name="book" size={24} />
          </div>
          <span className="text-2xl font-bold text-[#232946]">BooksInMyMind</span>
        </Link>

        <Card padding="lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#232946] mb-2">Bon retour</h1>
            <p className="text-gray-600">Connectez-vous pour continuer votre voyage</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />

            <IconButton
              type="submit"
              disabled={loading}
              fullWidth
              size="lg"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </IconButton>
          </form>

          <div className="mt-6 pt-6 border-t border-[#232946]/10">
            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#C1A15B] hover:text-[#232946] font-semibold transition-colors">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-[#C1A15B]/10 border border-[#C1A15B]/20 rounded-xl">
            <p className="text-sm text-[#232946] font-semibold mb-2">🔑 Compte de démonstration</p>
            <p className="text-sm text-gray-700">Email : test@example.com</p>
            <p className="text-sm text-gray-700">Mot de passe : password123</p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-[#232946] transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
