"use client";

import { use } from "react";
import { redirect } from "next/navigation";
import BookForm from "@/components/organisms/BookForm";
import Link from "next/link";
import Icon from "@/components/atoms/Icon";

export default function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-[#232946]/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/books/${id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-[#232946] transition-colors"
            >
              <Icon name="book" size={20} />
              <span className="font-medium">Retour au livre</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <BookForm bookId={id} mode="edit" />
      </main>
    </div>
  );
}
