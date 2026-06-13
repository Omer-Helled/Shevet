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
  const { error } = await supabase.from("board_items").insert({
    author_id: user.id,
    title,
    body: String(formData.get("body") || "").trim() || null,
    kind: String(formData.get("kind") || "volunteer"),
    place: String(formData.get("place") || "").trim() || null,
  });

  if (error) return { error: "הפרסום נכשל. נסה שוב." };

  revalidatePath("/board");
  redirect("/board");
}
