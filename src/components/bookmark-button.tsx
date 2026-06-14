"use client";

import { useOptimistic } from "react";
import { IconBookmark } from "@tabler/icons-react";
import { toggleBookmark } from "@/app/board/[id]/actions";

export function BookmarkButton({
  postId,
  saved,
}: {
  postId: string;
  saved: boolean;
}) {
  const [opt, addOpt] = useOptimistic(saved, (s, _action: void) => !s);

  return (
    <form
      action={async (formData) => {
        addOpt();
        await toggleBookmark(formData);
      }}
    >
      <input type="hidden" name="post_id" value={postId} />
      <button
        type="submit"
        className={`flex items-center gap-1.5 text-sm transition-colors ${opt ? "text-brand" : "text-muted hover:text-foreground"}`}
      >
        <IconBookmark size={19} stroke={1.75} />
        {opt ? "נשמר" : "שמירה"}
      </button>
    </form>
  );
}
