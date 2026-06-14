"use client";

import { useOptimistic } from "react";
import { IconHeart } from "@tabler/icons-react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  hidden: Record<string, string>;
  liked: boolean;
  count: number;
  size?: number;
  textClass?: string;
};

// Optimistic like: the heart toggles instantly on click, then the server action persists it.
export function LikeButton({
  action,
  hidden,
  liked,
  count,
  size = 19,
  textClass = "text-sm",
}: Props) {
  const [opt, addOpt] = useOptimistic(
    { liked, count },
    (state, _action: void) => ({
      liked: !state.liked,
      count: state.count + (state.liked ? -1 : 1),
    }),
  );

  return (
    <form
      action={async (formData) => {
        addOpt();
        await action(formData);
      }}
    >
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="submit"
        className={`flex items-center gap-1.5 ${textClass} transition-colors ${opt.liked ? "text-red-500" : "text-muted hover:text-foreground"}`}
      >
        <IconHeart size={size} stroke={1.75} />
        {opt.count}
      </button>
    </form>
  );
}
