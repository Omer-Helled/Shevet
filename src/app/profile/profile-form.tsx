"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";
import type { Profile } from "@/lib/auth";

const inputCls =
  "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    undefined,
  );

  return (
    <form action={action} className="mt-4 rounded-2xl border bg-surface p-5">
      <h2 className="mb-3 text-sm font-medium">עריכת פרופיל</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="first_name"
          defaultValue={profile?.first_name ?? ""}
          placeholder="שם פרטי"
          className={inputCls}
        />
        <input
          name="last_name"
          defaultValue={profile?.last_name ?? ""}
          placeholder="שם משפחה"
          className={inputCls}
        />
      </div>
      <input
        name="home_city"
        defaultValue={profile?.home_city ?? ""}
        placeholder="עיר מגורים"
        className={`${inputCls} mt-3`}
      />
      <textarea
        name="bio"
        defaultValue={profile?.bio ?? ""}
        placeholder="כמה מילים עליך"
        rows={3}
        className={`${inputCls} mt-3 resize-none`}
      />

      {state?.error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      {state?.ok && (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
          הפרופיל נשמר.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-lg bg-brand-strong px-4 py-2 text-sm text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "שומר..." : "שמירה"}
      </button>
    </form>
  );
}
