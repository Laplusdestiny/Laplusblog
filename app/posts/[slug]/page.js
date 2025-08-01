import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeAutoLinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import Link from "next/link";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBluesky, faLine, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './content.css';
import fetch from 'node-fetch';
import { notFound } from 'next/navigation';
import ClipboardButton from './ClipboardButton';

// Create a DOMPurify instance with jsdom
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Generate metadata for each blog post
export async function generateMetadata({ params }) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

    // Check if the markdown file exists
    if (!fs.existsSync(filePath)) {
        return notFound();
    }

    // Read the markdown file content from the given file path
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents); // Extract metadata from the markdown file
    const title = data.title;
    const description = data.description || "Blog post on Laplusblog"; // Description from frontmatter or default value

    return {
        title: `${title} - Laplusblog`,
        description: description,
        openGraph: {
            title: `${title} - Laplusblog`,
            description: description,
            type: 'article',
            siteName: 'Laplusblog',
            url: `https://blog.laplusdestiny.com/${slug}`,
            images: [
                {
                    url: 'https://blog.laplusdestiny.com/ogp.png',
                    width: 800,
                    height: 600,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} - Laplusblog`,
            description: description,
            image: {
                url: 'https://blog.laplusdestiny.com/ogp.png',
                alt: title,
                width: 800,
                height: 600,
            },
            url: `https://blog.laplusdestiny.com/${slug}`,
            site: '@Laplusdestiny',
            creator: '@Laplusdestiny',
        }
    };
}

// Parse markdown contents
export default async function BlogPost({ params }) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

    // Check if the markdown file exists
    if (!fs.existsSync(filePath)) {
        return notFound();
    }

    // Read the markdown file content from the given file path
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents); // Extract metadata and content from the markdown file
    const title = data.title;
    const date = data.date;
    const tags = (data.tags || []).sort(); // Extract tags or default to an empty array if not provided

    // Process the markdown content to convert it to HTML
    const processedContent = await unified()
        .use(remarkParse) // Parse the markdown content into an abstract syntax tree (AST)
        .use(remarkGfm) // Add support for GitHub Flavored Markdown (GFM)
        .use(remarkRehype, { allowDangerousHtml: true }) // Convert the markdown AST to a rehype AST (HTML)
        .use(rehypeSlug) // Add slugs to headings to enable linking
        .use(rehypeAutoLinkHeadings) // Add auto-generated anchor links to headings
        .use(rehypeStringify, { allowDangerousHtml: true }) // Convert the rehype AST to an HTML string
        .process(content);

    const contentHtml = processedContent.toString();

    // Construct URLs for sharing on various social media platforms
    const pageUrl = `https://blog.laplusdestiny.com/${slug}`;
    const twitterUrl = `https://twitter.com/share?url=${pageUrl}&text=Laplusblog ${encodeURIComponent(title)}`;
    const misskeyUrl = `https://misskey-hub.net/share/?text=Laplusblog+${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}&visibility=public&localOnly=0&manualInstance=misskey.io`;
    const blueskyUrl = `https://bsky.app/intent/compose?text=Laplusblog+${encodeURIComponent(title)} ${encodeURIComponent(pageUrl)}`;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(pageUrl)}%0a${encodeURIComponent(title)}`;
    const clipboardText = `Laplusblog ${title} - ${pageUrl}`;

    // Get git commit history for the markdown file using GitHub API
    let commitHistory = [];
    let latestCommitDate = null;
    try {
        const response = await fetch(`https://api.github.com/repos/Laplusdestiny/Laplusblog/commits?path=posts/${slug}.md`, {
            headers: {
                'Accept': 'application/vnd.github+json'
            }
        });
        if (response.ok) {
            const commits = await response.json();
            commitHistory = commits.map(commit => {
                return {
                    date: commit.commit.author.date,
                    message: commit.commit.message,
                    url: commit.html_url
                };
            });
            if (commits.length > 0) {
                latestCommitDate = commits[0].commit.author.date;
            }
        } else {
            console.error('Error retrieving commit history from GitHub:', response.statusText);
        }
    } catch (error) {
        console.error('Error retrieving commit history:', error);
    }

    return (
        <>
            {/* Blog content */}
            <div className="bg-background px-6 py-32 lg:px-8">
                <div className="mx-auto max-w-3xl text-base leading-7 text-foreground">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:underline">ホーム</Link>
                        <span>/</span>
                        <span>{title}</span>
                    </div>
                    {/* Blog title */}
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {title}
                    </h1>
                    {/* Blog date */}
                    <div className="flex items-center gap-x-4 text-xs">
                        <div className="text-muted-foreground">
                            {date} {latestCommitDate && `(Latest update: ${new Date(latestCommitDate).toISOString().split('T')[0]})`}
                        </div>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Link key={index} href={`/tags/${tag}`} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80">
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Table of Contents */}
                    <div className="mt-6 p-4 border rounded-lg bg-card toc-container">
                        <h2 className="text-lg font-semibold text-card-foreground mb-3 toc-heading">Table of Contents</h2>
                        <div className="mt-2 text-sm text-card-foreground">
                            <ul className="pl-4 list-disc list-inside toc-list">
                                {contentHtml.match(/<h[23](.*?)>(.*?)<\/h[23]>/g).map((heading, index) => {
                                    const id = DOMPurify.sanitize(heading.match(/id=\"(.*?)\"/)[1]);
                                    const headingText = DOMPurify.sanitize(heading, { ALLOWED_TAGS: [] }).trim();
                                    const isH3 = heading.startsWith('<h3');
                                    return (
                                        <li key={index} className={`mb-1 hover:text-primary transition-all toc-item ${isH3 ? 'pl-4' : ''}`}>
                                            <a href={`#${id}`} className="text-primary/80 underline hover:no-underline toc-link">{headingText}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Blog content rendered as HTML */}
                    <div
                        className="mt-6 prose lg:prose-xl dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    ></div>
                </div>

                {/* Share buttons */}
                <div className='mx-auto mt-8 max-w-3xl gap-4'>
                    <div className='mx-auto mt-8 grid grid-cols-5'>
                        {/* Twitter Share Button */}
                        <div className='col-span-1 flex justify-center bg-black text-white items-center'>
                            <Link href={twitterUrl} target="_blank" rel="noopener noreferrer" className='text-white no-underline'>
                                <FontAwesomeIcon icon={faXTwitter} className='h-[30px]' />
                            </Link>
                        </div>
                        {/* Misskey Share Button */}
                        <div className='col-span-1 flex justify-center items-center bg-[#192320]'>
                            <Link href={misskeyUrl} target="_blank" rel="noopener noreferrer">
                                <Image
                                    src="https://github.com/misskey-dev/assets/blob/main/public/favicon.png?raw=true"
                                    height={45}
                                    width={45}
                                    alt="misskey.io"
                                />
                            </Link>
                        </div>
                        {/* Bluesky Share Button */}
                        <div className='col-span-1 flex justify-center bg-[#1185FE] text-white items-center'>
                            <Link href={blueskyUrl} target="_blank" rel="noopener noreferrer" className='text-white no-underline'>
                                <FontAwesomeIcon icon={faBluesky} className='h-[30px]' />
                            </Link>
                        </div>
                        {/* LINE Share Button */}
                        <div className='col-span-1 flex justify-center bg-[#06c755] text-white items-center'>
                            <Link href={lineUrl} target="_blank" rel="noopener noreferrer" className='text-white no-underline'>
                                <FontAwesomeIcon icon={faLine} className='h-[30px]' />
                            </Link>
                        </div>
                        {/* Clipboard Button */}
                        <div className='col-span-1 flex justify-center bg-black text-white items-center'>
                            <ClipboardButton clipboardText={clipboardText} />
                        </div>
                    </div>
                </div>

                {/* Commit History */}
                <div className='mx-auto mt-12 max-w-3xl'>
                    <details>
                        <summary className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl cursor-pointer">
                            Change History
                        </summary>
                        <div className="mt-4 border rounded-lg p-4 bg-card overflow-x-auto">
                            <table className="min-w-full text-sm text-muted-foreground">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="px-4 py-2 text-left font-semibold text-foreground">Date</th>
                                        <th className="px-4 py-2 text-left font-semibold text-foreground">Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commitHistory.map((commit, index) => (
                                        <tr key={index} className="border-b border-border">
                                            <td className="px-4 py-2">{commit.date}</td>
                                            <td className="px-4 py-2">
                                                <a href={commit.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                                    {commit.message}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            </div>
        </>
    );
}
