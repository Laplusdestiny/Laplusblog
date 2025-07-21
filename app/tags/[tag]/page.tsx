import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  return {
    title: `#${params.tag} | Laplusblog`,
    description: `Posts tagged with #${params.tag}`,
  };
}

export default async function TagPage({ params }: { params: { tag: string } }) {
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
      posts.filter((post) => post.frontmatter.tags && post.frontmatter.tags.includes(params.tag))
    )
    .then((posts) =>
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl no-border">#{params.tag}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col items-start justify-between rounded-lg border p-4 transition-shadow hover:shadow-lg"
              >
                <div className="group relative">
                  <div className="flex items-center gap-x-4 text-xs">
                    <div className="text-muted-foreground">{post.frontmatter.date}</div>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-primary group-hover:text-primary/80">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="mt-3 text-lg font-semibold leading-6 text-primary group-hover:text-primary/80"
                    >
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  <p
                    className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: `${post.frontmatter.description}` }}
                  ></p>
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
