/**
 * COREWEAVER LABS — Supabase Client
 * Used for reading blog_images metadata + constructing CDN URLs.
 * Agents upload images to the blog-images bucket via Supabase SDK.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const IMAGE_BUCKET      = import.meta.env.SUPABASE_IMAGE_BUCKET ?? 'blog-images';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── CDN URL builder ──────────────────────────────────────────────────────────

export function getImageCdnUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${storagePath}`;
}

// ─── Image metadata queries ───────────────────────────────────────────────────

export interface ImageMeta {
  id:              string;
  storage_path:    string;
  public_url:      string;
  filename:        string;
  alt_text:        string | null;
  caption:         string | null;
  width:           number | null;
  height:          number | null;
  mime_type:       string | null;
  format:          string | null;
  notion_page_id:  string | null;
  blog_slug:       string | null;
  image_role:      string;
  source:          string;
  agent:           string | null;
  status:          string;
  keywords:        string[];
  campaign:        string | null;
}

export async function getImagesBySlug(slug: string): Promise<ImageMeta[]> {
  const { data, error } = await supabase
    .from('blog_images')
    .select('*')
    .eq('blog_slug', slug)
    .eq('status', 'approved');

  if (error) throw error;
  return data ?? [];
}

export async function getHeroImage(slug: string): Promise<ImageMeta | null> {
  const { data, error } = await supabase
    .from('blog_images')
    .select('*')
    .eq('blog_slug', slug)
    .eq('image_role', 'hero')
    .eq('status', 'approved')
    .maybeSingle();

  if (error) throw error;
  return data;
}
