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


  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="py-8 md:py-16 max-w-4xl mx-auto">
      {/* Introduction Hero Section */}
      <div className="mb-16 md:mb-24 text-left border-b border-border/40 pb-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Laplusdestiny</p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Laplusblog
        </h2>
        <p className="text-sm md:text-base text-muted-foreground font-normal max-w-xl leading-relaxed">
          技術、デザイン、そして日々の考察。
          思考を整理し、洗練された言葉で書き綴る個人の技術・雑記ブログです。
        </p>
      </div>

      {/* Featured Post (Latest Article) */}
      {featuredPost && (
        <div className="mb-20 md:mb-28">
          <div className="flex items-center gap-x-3 text-xs tracking-wider text-muted-foreground uppercase font-semibold mb-4">
            <span className="text-foreground border border-foreground/30 px-2 py-0.5 rounded text-[10px]">NEW</span>
            <div>{featuredPost.frontmatter.date}</div>
            <span>•</span>
            <div>{featuredPost.wordCount.toLocaleString()} 文字</div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            <Link
              href={`/posts/${featuredPost.slug}`}
              className="relative inline group transition-colors hover:text-foreground/80"
            >
              {featuredPost.frontmatter.title}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </h3>
          
          <p
            className="text-base text-muted-foreground mb-6 leading-relaxed line-clamp-3 md:line-clamp-none max-w-3xl"
            dangerouslySetInnerHTML={{ __html: `${featuredPost.frontmatter.description}` }}
          ></p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {featuredPost.frontmatter.tags && featuredPost.frontmatter.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <div className="border-b border-border/40 pb-12">
            <Link
              href={`/posts/${featuredPost.slug}`}
              className="text-sm font-semibold tracking-wider text-foreground hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              続きを読む <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      )}

      {/* Remaining Posts Grid */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-8">
          過去の記事一覧
        </h4>
        <div className="grid gap-12 sm:grid-cols-2">
          {remainingPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col items-start justify-between border-b border-border/40 pb-8 transition-opacity duration-300"
            >
              <div className="w-full">
                {/* Date & Word count */}
                <div className="flex items-center gap-x-2 text-[11px] tracking-wider text-muted-foreground font-medium uppercase mb-3">
                  <div>{post.frontmatter.date}</div>
                  <span>•</span>
                  <div>{post.wordCount.toLocaleString()} 文字</div>
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
                  {post.frontmatter.tags && post.frontmatter.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors"
                    >
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
  );
}
