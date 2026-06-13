"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

export type ListingState = { error?: string } | undefined;

export async function createListing(
  _prev: ListingState,
  formData: FormData,
): Promise<ListingState> {
  const user = await getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "נא להזין כותרת למודעה." };

  const supabase = await createClient();
  const { error } = await supabase.from("properties").insert({
    owner_id: user.id,
    title,
    description: String(formData.get("description") || "").trim() || null,
    listing_type: String(formData.get("listing_type") || "exchange"),
    city: String(formData.get("city") || "").trim() || null,
    country: String(formData.get("country") || "").trim() || null,
    is_kosher: formData.get("is_kosher") === "on",
    is_shabbat_observant: formData.get("is_shabbat_observant") === "on",
    has_sukkah: formData.get("has_sukkah") === "on",
    near_shul: formData.get("near_shul") === "on",
  });

  if (error) return { error: "פרסום המודעה נכשל. נסה שוב." };

  revalidatePath("/stay");
  redirect("/stay");
}
