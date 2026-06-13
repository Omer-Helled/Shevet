import {
  IconBuildingChurch,
  IconToolsKitchen2,
  IconDroplet,
  IconCalendarEvent,
  IconChevronLeft,
} from "@tabler/icons-react";
import { hubs, type HubKind } from "@/lib/mock";
import type { ComponentType } from "react";

type IconType = ComponentType<{ size?: number; stroke?: number; className?: string }>;

const hubIcon: Record<HubKind, IconType> = {
  synagogue: IconBuildingChurch,
  kosher: IconToolsKitchen2,
  mikveh: IconDroplet,
  event: IconCalendarEvent,
};

const hubTint: Record<HubKind, string> = {
  synagogue: "bg-brand-soft text-brand",
  kosher: "bg-accent-soft text-accent",
  mikveh: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  event: "bg-pink-500/15 text-pink-600 dark:text-pink-400",
};

const categories = ["בתי כנסת", "חב\"ד", "כשר", "מקווה", "אירועים"];

export default function DiscoverPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
      <h1 className="sr-only">גלה</h1>

      <div className="mb-4 flex gap-1.5 rounded-xl border bg-surface p-1">
        <span className="flex-1 rounded-lg bg-brand-soft py-2 text-center text-sm text-brand-ink">
          מפה
        </span>
        <span className="flex-1 rounded-lg py-2 text-center text-sm text-muted">
          פיד
        </span>
      </div>

      <div className="relative mb-4 h-44 overflow-hidden rounded-xl border bg-surface-2">
        <span className="absolute right-8 top-5 text-brand">
          <IconBuildingChurch size={24} stroke={1.75} />
        </span>
        <span className="absolute left-12 top-16 text-accent">
          <IconToolsKitchen2 size={22} stroke={1.75} />
        </span>
        <span className="absolute bottom-10 right-24 text-emerald-500">
          <IconDroplet size={22} stroke={1.75} />
        </span>
        <span className="absolute bottom-4 left-8 text-pink-500">
          <IconCalendarEvent size={22} stroke={1.75} />
        </span>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c, i) => (
          <span
            key={c}
            className={
              i === 0
                ? "shrink-0 rounded-full bg-brand-strong px-3 py-1.5 text-xs text-white"
                : "shrink-0 rounded-full border bg-surface px-3 py-1.5 text-xs text-muted"
            }
          >
            {c}
          </span>
        ))}
      </div>

      <h2 className="mb-2 text-sm text-muted">בקרבתך</h2>
      <div className="divide-y overflow-hidden rounded-xl border bg-surface">
        {hubs.map((h) => {
          const Icon = hubIcon[h.kind];
          return (
            <div key={h.id} className="flex items-center gap-3 px-3 py-3">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-lg ${hubTint[h.kind]}`}
              >
                <Icon size={20} stroke={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{h.name}</p>
                <p className="text-xs text-muted">
                  {h.meta} · {h.distance}
                </p>
              </div>
              <IconChevronLeft size={18} className="text-muted" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
