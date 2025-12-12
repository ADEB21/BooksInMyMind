import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BooksInMyMind - Votre bibliothèque personnelle",
    template: "%s | BooksInMyMind"
  },
  description: "Suivez vos lectures, notez vos impressions et créez votre journal de lecture personnel avec BooksInMyMind.",
  keywords: ["livres", "lecture", "bibliothèque", "notes", "journal de lecture", "tracker"],
  authors: [{ name: "Arthur DEBRUILLE" }],
  creator: "Arthur DEBRUILLE",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://books-in-my-mind.vercel.app",
    title: "BooksInMyMind - Votre bibliothèque personnelle",
    description: "Suivez vos lectures, notez vos impressions et créez votre journal de lecture personnel.",
    siteName: "BooksInMyMind",
  },
  twitter: {
    card: "summary_large_image",
    title: "BooksInMyMind - Votre bibliothèque personnelle",
    description: "Suivez vos lectures, notez vos impressions et créez votre journal de lecture personnel.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
          <Header 
            userName={session?.user?.name || undefined} 
            isAuthenticated={!!session} 
          />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
