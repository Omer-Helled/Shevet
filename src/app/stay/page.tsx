import Link from "next/link";
import { IconPlus, IconPhoto, IconBed } from "@tabler/icons-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { stayTypeLabel, type StayType } from "@/lib/mock";

export const dynamic = "force-dynamic";

const typeTint: Record<StayType, string> = {
  exchange: "bg-brand-soft text-brand",
  host: "bg-accent-soft text-accent",
  petsit: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  volunteer: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
};

const typeChips = ["הכל", "חילופי בתים", "אירוח", "תמורת עזרה", "שמירת חיה"];

type Listing = {
  id: string;
  title: string;
  city: string | null;
  country: string | null;
  listing_type: StayType;
  is_kosher: boolean;
  is_shabbat_observant: boolean;
  has_sukkah: boolean;
  near_shul: boolean;
};

function badgesOf(l: Listing): string[] {
  const b: string[] = [];
  if (l.is_kosher) b.push("כשר");
  if (l.is_shabbat_observant) b.push("שומר שבת");
  if (l.has_sukkah) b.push("סוכה");
  if (l.near_shul) b.push("ליד בית כנסת");
  return b;
}

export default async function StayPage() {
  let listings: Listing[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select(
        "id,title,city,country,listing_type,is_kosher,is_shabbat_observant,has_sukkah,near_shul",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    listings = (data as Listing[]) ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 md:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-medium">לינה</h1>
        <Link
          href="/stay/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-strong px-3 py-1.5 text-sm text-white"
        >
          <IconPlus size={16} stroke={2} />
          הוסף מודעה
        </Link>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
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

      {listings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
            <IconBed size={24} stroke={1.75} />
          </span>
          <p className="text-sm text-muted">
            עדיין אין מודעות לינה. היה הראשון לפרסם!
          </p>
          <Link
            href="/stay/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-strong px-4 py-2 text-sm text-white"
          >
            <IconPlus size={16} stroke={2} />
            פרסום מודעה
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <article
              key={l.id}
              className="overflow-hidden rounded-xl border bg-surface"
            >
              <div
                className={`relative grid h-28 place-items-center ${typeTint[l.listing_type]}`}
              >
                <IconPhoto size={26} stroke={1.5} className="opacity-70" />
                <span className="absolute right-2 top-2 rounded-md bg-surface px-2 py-0.5 text-[11px] text-brand">
                  {stayTypeLabel[l.listing_type]}
                </span>
              </div>
              <div className="p-3">
                <h2 className="truncate text-sm">{l.title}</h2>
                {(l.city || l.country) && (
                  <p className="mb-2 mt-0.5 text-xs text-muted">
                    {[l.city, l.country].filter(Boolean).join(", ")}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {badgesOf(l).map((b) => (
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
      )}
    </div>
  );
}
