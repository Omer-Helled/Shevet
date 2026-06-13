import Link from "next/link";
import {
  IconHeartHandshake,
  IconBriefcase,
  IconHeart,
  IconPackage,
  IconPlus,
  IconLayoutGrid,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { boardKindLabel, type BoardKind } from "@/lib/mock";

export const dynamic = "force-dynamic";

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

type Item = {
  id: string;
  title: string;
  place: string | null;
  kind: BoardKind;
};

export default async function BoardPage() {
  let items: Item[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("board_items")
      .select("id,title,place,kind")
      .order("created_at", { ascending: false });
    items = (data as Item[]) ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-medium">לוח הזדמנויות</h1>
        <Link
          href="/board/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-strong px-3 py-1.5 text-sm text-white"
        >
          <IconPlus size={16} stroke={2} />
          פרסום
        </Link>
      </div>

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

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
            <IconLayoutGrid size={24} stroke={1.75} />
          </span>
          <p className="text-sm text-muted">עדיין אין מודעות בלוח. פרסם את הראשונה!</p>
          <Link
            href="/board/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-strong px-4 py-2 text-sm text-white"
          >
            <IconPlus size={16} stroke={2} />
            פרסום
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const Icon = kindIcon[item.kind];
            return (
              <article
                key={item.id}
                className="flex items-center gap-3 rounded-xl border bg-surface p-3"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-lg ${kindTint[item.kind]}`}
                >
                  <Icon size={20} stroke={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5">
                    <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted">
                      {boardKindLabel[item.kind]}
                    </span>
                  </div>
                  <p className="truncate text-sm">{item.title}</p>
                  {item.place && (
                    <p className="truncate text-xs text-muted">{item.place}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
