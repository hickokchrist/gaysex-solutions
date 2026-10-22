// Builds the homepage carousel data from your own blog + gallery posts.
// Runs at build time (homepage is prerendered). No filesystem scan needed:
// only images that a post actually references are included.

const SOURCES = [
  { collection: 'blog', base: '/blog' },
  { collection: 'gallery', base: '/gallery' },
];

// Include each post's frontmatter `thumbnail` (caption = post title)?
const INCLUDE_THUMBNAILS = true;

const MD_IMG = /!\[([^\]]*)\]\((\/images\/[^)\s]+)(?:\s+"[^"]*")?\)/g;
const HTML_IMG = /<img\b[^>]*?\bsrc=["'](\/images\/[^"']+)["'][^>]*>/gi;
const ALT_ATTR = /\balt=["']([^"']*)["']/i;
const ITALIC_LINE = /^\s*(?:\*|_)(?![\s*_])(.+?)(?:\*|_)\s*$/;

const clean = (s) =>
  s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // md links -> text
    .replace(/<[^>]+>/g, '')                 // stray html tags
    .replace(/\s+/g, ' ')
    .trim();

/** Pull { src, caption } pairs out of a markdown body. Caption = the *italic* line under the image. */
export function extractImages(body = '') {
  const lines = body.split(/\r?\n/);
  const found = [];

  for (let i = 0; i < lines.length; i++) {
    const mdMatches = [...lines[i].matchAll(MD_IMG)];

    if (mdMatches.length === 1) {
      const [, alt, src] = mdMatches[0];
      let caption = '';
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      const m = j < lines.length && lines[j].match(ITALIC_LINE);
      if (m) caption = clean(m[1]);
      found.push({ src, caption: caption || clean(alt) });
    } else {
      for (const [, alt, src] of mdMatches) found.push({ src, caption: clean(alt) });
    }

    for (const m of lines[i].matchAll(HTML_IMG)) {
      const alt = m[0].match(ALT_ATTR)?.[1] ?? '';
      found.push({ src: m[1], caption: clean(alt) });
    }
  }
  return found;
}

/** All captioned images, newest post wins when an image repeats. */
export async function getCaptionedImages() {
  const { getCollection } = await import('astro:content');

  const entries = [];
  for (const { collection, base } of SOURCES) {
    for (const entry of await getCollection(collection)) entries.push({ entry, base });
  }
  entries.sort((a, b) => b.entry.data.date.valueOf() - a.entry.data.date.valueOf());

  const seen = new Map();
  for (const { entry, base } of entries) {
    const href = `${base}/${entry.slug}`;
    const post = entry.data.title;
    const add = (src, caption) => {
      if (!src.startsWith('/images/') || seen.has(src)) return;
      seen.set(src, { src, caption: caption || post, href, post });
    };

    for (const { src, caption } of extractImages(entry.body)) add(src, caption);
    if (INCLUDE_THUMBNAILS && entry.data.thumbnail) add(entry.data.thumbnail, '');
  }
  return [...seen.values()];
}
