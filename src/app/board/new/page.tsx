import Link from "next/link";
import { redirect } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import { getUser } from "@/lib/auth";
import { BoardForm } from "./board-form";

export const dynamic = "force-dynamic";

export default async function NewBoardItemPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-4 md:px-6">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/board"
          aria-label="חזרה"
          className="text-muted transition-colors hover:text-brand"
        >
          <IconArrowRight size={20} stroke={1.75} />
        </Link>
        <h1 className="text-lg font-medium">פרסום חדש בלוח</h1>
      </div>

      <div className="rounded-2xl border bg-surface p-5">
        <BoardForm />
      </div>
    </div>
  );
}
