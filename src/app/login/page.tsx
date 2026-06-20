import { redirect } from "next/navigation";
import { IconBed, IconHeartHandshake, IconMapPin } from "@tabler/icons-react";
import { getUser } from "@/lib/auth";
import { AuthForm } from "./auth-form";

export const dynamic = "force-dynamic";

const features = [
  { icon: IconBed, label: "חילופי בתים ואירוח ברחבי העולם" },
  { icon: IconHeartHandshake, label: "התנדבות, עבודה ועזרה בקהילה" },
  { icon: IconMapPin, label: "גילוי מוקדים וקהילות יהודיות" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getUser();
  if (user) redirect("/");
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-10">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-brand-strong text-white">
          <svg
            width="30"
            height="30"
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
        <h1 className="text-2xl font-medium">Shevet</h1>
        <p className="mt-1 text-sm text-muted">
          הקהילה היהודית העולמית — לינה, התנדבות וגילוי קהילות.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-2.5">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="flex items-center gap-3 text-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon size={18} stroke={1.75} />
              </span>
              {f.label}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          ההתחברות לא הושלמה. נסה שוב — ואם זה חוזר, ייתכן שצריך לאשר את כתובת
          ההפניה בהגדרות. ({error})
        </div>
      )}

      <div className="rounded-2xl border bg-surface p-5">
        <AuthForm />
      </div>
    </div>
  );
}
