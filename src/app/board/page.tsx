import Link from "next/link";
import Image from "next/image";
import { IconPlus, IconLayoutGrid, IconMessageCircle } from "@tabler/icons-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { Avatar } from "@/components/avatar";
import { LikeButton } from "@/components/like-button";
import { BookmarkButton } from "@/components/bookmark-button";
import { ShareButton } from "@/components/share-button";
import { boardKindLabel, type BoardKind } from "@/lib/mock";
import { relativeTime } from "@/lib/time";
import { toggleLike } from "./[id]/actions";

export const dynamic = "force-dynamic";

const filters: { label: string; kind?: BoardKind }[] = [
  { label: "הכל" },
  { label: "התנדבות", kind: "volunteer" },
  { label: "עבודות", kind: "job" },
  { label: "עזרה", kind: "offer" },
  { label: "חבילות", kind: "package" },
];

type Author = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
} | null;

type Item = {
  id: string;
  title: string;
  body: string | null;
  place: string | null;
  kind: BoardKind;
  image_url: string | null;
  created_at: string;
  like_count: number;
  comment_count: number;
  author: Author;
};

function nameOf(a: Author) {
  return [a?.first_name, a?.last_name].filter(Boolean).join(" ") || "משתמש";
}

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;

  let items: Item[] = [];
  let likedSet = new Set<string>();
  let savedSet = new Set<string>();

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase
      .from("board_items")
      .select(
        "id,title,body,place,kind,image_url,created_at,like_count,comment_count,author:profiles!board_items_author_id_fkey(id,first_name,last_name,avatar_url)",
      )
      .order("created_at", { ascending: false });
    if (kind) query = query.eq("kind", kind);

    const [{ data }, user] = await Promise.all([query, getUser()]);
    items = (data as unknown as Item[]) ?? [];

    if (user && items.length) {
      const ids = items.map((i) => i.id);
      const [pl, bm] = await Promise.all([
        supabase.from("post_likes").select("post_id").eq("user_id", user.id).in("post_id", ids),
        supabase.from("bookmarks").select("post_id").eq("user_id", user.id).in("post_id", ids),
      ]);
      likedSet = new Set(((pl.data ?? []) as { post_id: string }[]).map((r) => r.post_id));
      savedSet = new Set(((bm.data ?? []) as { post_id: string }[]).map((r) => r.post_id));
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-4 md:px-6">
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
        <div className="flex flex-col gap-4">
          {items.map((p) => {
            const author = `/u/${p.author?.id ?? ""}`;
            return (
              <article
                key={p.id}
                className="overflow-hidden rounded-2xl border bg-surface"
              >
                <div className="flex items-center gap-3 p-3">
                  <Link href={author}>
                    <Avatar name={nameOf(p.author)} src={p.author?.avatar_url} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={author} className="block truncate text-sm">
                      {nameOf(p.author)}
                    </Link>
                    <div className="truncate text-xs text-muted">
                      {relativeTime(p.created_at)}
                      {p.place ? ` · ${p.place}` : ""}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                    {boardKindLabel[p.kind]}
                  </span>
                </div>

                <div className="px-3 pb-3">
                  <h2 className="text-sm font-medium">{p.title}</h2>
                  {p.body && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
                      {p.body}
                    </p>
                  )}
                </div>

                {p.image_url && (
                  <Link
                    href={`/board/${p.id}`}
                    prefetch
                    className="relative block aspect-video bg-surface-2"
                  >
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 576px"
                      className="object-cover"
                    />
                  </Link>
                )}

                <div className="flex flex-wrap items-center gap-4 border-t px-3 py-2 text-sm">
                  <LikeButton
                    action={toggleLike}
                    hidden={{ post_id: p.id }}
                    liked={likedSet.has(p.id)}
                    count={p.like_count}
                  />
                  <Link
                    href={`/board/${p.id}`}
                    prefetch
                    className="flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
                  >
                    <IconMessageCircle size={19} stroke={1.75} />
                    {p.comment_count}
                  </Link>
                  <BookmarkButton postId={p.id} saved={savedSet.has(p.id)} />
                  <ShareButton path={`/board/${p.id}`} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
