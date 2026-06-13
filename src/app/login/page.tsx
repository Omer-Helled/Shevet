import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { AuthForm } from "./auth-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/profile");

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col px-4 py-10">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-xl bg-brand-strong text-white">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3 18 13 6 13Z" />
            <path d="M12 21 6 11 18 11Z" />
          </svg>
        </span>
        <div>
          <h1 className="text-xl font-medium">ברוכים הבאים ל-Shevet</h1>
          <p className="mt-1 text-sm text-muted">
            הקהילה היהודית העולמית — לינה, התנדבות וגילוי קהילות.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-surface p-5">
        <AuthForm />
      </div>

      <Link
        href="/"
        className="mt-4 text-center text-xs text-muted transition-colors hover:text-brand"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
