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

import Link from "next/link";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBluesky, faLine, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './content.css';
import fetch from 'node-fetch';
import { notFound } from 'next/navigation';
import ClipboardButton from './ClipboardButton';
import TwitterLoader from './TwitterLoader';



// Generate metadata for each blog post
export async function generateMetadata({ params }) {
    const { slug } = await params;
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
            url: `https://blog.laplusdestiny.com/posts${slug}`,
            images: [
                {
                    url: '/ogp.png',
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
                url: '/ogp.png',
                alt: title,
                width: 800,
                height: 600,
            },
            url: `https://blog.laplusdestiny.com/posts/${slug}`,
            site: '@Laplusdestiny',
            creator: '@Laplusdestiny',
        }
    };
}

// Parse markdown contents
export default async function BlogPost({ params }) {
    const { slug } = await params;
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

    // Extract H2/H3 headings for TOC without using jsdom/dompurify (server-safe)
    const headingRegex = /<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/gms;
    const tocItems = [];
    let _m;
    while ((_m = headingRegex.exec(contentHtml)) !== null) {
        const level = _m[1];
        const id = _m[2];
        const innerHtml = _m[3] || '';
        const text = innerHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        tocItems.push({ id, text, isH3: level === '3' });
    }

    // Construct URLs for sharing on various social media platforms
    const pageUrl = `https://blog.laplusdestiny.com/posts/${slug}`;
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
            <div className="bg-background px-4 py-10 md:py-16 lg:px-8">
                <div className="mx-auto max-w-3xl text-base leading-7 text-foreground">
                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
                        <span className="text-[9px] opacity-60">/</span>
                        <span className="text-foreground/80 truncate max-w-[200px] md:max-w-none">{title}</span>
                    </div>

                    {/* Blog title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
                        {title}
                    </h1>

                    {/* Blog date & update */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground border-b border-border/40 pb-6 mb-8 uppercase tracking-wider font-medium">
                        <div>投稿日: {date}</div>
                        {latestCommitDate && (
                            <>
                                <span className="hidden md:inline">•</span>
                                <div>最終更新日: {new Date(latestCommitDate).toISOString().split('T')[0]}</div>
                            </>
                        )}
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {tags.map((tag, index) => (
                                <Link
                                    key={index}
                                    href={`/tags/${tag}`}
                                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Table of Contents */}
                    <div className="p-6 border border-border/40 rounded-xl bg-secondary/30 mb-10 toc-container">
                        <h2 className="text-sm uppercase tracking-wider font-bold text-foreground mb-4 toc-heading">目次</h2>
                        <div className="text-sm">
                            <ul className="space-y-2 toc-list">
                                {tocItems.length > 0 ? tocItems.map((h, index) => (
                                    <li
                                        key={index}
                                        className={`transition-all toc-item ${h.isH3 ? 'pl-4 border-l border-border/60 ml-2' : ''}`}
                                    >
                                        <a
                                            href={`#${encodeURIComponent(h.id)}`}
                                            className="text-muted-foreground hover:text-foreground transition-colors duration-200 toc-link"
                                        >
                                            {h.text}
                                        </a>
                                    </li>
                                )) : <li className="text-muted-foreground">見出しがありません</li>}
                            </ul>
                        </div>
                    </div>

                    {/* Blog content rendered as HTML */}
                    <div
                        className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-normal"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    ></div>
                    <TwitterLoader />
                </div>

                {/* Share buttons */}
                <div className='mx-auto mt-16 max-w-3xl border-t border-b border-border/40 py-8 flex flex-col items-center gap-4'>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">この記事をシェアする</span>
                    <div className='flex flex-wrap justify-center gap-4'>
                        {/* Twitter Share Button */}
                        <Link
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                            title="X (Twitter) でシェア"
                        >
                            <FontAwesomeIcon icon={faXTwitter} className='h-4 w-4' />
                        </Link>
                        {/* Misskey Share Button */}
                        <Link
                            href={misskeyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                            title="Misskey でシェア"
                        >
                            <svg
                                viewBox="0 0 160 160"
                                className="h-4 w-4"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g transform="matrix(0.28948,0,0,0.28948,-54.705,-30.7703)">
                                    <path
                                        d="M256.418,188.976C248.558,188.944 240.758,190.308 233.379,193.013C220.308,197.613 209.533,205.888 201.091,217.802C193.02,229.329 188.977,242.195 188.977,256.409L188.977,508.89C188.977,527.332 195.52,543.29 208.576,556.732C222.032,569.803 237.99,576.331 256.418,576.331C275.259,576.331 291.204,569.803 304.274,556.747C317.73,543.291 324.441,527.332 324.441,508.89L324.441,462.983C324.584,453.04 334.824,455.655 340.01,462.983C349.691,479.76 372.36,494.119 394.193,494.119C416.026,494.119 438.005,482.196 448.375,462.983C452.304,458.354 463.377,450.455 464.52,462.983L464.52,508.89C464.52,527.332 471.047,543.29 484.104,556.732C497.574,569.803 513.511,576.331 531.953,576.331C550.78,576.331 566.739,569.803 579.809,556.747C593.265,543.291 599.977,527.332 599.977,508.89L599.977,256.409C599.977,242.195 595.752,229.329 587.309,217.802C579.224,205.874 568.653,197.613 555.597,193.013C547.912,190.314 540.228,188.976 532.543,188.976C511.788,188.976 494.301,197.046 480.073,213.188L411.636,293.281C410.107,294.438 405.006,303.247 394.178,303.247C383.379,303.247 378.868,294.439 377.325,293.296L308.297,213.188C294.47,197.046 277.173,188.976 256.418,188.976ZM682.904,188.983C666.763,188.983 652.926,194.748 641.404,206.271C630.261,217.413 624.691,231.054 624.691,247.196C624.691,263.338 630.261,277.174 641.404,288.697C652.926,299.839 666.763,305.41 682.904,305.41C699.046,305.41 712.88,299.839 724.412,288.697C735.935,277.174 741.693,263.338 741.693,247.196C741.693,231.054 735.935,217.413 724.412,206.271C712.88,194.748 699.046,188.983 682.904,188.983ZM683.473,316.947C667.331,316.947 653.495,322.713 641.972,334.236C630.449,345.768 624.691,359.602 624.691,375.744L624.691,518.118C624.691,534.259 630.449,548.095 641.972,559.618C653.504,570.761 667.341,576.331 683.473,576.331C699.624,576.331 713.27,570.761 724.412,559.618C735.935,548.095 741.693,534.259 741.693,518.118L741.693,375.744C741.693,359.593 735.935,345.759 724.412,334.236C713.261,322.713 699.614,316.947 683.473,316.947Z"
                                        fillRule="nonzero"
                                    />
                                </g>
							</svg>
                        </Link>
                        {/* Bluesky Share Button */}
                        <Link
                            href={blueskyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                            title="Bluesky でシェア"
                        >
                            <FontAwesomeIcon icon={faBluesky} className='h-4 w-4' />
                        </Link>
                        {/* LINE Share Button */}
                        <Link
                            href={lineUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                            title="LINE で送る"
                        >
                            <FontAwesomeIcon icon={faLine} className='h-4 w-4' />
                        </Link>
                        {/* Clipboard Button */}
                        <ClipboardButton clipboardText={clipboardText} />
                    </div>
                </div>

                {/* Commit History */}
                <div className='mx-auto mt-16 max-w-3xl'>
                    <details className="group border border-border/40 rounded-xl p-4 bg-secondary/10">
                        <summary className="text-sm uppercase tracking-wider font-bold text-foreground cursor-pointer flex justify-between items-center select-none">
                            <span>記事の変更履歴</span>
                            <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform duration-300">▼</span>
                        </summary>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full text-xs text-muted-foreground">
                                <thead>
                                    <tr className="border-b border-border/40">
                                        <th className="px-4 py-2 text-left font-bold text-foreground">日付</th>
                                        <th className="px-4 py-2 text-left font-bold text-foreground">更新内容</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commitHistory.length > 0 ? commitHistory.map((commit, index) => (
                                        <tr key={index} className="border-b border-border/20 last:border-b-0">
                                            <td className="px-4 py-2 whitespace-nowrap">{new Date(commit.date).toISOString().split('T')[0]}</td>
                                            <td className="px-4 py-2">
                                                <a href={commit.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline transition-colors">
                                                    {commit.message}
                                                </a>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="2" className="px-4 py-2 text-center text-muted-foreground">履歴の取得に失敗したか、履歴がありません</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            </div>
        </>
    );
}
