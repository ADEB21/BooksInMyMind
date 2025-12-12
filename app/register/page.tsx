'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import IconButton from '@/components/atoms/IconButton'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Icon from '@/components/atoms/Icon'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'inscription')
      } else {
        // Rediriger vers la page de connexion avec un message de succès
        router.push('/login?registered=true')
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
            <h1 className="text-3xl font-bold text-[#232946] mb-2">Commencez votre voyage</h1>
            <p className="text-gray-600">Créez votre compte gratuitement</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nom complet"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
            />

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
              helperText="Minimum 6 caractères"
              minLength={6}
              required
              disabled={loading}
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
              disabled={loading}
            />

            <IconButton
              type="submit"
              disabled={loading}
              fullWidth
              size="lg"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </IconButton>
          </form>

          <div className="mt-6 pt-6 border-t border-[#232946]/10">
            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-[#C1A15B] hover:text-[#232946] font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
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
