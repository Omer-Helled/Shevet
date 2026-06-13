"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { IconPhoto } from "@tabler/icons-react";
import { createBoardItem, type BoardState } from "../actions";
import { boardKindLabel, type BoardKind } from "@/lib/mock";

const inputCls =
  "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand";

const kinds: BoardKind[] = ["volunteer", "job", "offer", "package"];

export function BoardForm() {
  const [state, action, pending] = useActionState<BoardState, FormData>(
    createBoardItem,
    undefined,
  );
  const [preview, setPreview] = useState<string | null>(null);

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="cursor-pointer">
        {preview ? (
          <div
            className="h-44 w-full rounded-lg border bg-cover bg-center"
            style={{ backgroundImage: `url(${preview})` }}
          />
        ) : (
          <div className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted">
            <IconPhoto size={28} stroke={1.5} />
            <span className="text-sm">הוסף תמונה</span>
          </div>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={onFile}
          className="hidden"
        />
      </label>

      <input name="title" placeholder="כותרת" required className={inputCls} />

      <select name="kind" defaultValue="volunteer" className={inputCls}>
        {kinds.map((k) => (
          <option key={k} value={k}>
            {boardKindLabel[k]}
          </option>
        ))}
      </select>

      <input name="place" placeholder="מיקום (עיר, מדינה)" className={inputCls} />

      <textarea
        name="body"
        placeholder="פרטים"
        rows={4}
        className={`${inputCls} resize-none`}
      />

      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-brand-strong px-4 py-2.5 text-sm text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "מפרסם..." : "פרסום"}
      </button>
    </form>
  );
}
