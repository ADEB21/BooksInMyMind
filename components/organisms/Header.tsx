'use client'

import Link from 'next/link'
import Icon from '../atoms/Icon'
import Button from '../atoms/Button'
import { handleSignOut } from '@/lib/actions'

interface HeaderProps {
  userName?: string
  isAuthenticated?: boolean
}

export default function Header({ userName, isAuthenticated }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#232946]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#232946] flex items-center justify-center text-[#C1A15B] group-hover:scale-105 transition-transform">
              <Icon name="book" size={20} />
            </div>
            <span className="text-xl font-semibold text-[#232946] hidden sm:block">
              BooksInMyMind
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/books" 
              className="flex items-center gap-2 text-[#232946] hover:text-[#C1A15B] transition-colors"
            >
              <Icon name="book" size={18} />
              <span className="text-sm font-medium">Catalogue</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-[#232946] hover:text-[#C1A15B] transition-colors"
                >
                  <Icon name="star" size={18} />
                  <span className="text-sm font-medium">Ma bibliothèque</span>
                </Link>
              </>
            )}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:block text-sm text-gray-600">
                  Bonjour, <span className="font-medium text-[#232946]">{userName}</span>
                </span>
                <form action={handleSignOut}>
                  <Button variant="ghost" size="sm">
                    <Icon name="logout" size={18} />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
