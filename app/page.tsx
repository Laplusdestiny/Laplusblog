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
        url: 'https://blog.laplusdestiny.com/ogp.png',
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
      const { data } = matter(fileContents);

      // Get slug and frontmatter(title, date, description)
      return {
        slug: fileName.replace('.md', ''),
        frontmatter: data,
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
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl no-border">記事一覧</h2>
          <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex max-w-xl flex-col items-start justify-between"
              >
                <div className="group relative">
                  {/* Display date */}
                  <div className="flex items-center gap-x-4 text-xs">
                    <div className="text-gray-500">{post.frontmatter.date}</div>
                  </div>
                  {/* Title, link */}
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-blue-700 group-hover:text-blue-400">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="mt-3 text-lg font-semibold leading-6 text-blue-700 group-hover:text-blue-400"
                    >
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  {/* Description */}
                  <p
                    className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: `${post.frontmatter.description}` }}
                  ></p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
