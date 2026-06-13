import {
  IconHeartHandshake,
  IconBriefcase,
  IconHeart,
  IconPackage,
  IconChevronLeft,
} from "@tabler/icons-react";
import { board, boardKindLabel, type BoardKind } from "@/lib/mock";
import type { ComponentType } from "react";

type IconType = ComponentType<{ size?: number; stroke?: number; className?: string }>;

const kindIcon: Record<BoardKind, IconType> = {
  volunteer: IconHeartHandshake,
  job: IconBriefcase,
  offer: IconHeart,
  package: IconPackage,
};

const kindTint: Record<BoardKind, string> = {
  volunteer: "bg-brand-soft text-brand",
  job: "bg-accent-soft text-accent",
  offer: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  package: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

const tabs = ["הכל", "התנדבות", "עבודות", "עזרה", "חבילות"];

export default function BoardPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
      <h1 className="mb-3 text-lg font-medium">לוח הזדמנויות</h1>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t, i) => (
          <span
            key={t}
            className={
              i === 0
                ? "shrink-0 rounded-full bg-brand-strong px-3 py-1.5 text-xs text-white"
                : "shrink-0 rounded-full border bg-surface px-3 py-1.5 text-xs text-muted"
            }
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {board.map((b) => {
          const Icon = kindIcon[b.kind];
          return (
            <article
              key={b.id}
              className="flex items-center gap-3 rounded-xl border bg-surface p-3"
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-lg ${kindTint[b.kind]}`}
              >
                <Icon size={20} stroke={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted">
                    {boardKindLabel[b.kind]}
                  </span>
                  <span className="text-[11px] text-muted">{b.meta}</span>
                </div>
                <p className="truncate text-sm">{b.title}</p>
                <p className="truncate text-xs text-muted">{b.place}</p>
              </div>
              <IconChevronLeft size={18} className="shrink-0 text-muted" />
            </article>
          );
        })}
      </div>
    </div>
  );
}
