import Link from "next/link";
import { IconBed, IconLayoutGrid, IconSearch } from "@tabler/icons-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { stayTypeLabel, boardKindLabel, type StayType, type BoardKind } from "@/lib/mock";

export const dynamic = "force-dynamic";

type StayHit = { id: string; title: string; city: string | null; country: string | null; listing_type: StayType };
type BoardHit = { id: string; title: string; place: string | null; kind: BoardKind };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const term = q.replace(/[%,()]/g, " ").trim();

  let stays: StayHit[] = [];
  let board: BoardHit[] = [];

  if (term && isSupabaseConfigured()) {
    const supabase = await createClient();
    const [a, b] = await Promise.all([
      supabase
        .from("properties")
        .select("id,title,city,country,listing_type")
        .eq("is_active", true)
        .ilike("title", `%${term}%`)
        .limit(12),
      supabase
        .from("board_items")
        .select("id,title,place,kind")
        .ilike("title", `%${term}%`)
        .limit(12),
    ]);
    stays = (a.data as StayHit[]) ?? [];
    board = (b.data as BoardHit[]) ?? [];
  }

  const total = stays.length + board.length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
      <h1 className="mb-1 text-lg font-medium">חיפוש</h1>
      {term ? (
        <p className="mb-4 text-sm text-muted">
          {total} תוצאות עבור &ldquo;{term}&rdquo;
        </p>
      ) : (
        <p className="mb-4 text-sm text-muted">הקלד בשורת החיפוש למעלה כדי לחפש.</p>
      )}

      {term && total === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
            <IconSearch size={24} stroke={1.75} />
          </span>
          <p className="text-sm text-muted">לא נמצאו תוצאות.</p>
        </div>
      )}

      {stays.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-2 flex items-center gap-2 text-sm text-muted">
            <IconBed size={16} stroke={1.75} /> לינה
          </h2>
          <div className="divide-y overflow-hidden rounded-xl border bg-surface">
            {stays.map((s) => (
              <Link
                key={s.id}
                href="/stay"
                className="flex items-center justify-between gap-2 px-3 py-3 hover:bg-brand-soft/40"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">{s.title}</span>
                  <span className="block truncate text-xs text-muted">
                    {[s.city, s.country].filter(Boolean).join(", ")}
                  </span>
                </span>
                <span className="shrink-0 rounded-md bg-brand-soft px-2 py-0.5 text-[11px] text-brand-ink">
                  {stayTypeLabel[s.listing_type]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {board.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm text-muted">
            <IconLayoutGrid size={16} stroke={1.75} /> לוח
          </h2>
          <div className="divide-y overflow-hidden rounded-xl border bg-surface">
            {board.map((b) => (
              <Link
                key={b.id}
                href="/board"
                className="flex items-center justify-between gap-2 px-3 py-3 hover:bg-brand-soft/40"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">{b.title}</span>
                  <span className="block truncate text-xs text-muted">{b.place ?? ""}</span>
                </span>
                <span className="shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                  {boardKindLabel[b.kind]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
