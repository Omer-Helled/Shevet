"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

export type ProfileState = { error?: string; ok?: boolean } | undefined;

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getUser();
  if (!user) return { error: "יש להתחבר תחילה." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: String(formData.get("first_name") || "").trim() || null,
      last_name: String(formData.get("last_name") || "").trim() || null,
      bio: String(formData.get("bio") || "").trim() || null,
      home_city: String(formData.get("home_city") || "").trim() || null,
    })
    .eq("id", user.id);

  if (error) return { error: "שמירת הפרופיל נכשלה. נסה שוב." };

  revalidatePath("/profile");
  return { ok: true };
}
