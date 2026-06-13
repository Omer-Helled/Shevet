import { cache } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  home_city: string | null;
  kosher_level: string | null;
  is_shabbat_observant: boolean | null;
  is_verified: boolean | null;
};

// Memoized per request so multiple components can call it without extra round-trips.
export const getUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data as Profile | null;
});
