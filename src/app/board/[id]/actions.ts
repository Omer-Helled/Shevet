"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

export type CommentState = { error?: string } | undefined;

export async function toggleLike(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");
  const postId = String(formData.get("post_id") || "");
  if (!postId) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath(`/board/${postId}`);
  revalidatePath("/board");
}

export async function toggleCommentLike(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");
  const commentId = String(formData.get("comment_id") || "");
  const postId = String(formData.get("post_id") || "");
  if (!commentId) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("comment_likes")
    .select("comment_id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("comment_likes")
      .insert({ comment_id: commentId, user_id: user.id });
  }

  if (postId) revalidatePath(`/board/${postId}`);
}

export async function addComment(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const user = await getUser();
  if (!user) redirect("/login");

  const postId = String(formData.get("post_id") || "");
  const body = String(formData.get("body") || "").trim();
  const file = formData.get("image");
  const hasImage = file instanceof File && file.size > 0;

  if (!postId) return { error: "פוסט לא נמצא." };
  if (!body && !hasImage) return { error: "נא לכתוב תגובה או לצרף תמונה." };

  const supabase = await createClient();

  let image_url: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > 8 * 1024 * 1024) return { error: "התמונה גדולה מדי (עד 8MB)." };
    const ext =
      (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg";
    const path = `comments/${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("board-images")
      .upload(path, file, { contentType: file.type || "image/jpeg" });
    if (upErr) return { error: "העלאת התמונה נכשלה." };
    image_url = supabase.storage.from("board-images").getPublicUrl(path).data
      .publicUrl;
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    body: body || null,
    image_url,
  });
  if (error) return { error: "פרסום התגובה נכשל. נסה שוב." };

  redirect(`/board/${postId}`);
}
