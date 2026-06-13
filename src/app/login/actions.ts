"use server";

import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string } | undefined;

function translate(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "אימייל או סיסמה שגויים.";
  if (/already registered|already been registered|user already exists/i.test(msg))
    return "המשתמש כבר רשום. נסה להתחבר.";
  if (/password should be at least/i.test(msg))
    return "הסיסמה חייבת להכיל לפחות 6 תווים.";
  if (/unable to validate email|invalid email/i.test(msg))
    return "כתובת האימייל אינה תקינה.";
  return msg;
}

export async function authenticate(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "החיבור למסד הנתונים עדיין לא הוגדר." };
  }

  const mode = String(formData.get("mode") || "in");
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "נא למלא אימייל וסיסמה." };

  const supabase = await createClient();

  if (mode === "up") {
    const first_name = String(formData.get("first_name") || "").trim();
    const last_name = String(formData.get("last_name") || "").trim();
    if (!first_name) return { error: "נא למלא שם פרטי." };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name, last_name } },
    });
    if (error) return { error: translate(error.message) };
    if (!data.session) {
      return { notice: "שלחנו לך מייל אימות — אשר אותו ואז התחבר." };
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translate(error.message) };
  }

  redirect("/profile");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
