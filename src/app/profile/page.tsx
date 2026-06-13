import { redirect } from "next/navigation";
import { IconRosetteDiscountCheck, IconLogout } from "@tabler/icons-react";
import { getUser, getProfile } from "@/lib/auth";
import { signOut } from "@/app/login/actions";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const profile = await getProfile();

  const name = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ");
  const display = name || user.email || "משתמש";
  const initials = (name || user.email || "?").trim().slice(0, 2);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 md:px-6">
      <div className="rounded-2xl border bg-surface p-5">
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-accent text-xl text-[#2b1b05]">
            {initials}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-medium">{display}</h1>
              {profile?.is_verified && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] text-accent">
                  <IconRosetteDiscountCheck size={13} stroke={1.75} />
                  מאומת
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
        {profile?.bio && (
          <p className="mt-4 text-sm text-muted">{profile.bio}</p>
        )}
      </div>

      <ProfileForm profile={profile} />

      <form action={signOut} className="mt-4">
        <button
          type="submit"
          className="flex items-center gap-2 text-sm text-red-600 transition-colors hover:opacity-80 dark:text-red-400"
        >
          <IconLogout size={18} stroke={1.75} />
          התנתקות
        </button>
      </form>
    </div>
  );
}
