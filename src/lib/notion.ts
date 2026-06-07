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

function richTextToHtml(richText: any[]): string {
  return richText.map((t: any) => {
    let s = t.plain_text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    if (t.annotations?.bold)          s = `<strong>${s}</strong>`;
    if (t.annotations?.italic)        s = `<em>${s}</em>`;
    if (t.annotations?.strikethrough) s = `<del>${s}</del>`;
    if (t.annotations?.underline)     s = `<u>${s}</u>`;
    if (t.annotations?.code)          s = `<code>${s}</code>`;
    if (t.href)                        s = `<a href="${t.href}" rel="noopener">${s}</a>`;
    return s;
  }).join('');
}

function blocksToHtml(blocks: any[]): string {
  const html: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const type  = block.type;
    const data  = block[type];
    const text  = richTextToHtml(data?.rich_text ?? []);

    if (type === 'bulleted_list_item') {
      // Collect consecutive bulleted items into one <ul>
      const items: string[] = [];
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        const t = richTextToHtml(blocks[i][blocks[i].type]?.rich_text ?? []);
        items.push(`  <li>${t}</li>`);
        i++;
      }
      html.push(`<ul>\n${items.join('\n')}\n</ul>`);
      continue;
    }

    if (type === 'numbered_list_item') {
      // Collect consecutive numbered items into one <ol>
      const items: string[] = [];
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        const t = richTextToHtml(blocks[i][blocks[i].type]?.rich_text ?? []);
        items.push(`  <li>${t}</li>`);
        i++;
      }
      html.push(`<ol>\n${items.join('\n')}\n</ol>`);
      continue;
    }

    switch (type) {
      case 'heading_1': html.push(`<h2 class="post-h1">${text}</h2>`); break;
      case 'heading_2': html.push(`<h3 class="post-h2">${text}</h3>`); break;
      case 'heading_3': html.push(`<h4 class="post-h3">${text}</h4>`); break;
      case 'paragraph': html.push(text ? `<p>${text}</p>` : '<br/>'); break;
      case 'code': {
        const lang = data?.language ?? 'plaintext';
        html.push(`<pre><code class="language-${lang}">${text}</code></pre>`);
        break;
      }
      case 'quote':   html.push(`<blockquote>${text}</blockquote>`); break;
      case 'divider': html.push(`<hr/>`); break;
      case 'image': {
        const url = data?.file?.url ?? data?.external?.url ?? '';
        const cap = (data?.caption ?? []).map((t: any) => t.plain_text).join('');
        html.push(`<figure><img src="${url}" alt="${cap || 'Image'}" loading="lazy"/>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`);
        break;
      }
      case 'callout': html.push(`<aside class="callout">${text}</aside>`); break;
      default:        if (text) html.push(`<p>${text}</p>`); break;
    }
    i++;
  }

  return html.join('\n');
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
