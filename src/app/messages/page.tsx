import { convos } from "@/lib/mock";

export default function MessagesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 md:px-6">
      <h1 className="mb-3 text-lg font-medium">הודעות</h1>
      <div className="divide-y overflow-hidden rounded-xl border bg-surface">
        {convos.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-3 py-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-soft text-sm text-brand-ink">
              {c.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm">{c.name}</p>
                <span className="shrink-0 text-[11px] text-muted">{c.time}</span>
              </div>
              <p className="truncate text-xs text-muted">{c.last}</p>
            </div>
            {c.unread ? (
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-strong text-[11px] text-white">
                {c.unread}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
