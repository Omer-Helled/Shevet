import Link from "next/link";
import Image from "next/image";
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
import { relativeTime } from "@/lib/time";

export const dynamic = "force-dynamic";

type IconType = ComponentType<{ size?: number; stroke?: number; className?: string }>;

const kindIcon: Record<BoardKind, IconType> = {
  volunteer: IconHeartHandshake,
  job: IconBriefcase,
  offer: IconHeart,
  package: IconPackage,
};

const filters: { label: string; kind?: BoardKind }[] = [
  { label: "הכל" },
  { label: "התנדבות", kind: "volunteer" },
  { label: "עבודות", kind: "job" },
  { label: "עזרה", kind: "offer" },
  { label: "חבילות", kind: "package" },
];

type Item = {
  id: string;
  title: string;
  place: string | null;
  kind: BoardKind;
  image_url: string | null;
  created_at: string;
};

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;

  let items: Item[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase
      .from("board_items")
      .select("id,title,place,kind,image_url,created_at")
      .order("created_at", { ascending: false });
    if (kind) query = query.eq("kind", kind);
    const { data } = await query;
    items = (data as Item[]) ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 md:px-6">
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
        {filters.map((f) => {
          const active = (f.kind ?? undefined) === (kind ?? undefined);
          return (
            <Link
              key={f.label}
              href={f.kind ? `/board?kind=${f.kind}` : "/board"}
              className={
                active
                  ? "shrink-0 rounded-full bg-brand-strong px-3 py-1.5 text-xs text-white"
                  : "shrink-0 rounded-full border bg-surface px-3 py-1.5 text-xs text-muted"
              }
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
            <IconLayoutGrid size={24} stroke={1.75} />
          </span>
          <p className="text-sm text-muted">אין מודעות בקטגוריה הזו עדיין.</p>
          <Link
            href="/board/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-strong px-4 py-2 text-sm text-white"
          >
            <IconPlus size={16} stroke={2} />
            פרסום מודעה
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = kindIcon[item.kind];
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border bg-surface"
              >
                <div className="relative h-40 bg-surface-2">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-muted">
                      <Icon size={30} stroke={1.4} />
                    </div>
                  )}
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-surface/90 px-2 py-0.5 text-[11px] text-brand">
                    <Icon size={13} stroke={1.75} />
                    {boardKindLabel[item.kind]}
                  </span>
                </div>
                <div className="p-3">
                  <p className="truncate text-sm">{item.title}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted">
                    <span className="truncate">{item.place ?? ""}</span>
                    <span className="shrink-0">{relativeTime(item.created_at)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
