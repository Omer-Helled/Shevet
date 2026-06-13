import { IconMap2 } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default function DiscoverPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
      <h1 className="mb-4 text-lg font-medium">גלה</h1>
      <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface px-6 py-16 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <IconMap2 size={28} stroke={1.75} />
        </span>
        <h2 className="text-base font-medium">מפת קהילות יהודיות — בקרוב</h2>
        <p className="max-w-xs text-sm text-muted">
          כאן תהיה מפה חיה של בתי כנסת, מרכזי חב״ד, מקוואות ומסעדות כשרות מסביבך
          ובכל העולם — עם נתונים אמיתיים.
        </p>
      </div>
    </div>
  );
}
