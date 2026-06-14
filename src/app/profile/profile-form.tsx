"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { IconCamera } from "@tabler/icons-react";
import { updateProfile, type ProfileState } from "./actions";
import type { Profile } from "@/lib/auth";

const inputCls =
  "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    undefined,
  );
  const name =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "מש";
  const [preview, setPreview] = useState<string | null>(profile?.avatar_url ?? null);

  function onAvatar(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  }

  return (
    <form action={action} className="mt-4 rounded-2xl border bg-surface p-5">
      <h2 className="mb-3 text-sm font-medium">עריכת פרופיל</h2>

      <label className="mx-auto mb-4 block w-fit cursor-pointer">
        <span className="relative block size-20 overflow-hidden rounded-full bg-accent">
          {preview ? (
            <span
              className="block size-full bg-cover bg-center"
              style={{ backgroundImage: `url(${preview})` }}
            />
          ) : (
            <span className="grid size-full place-items-center text-xl text-[#3a1c0e]">
              {name.trim().slice(0, 2)}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 grid place-items-center bg-black/40 py-1 text-white">
            <IconCamera size={16} stroke={1.75} />
          </span>
        </span>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={onAvatar}
          className="hidden"
        />
      </label>

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
