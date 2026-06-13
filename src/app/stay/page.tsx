import { IconStar, IconPhoto } from "@tabler/icons-react";
import { stays, stayTypeLabel, type StayType } from "@/lib/mock";

const typeTint: Record<StayType, string> = {
  exchange: "bg-brand-soft text-brand",
  host: "bg-accent-soft text-accent",
  petsit: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  volunteer: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
};

const typeChips = ["הכל", "חילופי בתים", "אירוח", "תמורת עזרה", "שמירת חיה"];
const filterChips = ["כשר", "שומר שבת", "סוכה", "ליד בית כנסת"];

export default function StayPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 md:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-medium">לינה · קרוב אליך</h1>
        <span className="text-xs text-muted">{stays.length} תוצאות</span>
      </div>

      <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
        {typeChips.map((c, i) => (
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
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filterChips.map((c) => (
          <span
            key={c}
            className="shrink-0 rounded-full border bg-surface px-3 py-1.5 text-xs text-muted"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stays.map((s) => (
          <article
            key={s.id}
            className="overflow-hidden rounded-xl border bg-surface"
          >
            <div
              className={`relative grid h-28 place-items-center ${typeTint[s.type]}`}
            >
              <IconPhoto size={26} stroke={1.5} className="opacity-70" />
              <span className="absolute right-2 top-2 rounded-md bg-surface px-2 py-0.5 text-[11px] text-brand">
                {stayTypeLabel[s.type]}
              </span>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="truncate text-sm">{s.title}</h2>
                <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted">
                  <IconStar size={13} className="text-accent" />
                  {s.rating.toFixed(1)}
                </span>
              </div>
              <p className="mb-2 mt-0.5 text-xs text-muted">
                {s.city}, {s.country}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {s.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] text-brand-ink"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
