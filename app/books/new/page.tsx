import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BookForm from "@/components/organisms/BookForm";

export default async function NewBookPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <BookForm mode="create" />;
}
