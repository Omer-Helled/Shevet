import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  IconArrowRight,
  IconHeart,
  IconMessageCircle,
} from "@tabler/icons-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { boardKindLabel, type BoardKind } from "@/lib/mock";
import { relativeTime } from "@/lib/time";
import { CommentForm } from "./comment-form";
import { toggleLike, toggleCommentLike } from "./actions";

export const dynamic = "force-dynamic";

type Author = {
  first_name: string | null;
  last_name: string | null;
} | null;

type Post = {
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

type Comment = {
  id: string;
  body: string | null;
  image_url: string | null;
  created_at: string;
  like_count: number;
  author: Author;
};

function nameOf(a: Author) {
  return [a?.first_name, a?.last_name].filter(Boolean).join(" ") || "משתמש";
}

function Avatar({ author, size = 36 }: { author: Author; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-accent text-[#3a1c0e]"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {nameOf(author).trim().slice(0, 2)}
    </span>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isSupabaseConfigured()) notFound();

  const supabase = await createClient();
  const { data: postData } = await supabase
    .from("board_items")
    .select(
      "id,title,body,place,kind,image_url,created_at,like_count,comment_count,author:profiles(first_name,last_name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!postData) notFound();
  const post = postData as unknown as Post;

  const { data: commentData } = await supabase
    .from("comments")
    .select("id,body,image_url,created_at,like_count,author:profiles(first_name,last_name)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });
  const comments = (commentData as unknown as Comment[]) ?? [];

  const user = await getUser();
  let likedPost = false;
  let likedComments = new Set<string>();
  if (user) {
    const { data: pl } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    likedPost = Boolean(pl);

    const ids = comments.map((c) => c.id);
    if (ids.length) {
      const { data: cl } = await supabase
        .from("comment_likes")
        .select("comment_id")
        .in("comment_id", ids)
        .eq("user_id", user.id);
      likedComments = new Set((cl ?? []).map((r) => r.comment_id as string));
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 md:px-6">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/board"
          aria-label="חזרה ללוח"
          className="text-muted transition-colors hover:text-brand"
        >
          <IconArrowRight size={20} stroke={1.75} />
        </Link>
        <h1 className="text-lg font-medium">פוסט</h1>
      </div>

      <article className="overflow-hidden rounded-2xl border bg-surface">
        <div className="flex items-center gap-3 p-4">
          <Avatar author={post.author} />
          <div className="min-w-0">
            <div className="truncate text-sm">{nameOf(post.author)}</div>
            <div className="truncate text-xs text-muted">
              {relativeTime(post.created_at)}
              {post.place ? ` · ${post.place}` : ""}
            </div>
          </div>
          <span className="ms-auto shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
            {boardKindLabel[post.kind]}
          </span>
        </div>

        <div className="px-4 pb-3">
          <h2 className="text-base font-medium">{post.title}</h2>
          {post.body && (
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted">
              {post.body}
            </p>
          )}
        </div>

        {post.image_url && (
          <div className="relative aspect-video bg-surface-2">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-5 border-t px-4 py-2.5 text-sm">
          <form action={toggleLike}>
            <input type="hidden" name="post_id" value={post.id} />
            <button
              type="submit"
              className={`flex items-center gap-1.5 transition-colors ${likedPost ? "text-red-500" : "text-muted hover:text-foreground"}`}
            >
              <IconHeart size={19} stroke={1.75} />
              {post.like_count}
            </button>
          </form>
          <span className="flex items-center gap-1.5 text-muted">
            <IconMessageCircle size={19} stroke={1.75} />
            {post.comment_count}
          </span>
        </div>
      </article>

      <div className="mt-4">
        <CommentForm postId={post.id} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {comments.map((c) => {
          const liked = likedComments.has(c.id);
          return (
            <div key={c.id} className="rounded-xl border bg-surface p-3">
              <div className="flex items-center gap-2">
                <Avatar author={c.author} size={28} />
                <span className="text-sm">{nameOf(c.author)}</span>
                <span className="text-xs text-muted">
                  {relativeTime(c.created_at)}
                </span>
              </div>
              {c.body && (
                <p className="mt-1.5 whitespace-pre-wrap text-sm">{c.body}</p>
              )}
              {c.image_url && (
                <div className="relative mt-2 aspect-video overflow-hidden rounded-lg bg-surface-2">
                  <Image
                    src={c.image_url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
              )}
              <form action={toggleCommentLike} className="mt-2">
                <input type="hidden" name="comment_id" value={c.id} />
                <input type="hidden" name="post_id" value={post.id} />
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? "text-red-500" : "text-muted hover:text-foreground"}`}
                >
                  <IconHeart size={16} stroke={1.75} />
                  {c.like_count}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
