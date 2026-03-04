import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Article = {
  id: string;
  titolo: string;
  slug: string;
  slug_alternativo: string | null;
  contenuto: string;
  meta_description: string | null;
  immagine_copertina: string | null;
  autore: string | null;
  categoria: string;
  lingua: string;
  data_pubblicazione: string | null;
  tempo_lettura: number | null;
  keywords: string[] | null;
  pubblicato: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export async function getArticles(
  language: "it" | "en",
  categoria?: string,
  excludeCategoria?: string,
): Promise<Article[]> {
  let query = supabase
    .from("articoli")
    .select("*")
    .eq("lingua", language)
    .eq("pubblicato", true)
    .order("data_pubblicazione", { ascending: false });

  if (categoria) {
    query = query.eq("categoria", categoria);
  }

  if (excludeCategoria) {
    query = query.neq("categoria", excludeCategoria);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  return data || [];
}

export async function getArticleBySlug(
  slug: string,
  language: "it" | "en",
): Promise<Article | null> {
  // Try by slug first
  let { data } = await supabase
    .from("articoli")
    .select("*")
    .eq("slug", slug)
    .eq("lingua", language)
    .eq("pubblicato", true)
    .maybeSingle();

  // If not found, try slug_alternativo
  if (!data) {
    const { data: altData } = await supabase
      .from("articoli")
      .select("*")
      .eq("slug_alternativo", slug)
      .eq("lingua", language)
      .eq("pubblicato", true)
      .maybeSingle();

    if (altData) data = altData;
  }

  return data;
}

export async function getAllArticleSlugs(
  language: "it" | "en",
  categoria?: string,
  excludeCategoria?: string,
): Promise<string[]> {
  let query = supabase
    .from("articoli")
    .select("slug")
    .eq("lingua", language)
    .eq("pubblicato", true);

  if (categoria) {
    query = query.eq("categoria", categoria);
  }

  if (excludeCategoria) {
    query = query.neq("categoria", categoria);
  }

  const { data } = await query;

  return (data || []).map((a) => a.slug);
}
