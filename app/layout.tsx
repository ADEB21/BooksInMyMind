import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
