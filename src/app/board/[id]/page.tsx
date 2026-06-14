import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IconArrowRight, IconMessageCircle } from "@tabler/icons-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { Avatar } from "@/components/avatar";
import { LikeButton } from "@/components/like-button";
import { BookmarkButton } from "@/components/bookmark-button";
import { ShareButton } from "@/components/share-button";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { boardKindLabel, type BoardKind } from "@/lib/mock";
import { relativeTime } from "@/lib/time";
import { CommentForm } from "./comment-form";
import { toggleLike, toggleCommentLike } from "./actions";

export const dynamic = "force-dynamic";

type Author = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
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
      "id,title,body,place,kind,image_url,created_at,like_count,comment_count,author:profiles(id,first_name,last_name,avatar_url)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!postData) notFound();
  const post = postData as unknown as Post;

  const { data: commentData } = await supabase
    .from("comments")
    .select(
      "id,body,image_url,created_at,like_count,author:profiles(id,first_name,last_name,avatar_url)",
    )
    .eq("post_id", id)
    .order("created_at", { ascending: true });
  const comments = (commentData as unknown as Comment[]) ?? [];

  const user = await getUser();
  let likedPost = false;
  let saved = false;
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

    const { data: bm } = await supabase
      .from("bookmarks")
      .select("post_id")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    saved = Boolean(bm);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 md:px-6">
      <RealtimeRefresh table="comments" filter={`post_id=eq.${post.id}`} />
      <RealtimeRefresh table="post_likes" filter={`post_id=eq.${post.id}`} />
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
          <Link
            href={`/u/${post.author?.id ?? ""}`}
            className="flex min-w-0 items-center gap-3"
          >
            <Avatar name={nameOf(post.author)} src={post.author?.avatar_url} />
            <div className="min-w-0">
              <div className="truncate text-sm">{nameOf(post.author)}</div>
              <div className="truncate text-xs text-muted">
                {relativeTime(post.created_at)}
                {post.place ? ` · ${post.place}` : ""}
              </div>
            </div>
          </Link>
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

        <div className="flex flex-wrap items-center gap-4 border-t px-4 py-2.5 text-sm">
          <LikeButton
            action={toggleLike}
            hidden={{ post_id: post.id }}
            liked={likedPost}
            count={post.like_count}
          />
          <span className="flex items-center gap-1.5 text-muted">
            <IconMessageCircle size={19} stroke={1.75} />
            {post.comment_count}
          </span>
          <BookmarkButton postId={post.id} saved={saved} />
          <ShareButton />
        </div>
      </article>

      <div className="mt-4">
        <CommentForm postId={post.id} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border bg-surface p-3">
            <div className="flex items-center gap-2">
              <Link
                href={`/u/${c.author?.id ?? ""}`}
                className="flex items-center gap-2"
              >
                <Avatar name={nameOf(c.author)} src={c.author?.avatar_url} size={28} />
                <span className="text-sm">{nameOf(c.author)}</span>
              </Link>
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
            <div className="mt-2">
              <LikeButton
                action={toggleCommentLike}
                hidden={{ comment_id: c.id, post_id: post.id }}
                liked={likedComments.has(c.id)}
                count={c.like_count}
                size={16}
                textClass="text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
