import Link from "next/link";
import { redirect } from "next/navigation";
import { IconBell } from "@tabler/icons-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { Avatar } from "@/components/avatar";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { relativeTime } from "@/lib/time";
import { MarkRead } from "./mark-read";

export const dynamic = "force-dynamic";

type Actor = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
} | null;

type Notif = {
  id: string;
  type: "like" | "comment";
  read: boolean;
  created_at: string;
  post_id: string | null;
  actor: Actor;
  post: { title: string } | null;
};

function nameOf(a: Actor) {
  return [a?.first_name, a?.last_name].filter(Boolean).join(" ") || "מישהו";
}

export default async function NotificationsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  let items: Notif[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("notifications")
      .select(
        "id,type,read,created_at,post_id,actor:profiles!notifications_actor_id_fkey(first_name,last_name,avatar_url),post:board_items!notifications_post_id_fkey(title)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    items = (data as unknown as Notif[]) ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 md:px-6">
      <RealtimeRefresh table="notifications" />
      <MarkRead />
      <h1 className="mb-3 text-lg font-medium">התראות</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
            <IconBell size={24} stroke={1.75} />
          </span>
          <p className="text-sm text-muted">אין התראות עדיין.</p>
        </div>
      ) : (
        <div className="divide-y overflow-hidden rounded-xl border bg-surface">
          {items.map((n) => (
            <Link
              key={n.id}
              href={n.post_id ? `/board/${n.post_id}` : "/board"}
              className={`flex items-center gap-3 px-3 py-3 ${n.read ? "" : "bg-brand-soft/40"}`}
            >
              <Avatar name={nameOf(n.actor)} src={n.actor?.avatar_url} size={36} />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{nameOf(n.actor)}</span>{" "}
                  {n.type === "like" ? "אהב את הפוסט שלך" : "הגיב על הפוסט שלך"}
                </p>
                {n.post?.title && (
                  <p className="truncate text-xs text-muted">{n.post.title}</p>
                )}
              </div>
              <span className="shrink-0 text-[11px] text-muted">
                {relativeTime(n.created_at)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
