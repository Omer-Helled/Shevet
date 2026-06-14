import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  IconBookmark,
  IconHeart,
  IconMessageCircle,
  IconLayoutGrid,
} from "@tabler/icons-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { relativeTime } from "@/lib/time";

export const dynamic = "force-dynamic";

type Post = {
  id: string;
  title: string;
  place: string | null;
  image_url: string | null;
  created_at: string;
  like_count: number;
  comment_count: number;
};

export default async function SavedPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  let posts: Post[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("bookmarks")
      .select(
        "post:board_items(id,title,place,image_url,created_at,like_count,comment_count)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    posts = ((data as unknown as { post: Post | null }[]) ?? [])
      .map((b) => b.post)
      .filter((p): p is Post => Boolean(p));
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 md:px-6">
      <h1 className="mb-3 flex items-center gap-2 text-lg font-medium">
        <IconBookmark size={20} stroke={1.75} />
        שמורים
      </h1>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
            <IconBookmark size={24} stroke={1.75} />
          </span>
          <p className="text-sm text-muted">עדיין לא שמרת פוסטים.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/board/${p.id}`}
              className="block overflow-hidden rounded-xl border bg-surface transition-colors hover:border-brand"
            >
              <div className="relative h-36 bg-surface-2">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-muted">
                    <IconLayoutGrid size={28} stroke={1.4} />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm">{p.title}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-muted">
                  <span className="truncate">{p.place ?? ""}</span>
                  <span className="shrink-0">{relativeTime(p.created_at)}</span>
                </div>
                <div className="mt-2 flex items-center gap-4 border-t pt-2 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <IconHeart size={15} stroke={1.75} />
                    {p.like_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconMessageCircle size={15} stroke={1.75} />
                    {p.comment_count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
