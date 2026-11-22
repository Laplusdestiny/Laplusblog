import { Feed } from 'feed';
import { getAllPosts, postPath } from '../../lib/posts';

// ビルド時に静的生成する (記事追加時は再デプロイで更新される)
export const dynamic = 'force-static';

const SITE_URL = 'https://blog.laplusdestiny.com';
const SITE_TITLE = 'Laplusblog';
const SITE_DESCRIPTION = 'Blog page of Laplusdestiny';

/**
 * frontmatter の date (例: '2025-04-21') を公開日時に変換する。
 * Markdown には時刻を書かないため、時刻は JST 0:00 に固定する。
 */
function toPublishedDate(date: unknown): Date {
  const day = date instanceof Date ? date.toISOString().slice(0, 10) : String(date);
  return new Date(`${day}T00:00:00+09:00`);
}

export function GET() {
  const posts = getAllPosts();
  const dates = posts.map((post) => toPublishedDate(post.data.date));

  const feed = new Feed({
    id: `${SITE_URL}/`,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    link: `${SITE_URL}/`,
    language: 'ja',
    image: `${SITE_URL}/ogp.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `© 2024-${new Date().getFullYear()} Laplusblog. All rights reserved.`,
    updated: dates[0],
    feedLinks: { rss: `${SITE_URL}/feed.xml` },
    author: { name: 'Laplusdestiny', link: SITE_URL },
  });

  posts.forEach((post, i) => {
    const url = `${SITE_URL}${postPath(post.slug)}`;
    feed.addItem({
      title: post.data.title,
      id: url,
      link: url,
      description: post.data.description,
      date: dates[i],
      category: (post.data.tags ?? []).map((tag: string) => ({ name: tag })),
    });
  });

  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
