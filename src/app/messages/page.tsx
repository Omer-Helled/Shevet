import { IconMessage2 } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 md:px-6">
      <h1 className="mb-3 text-lg font-medium">הודעות</h1>
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface px-6 py-14 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
          <IconMessage2 size={24} stroke={1.75} />
        </span>
        <p className="max-w-xs text-sm text-muted">
          עדיין אין הודעות. כשתיצור קשר עם מארח או מתנדב, השיחות יופיעו כאן.
        </p>
      </div>
    </div>
  );
}
