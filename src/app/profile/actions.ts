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

  const update: Record<string, string | null> = {
    first_name: String(formData.get("first_name") || "").trim() || null,
    last_name: String(formData.get("last_name") || "").trim() || null,
    bio: String(formData.get("bio") || "").trim() || null,
    home_city: String(formData.get("home_city") || "").trim() || null,
  };

  // Optional profile photo.
  const file = formData.get("avatar");
  if (file instanceof File && file.size > 0) {
    if (file.size > 8 * 1024 * 1024) return { error: "התמונה גדולה מדי (עד 8MB)." };
    const ext =
      (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg";
    const path = `avatars/${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("board-images")
      .upload(path, file, { contentType: file.type || "image/jpeg" });
    if (upErr) return { error: "העלאת התמונה נכשלה." };
    update.avatar_url = supabase.storage
      .from("board-images")
      .getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
  if (error) return { error: "שמירת הפרופיל נכשלה. נסה שוב." };

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { ok: true };
}
