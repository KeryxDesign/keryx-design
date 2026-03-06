import { supabase } from "./supabase";

export interface Referral {
  id: string;
  name: string;
  slug: string;
  clicks: number;
  created_at: string;
}

export function generateSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function findUniqueSlug(baseSlug: string): Promise<string> {
  const { data } = await supabase
    .from("referrals")
    .select("slug")
    .like("slug", `${baseSlug}%`);

  const existingSlugs = new Set((data || []).map((r) => r.slug));

  if (!existingSlugs.has(baseSlug)) return baseSlug;

  let counter = 2;
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
}

export async function createReferral(
  name: string,
  slug: string,
): Promise<Referral | null> {
  const { data, error } = await supabase
    .from("referrals")
    .insert({ name, slug })
    .select()
    .single();

  if (error) {
    console.error("Error creating referral:", error);
    return null;
  }
  return data;
}

export async function getReferralBySlug(
  slug: string,
): Promise<Referral | null> {
  const { data } = await supabase
    .from("referrals")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data;
}

export async function trackClick(slug: string): Promise<void> {
  await supabase.rpc("track_referral_click", { referral_slug: slug });
}

export async function getClickCount(slug: string): Promise<number> {
  const { data } = await supabase
    .from("referrals")
    .select("clicks")
    .eq("slug", slug)
    .maybeSingle();

  return data?.clicks ?? 0;
}
