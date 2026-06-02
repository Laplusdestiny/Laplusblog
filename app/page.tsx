import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laplusblog',
  description: 'Blog page of Laplusdestiny',
  openGraph: {
    title: 'Laplusblog',
    description: 'Blog page of Laplusdestiny',
    url: 'https://blog.laplusdestiny.com',
    siteName: 'Laplusblog',
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        alt: 'Laplusblog OGP Image',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
}

export default async function Blogs() {
  // Get markdown filelist
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  // Get all file contents
  const posts = await Promise.all(
    // Get file contents
    fileNames.map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // マークダウン記号やリンク記述、空白を除去して純粋な文字数を算出
      const cleanContent = content
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンクはテキストのみ残す
        .replace(/[#*`~\-\n\r\s]/g, '');         // マークダウン記号と改行・空白を除去
      const wordCount = cleanContent.length;

      // Get slug and frontmatter(title, date, description)
      return {
        slug: fileName.replace('.md', ''),
        frontmatter: data,
        wordCount,
      };
    })
  ).then((posts) =>
    // Sort by updated date
    posts.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateB - dateA;
    })
  );


  return (
    <div className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl no-border">記事一覧</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col items-start justify-between rounded-lg border p-4 transition-shadow hover:shadow-lg"
              >
                <div className="group relative">
                  {/* Display date and word count */}
                  <div className="flex items-center gap-x-4 text-xs text-muted-foreground">
                    <div>{post.frontmatter.date}</div>
                    <span>•</span>
                    <div>{post.wordCount.toLocaleString()} 文字</div>
                  </div>
                  {/* Title, link */}
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-primary group-hover:text-primary/80">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="mt-3 text-lg font-semibold leading-6 text-primary group-hover:text-primary/80"
                    >
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  {/* Description */}
                  <p
                    className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: `${post.frontmatter.description}` }}
                  ></p>
                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.frontmatter.tags && post.frontmatter.tags.map((tag: string) => (
                      <Link key={tag} href={`/tags/${tag}`} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
