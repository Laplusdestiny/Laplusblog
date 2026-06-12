import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} | Laplusblog`,
    description: `Posts tagged with #${tag}`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug: fileName.replace('.md', ''),
        frontmatter: data,
      };
    })
  )
    .then((posts) =>
      posts.filter((post) => post.frontmatter.tags && post.frontmatter.tags.includes(tag))
    )
    .then((posts) =>
      posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date).getTime();
        const dateB = new Date(b.frontmatter.date).getTime();
        return dateB - dateA;
      })
    );

  return (
    <div className="py-8 md:py-16 max-w-4xl mx-auto">
      {/* Title section */}
      <div className="mb-12 border-b border-border/40 pb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">タグ別記事一覧</p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          #{tag}
        </h2>
      </div>

      {/* Posts List */}
      <div className="grid gap-12 sm:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col items-start justify-between border-b border-border/40 pb-8 transition-opacity duration-300"
          >
            <div className="w-full">
              {/* Date */}
              <div className="flex items-center gap-x-2 text-[11px] tracking-wider text-muted-foreground font-medium uppercase mb-3">
                <div>{post.frontmatter.date}</div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold tracking-tight text-foreground mb-3 leading-snug">
                <Link
                  href={`/posts/${post.slug}`}
                  className="relative inline-block group hover:text-foreground/80 transition-colors"
                >
                  {post.frontmatter.title}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </h3>

              {/* Description */}
              <p
                className="line-clamp-3 text-sm leading-relaxed text-muted-foreground mb-4 font-normal"
                dangerouslySetInnerHTML={{ __html: `${post.frontmatter.description}` }}
              ></p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.frontmatter.tags && post.frontmatter.tags.map((t: string) => (
                  <Link
                    key={t}
                    href={`/tags/${t}`}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                      t === tag
                        ? 'bg-foreground text-background hover:opacity-80'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                    }`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
