"use client";

import { useActionState } from "react";
import { createListing, type ListingState } from "../actions";
import { stayTypeLabel, type StayType } from "@/lib/mock";

const inputCls =
  "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand";

const types: StayType[] = ["exchange", "host", "volunteer", "petsit"];
const amenities: { name: string; label: string }[] = [
  { name: "is_kosher", label: "כשר" },
  { name: "is_shabbat_observant", label: "שומר שבת" },
  { name: "has_sukkah", label: "סוכה" },
  { name: "near_shul", label: "ליד בית כנסת" },
];

export function ListingForm() {
  const [state, action, pending] = useActionState<ListingState, FormData>(
    createListing,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input name="title" placeholder="כותרת המודעה" required className={inputCls} />

      <select name="listing_type" defaultValue="exchange" className={inputCls}>
        {types.map((t) => (
          <option key={t} value={t}>
            {stayTypeLabel[t]}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <input name="city" placeholder="עיר" className={inputCls} />
        <input name="country" placeholder="מדינה" className={inputCls} />
      </div>

      <textarea
        name="description"
        placeholder="תיאור הנכס"
        rows={4}
        className={`${inputCls} resize-none`}
      />

      <div className="grid grid-cols-2 gap-2">
        {amenities.map((a) => (
          <label
            key={a.name}
            className="flex items-center gap-2 rounded-lg border bg-surface px-3 py-2.5 text-sm"
          >
            <input type="checkbox" name={a.name} className="size-4 accent-brand" />
            {a.label}
          </label>
        ))}
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-brand-strong px-4 py-2.5 text-sm text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "מפרסם..." : "פרסום מודעה"}
      </button>
    </form>
  );
}
