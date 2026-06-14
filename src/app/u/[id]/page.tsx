import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  IconArrowRight,
  IconRosetteDiscountCheck,
  IconMapPin,
  IconHeart,
  IconMessageCircle,
  IconLayoutGrid,
} from "@tabler/icons-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Avatar } from "@/components/avatar";
import { type BoardKind } from "@/lib/mock";
import { relativeTime } from "@/lib/time";

export const dynamic = "force-dynamic";

type Prof = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  home_city: string | null;
  is_verified: boolean | null;
};

type Post = {
  id: string;
  title: string;
  place: string | null;
  kind: BoardKind;
  image_url: string | null;
  created_at: string;
  like_count: number;
  comment_count: number;
};

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isSupabaseConfigured()) notFound();

  const supabase = await createClient();
  const { data: prof } = await supabase
    .from("profiles")
    .select("id,first_name,last_name,avatar_url,bio,home_city,is_verified")
    .eq("id", id)
    .maybeSingle();
  if (!prof) notFound();
  const profile = prof as Prof;

  const name =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "משתמש";

  const { data: postsData } = await supabase
    .from("board_items")
    .select("id,title,place,kind,image_url,created_at,like_count,comment_count")
    .eq("author_id", id)
    .order("created_at", { ascending: false });
  const posts = (postsData as Post[]) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/board"
          aria-label="חזרה"
          className="text-muted transition-colors hover:text-brand"
        >
          <IconArrowRight size={20} stroke={1.75} />
        </Link>
        <h1 className="text-lg font-medium">פרופיל</h1>
      </div>

      <div className="rounded-2xl border bg-surface p-5">
        <div className="flex items-center gap-4">
          <Avatar name={name} src={profile.avatar_url} size={64} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-medium">{name}</h2>
              {profile.is_verified && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] text-accent">
                  <IconRosetteDiscountCheck size={13} stroke={1.75} />
                  מאומת
                </span>
              )}
            </div>
            {profile.home_city && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <IconMapPin size={13} stroke={1.75} />
                {profile.home_city}
              </p>
            )}
          </div>
        </div>
        {profile.bio && <p className="mt-4 text-sm text-muted">{profile.bio}</p>}
      </div>

      <h2 className="mb-2 mt-5 text-sm text-muted">פוסטים</h2>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border bg-surface px-6 py-12 text-center">
          <IconLayoutGrid size={24} stroke={1.5} className="text-muted" />
          <p className="text-sm text-muted">אין פוסטים עדיין.</p>
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
