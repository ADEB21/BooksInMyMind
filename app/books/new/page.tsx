import { redirect } from "next/navigation";
import { auth } from "@/auth";
import NewBookForm from "@/components/organisms/NewBookForm";

export default async function NewBookPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <NewBookForm />;
}
