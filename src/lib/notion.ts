/**
 * COREWEAVER LABS — Notion CMS Client
 * Pulls Blog Posts + Blog Images from Notion at build time.
 * Fails gracefully — site builds even if Notion is unreachable.
 */

import { Client } from '@notionhq/client';

const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;
const BLOG_DB      = import.meta.env.NOTION_BLOG_POSTS_DB_ID;
const IMAGES_DB    = import.meta.env.NOTION_BLOG_IMAGES_DB_ID;

// Initialise client only if token exists
const notion = NOTION_TOKEN ? new Client({ auth: NOTION_TOKEN }) : null;

export interface BlogPost {
  id:              string;
  title:           string;
  slug:            string;
  status:          string;
  publishDate:     string | null;
  authorAgent:     string | null;
  category:        string[];
  keywords:        string;
  metaDescription: string;
  heroImageUrl:    string | null;
  ogImageUrl:      string | null;
  wordCount:       number | null;
  readingTime:     string | null;
  geoScore:        number | null;
  campaign:        string | null;
  notionUrl:       string;
}

export interface BlogImage {
  id:          string;
  imageName:   string;
  status:      string;
  imageRole:   string;
  blogSlug:    string;
  publicUrl:   string;
  storagePath: string;
  altText:     string;
  caption:     string;
  source:      string;
  agent:       string;
  format:      string;
  keywords:    string[];
}

function getText(prop: any): string {
  return prop?.rich_text?.[0]?.plain_text ?? prop?.title?.[0]?.plain_text ?? '';
}
function getSelect(prop: any): string | null { return prop?.select?.name ?? null; }
function getMultiSelect(prop: any): string[] {
  return prop?.multi_select?.map((o: any) => o.name) ?? [];
}
function getUrl(prop: any): string | null    { return prop?.url ?? null; }
function getNumber(prop: any): number | null { return prop?.number ?? null; }
function getDate(prop: any): string | null   { return prop?.date?.start ?? null; }

export async function getAllPosts(): Promise<BlogPost[]> {
  // Return empty array if Notion not configured — site still builds
  if (!notion || !BLOG_DB) {
    console.warn('[Notion] NOTION_TOKEN or NOTION_BLOG_POSTS_DB_ID not set — returning empty posts');
    return [];
  }

  try {
    const res = await notion.databases.query({
      database_id: BLOG_DB,
      filter: { property: 'Status', select: { equals: 'published' } },
      sorts: [{ property: 'Publish Date', direction: 'descending' }],
    });

    return res.results.map((page: any) => {
      const p = page.properties;
      return {
        id:              page.id,
        title:           getText(p['Post Title']),
        slug:            getText(p['Slug']),
        status:          getSelect(p['Status']) ?? 'draft',
        publishDate:     getDate(p['Publish Date']),
        authorAgent:     getSelect(p['Author Agent']),
        category:        getMultiSelect(p['Category']),
        keywords:        getText(p['Keywords']),
        metaDescription: getText(p['Meta Description']),
        heroImageUrl:    getUrl(p['Hero Image URL']),
        ogImageUrl:      getUrl(p['OG Image URL']),
        wordCount:       getNumber(p['Word Count']),
        readingTime:     getText(p['Reading Time']) || null,
        geoScore:        getNumber(p['GEO Score']),
        campaign:        getText(p['Campaign']) || null,
        notionUrl:       page.url,
      };
    });
  } catch (err) {
    console.error('[Notion] Failed to fetch posts:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug) ?? null;
}

export async function getPostContent(pageId: string): Promise<string> {
  if (!notion) return '<p>Content unavailable — Notion not connected.</p>';

  try {
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    return blocksToHtml(blocks.results as any[]);
  } catch (err) {
    console.error('[Notion] Failed to fetch content:', err);
    return '<p>Content unavailable.</p>';
  }
}

function blocksToHtml(blocks: any[]): string {
  return blocks.map(block => {
    const type    = block.type;
    const content = block[type];
    const richText = (content?.rich_text ?? []);
    const text = richText.map((t: any) => {
      let s = t.plain_text;
      if (t.annotations?.bold)   s = `<strong>${s}</strong>`;
      if (t.annotations?.italic) s = `<em>${s}</em>`;
      if (t.annotations?.code)   s = `<code>${s}</code>`;
      if (t.href)                 s = `<a href="${t.href}">${s}</a>`;
      return s;
    }).join('');

    switch (type) {
      case 'heading_1':          return `<h2 class="post-h1">${text}</h2>`;
      case 'heading_2':          return `<h3 class="post-h2">${text}</h3>`;
      case 'heading_3':          return `<h4 class="post-h3">${text}</h4>`;
      case 'paragraph':          return text ? `<p>${text}</p>` : '<br/>';
      case 'bulleted_list_item': return `<li>${text}</li>`;
      case 'numbered_list_item': return `<li>${text}</li>`;
      case 'code':               return `<pre><code class="language-${content.language}">${text}</code></pre>`;
      case 'quote':              return `<blockquote>${text}</blockquote>`;
      case 'divider':            return `<hr/>`;
      case 'image': {
        const url = content?.file?.url ?? content?.external?.url ?? '';
        const cap = (content?.caption ?? []).map((t: any) => t.plain_text).join('');
        return `<figure><img src="${url}" alt="${cap}" loading="lazy"/>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
      }
      case 'callout': return `<aside class="callout">${text}</aside>`;
      default:        return text ? `<p>${text}</p>` : '';
    }
  }).join('\n');
}

export async function getApprovedImages(slug?: string): Promise<BlogImage[]> {
  if (!notion || !IMAGES_DB) return [];

  try {
    const filter: any = { and: [{ property: 'Status', select: { equals: 'approved' } }] };
    if (slug) filter.and.push({ property: 'Blog Slug', rich_text: { equals: slug } });

    const res = await notion.databases.query({ database_id: IMAGES_DB, filter });
    return res.results.map((page: any) => {
      const p = page.properties;
      return {
        id:          page.id,
        imageName:   getText(p['Image Name']),
        status:      getSelect(p['Status']) ?? 'draft',
        imageRole:   getSelect(p['Image Role']) ?? 'body',
        blogSlug:    getText(p['Blog Slug']),
        publicUrl:   getUrl(p['Public URL']) ?? '',
        storagePath: getText(p['Storage Path']),
        altText:     getText(p['Alt Text']),
        caption:     getText(p['Caption']),
        source:      getSelect(p['Source']) ?? 'firefly',
        agent:       getSelect(p['Agent']) ?? 'human',
        format:      getSelect(p['Format']) ?? 'webp',
        keywords:    getMultiSelect(p['Keywords']),
      };
    });
  } catch (err) {
    console.error('[Notion] Failed to fetch images:', err);
    return [];
  }
}
