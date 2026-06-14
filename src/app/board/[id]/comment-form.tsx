"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { IconPhoto, IconSend } from "@tabler/icons-react";
import { addComment, type CommentState } from "./actions";

export function CommentForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState<CommentState, FormData>(
    addComment,
    undefined,
  );
  const [preview, setPreview] = useState<string | null>(null);

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  return (
    <form action={action} className="rounded-xl border bg-surface p-3">
      <input type="hidden" name="post_id" value={postId} />
      <textarea
        name="body"
        rows={2}
        placeholder="כתוב תגובה..."
        className="w-full resize-none bg-transparent text-sm outline-none"
      />

      {preview && (
        <div
          className="mt-2 h-36 w-full rounded-lg border bg-cover bg-center"
          style={{ backgroundImage: `url(${preview})` }}
        />
      )}

      {state?.error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <label
          className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-brand-soft hover:text-brand"
          aria-label="צרף תמונה"
        >
          <IconPhoto size={20} stroke={1.75} />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-strong px-4 py-2 text-sm text-white transition-opacity disabled:opacity-60"
        >
          <IconSend size={16} stroke={1.75} />
          {pending ? "שולח..." : "שלח"}
        </button>
      </div>
    </form>
  );
}
