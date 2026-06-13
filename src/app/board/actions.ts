"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

export type BoardState = { error?: string } | undefined;

export async function createBoardItem(
  _prev: BoardState,
  formData: FormData,
): Promise<BoardState> {
  const user = await getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "נא להזין כותרת." };

  const supabase = await createClient();

  // Optional image upload to the public board-images bucket.
  let image_url: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (file.size > 8 * 1024 * 1024) return { error: "התמונה גדולה מדי (עד 8MB)." };
    const ext =
      (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("board-images")
      .upload(path, file, { contentType: file.type || "image/jpeg" });
    if (upErr) return { error: "העלאת התמונה נכשלה. נסה שוב." };
    image_url = supabase.storage.from("board-images").getPublicUrl(path).data
      .publicUrl;
  }

  const { error } = await supabase.from("board_items").insert({
    author_id: user.id,
    title,
    body: String(formData.get("body") || "").trim() || null,
    kind: String(formData.get("kind") || "volunteer"),
    place: String(formData.get("place") || "").trim() || null,
    image_url,
  });

  if (error) return { error: "הפרסום נכשל. נסה שוב." };

  revalidatePath("/board");
  redirect("/board");
}
