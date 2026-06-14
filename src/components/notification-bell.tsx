"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconBell } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      if (active) setCount(count ?? 0);
    }

    load();
    const channel = supabase
      .channel("rt:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        load,
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Link
      href="/notifications"
      aria-label="התראות"
      className="relative grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-soft hover:text-brand"
    >
      <IconBell size={20} stroke={1.75} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-[16px] place-items-center rounded-full bg-red-500 px-1 text-[10px] text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
