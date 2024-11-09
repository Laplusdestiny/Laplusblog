import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import Link from "next/link";
import Image from 'next/image';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBluesky, faLine, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './content.css';
import fetch from 'node-fetch';

// Parse markdown contents
export default async function BlogPost({ params }) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

    // Read the markdown file content from the given file path
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents); // Extract metadata and content from the markdown file
    const title = data.title;
    const date = data.date;
    const description = data.description || "Blog post on Laplusblog"; // Description from frontmatter or default value
    const tags = (data.tags || []).sort(); // Extract tags or default to an empty array if not provided

    // Process the markdown content to convert it to HTML
    const processedContent = await unified()
        .use(remarkParse) // Parse the markdown content into an abstract syntax tree (AST)
        .use(remarkGfm) // Add support for GitHub Flavored Markdown (GFM)
        .use(remarkRehype) // Convert the markdown AST to a rehype AST (HTML)
        .use(rehypeStringify) // Convert the rehype AST to an HTML string
        .process(content);

    const contentHtml = processedContent.toString();

    // Construct URLs for sharing on various social media platforms
    const pageUrl = `https://blog.laplusdestiny.com/${slug}`;
    const ogImage = '/ogp.png';
    const twitterUrl = `https://twitter.com/share?url=${pageUrl}&text=Laplusblog ${encodeURIComponent(title)}`;
    const misskeyUrl = `https://misskey-hub.net/share/?text=Laplusblog+${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}&visibility=public&localOnly=0&manualInstance=misskey.io`;
    const blueskyUrl = `https://bsky.app/intent/compose?text=Laplusblog+${encodeURIComponent(title)} ${encodeURIComponent(pageUrl)}`;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(pageUrl)}%0a${encodeURIComponent(title)}`;

    // Get git commit history for the markdown file using GitHub API
    let commitHistory = [];
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
        } else {
            console.error('Error retrieving commit history from GitHub:', response.statusText);
        }
    } catch (error) {
        console.error('Error retrieving commit history:', error);
    }

    return (
        <>
            {/* OGP settings for each page */}
            <Head>
                <title>{title} - Laplusblog</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:image" content={`https://blog.laplusdestiny.com${ogImage}`} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Laplusblog" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={`https://blog.laplusdestiny.com${ogImage}`} />
                <meta name="twitter:url" content={pageUrl} />
            </Head>

            {/* Blog content */}
            <div className="bg-white px-6 py-32 lg:px-8">
                <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                    {/* Blog title */}
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title}
                    </h1>
                    {/* Blog date */}
                    <div className="flex items-center gap-x-4 text-xs">
                        <div className="text-gray-500">{date}</div>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="mt-4 flex gap-2">
                            {tags.map((tag, index) => (
                                <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Blog content rendered as HTML */}
                    <div
                        className="mt-6"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    ></div>
                </div>

                {/* Share buttons */}
                <div className='mx-auto mt-8 max-w-3xl gap-4'>
                    <div className='mx-auto mt-8 grid grid-cols-4'>
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
                    </div>
                </div>

                {/* Commit History */}
                <div className='mx-auto mt-12 max-w-3xl'>
                    <details>
                        <summary className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl cursor-pointer">
                            Change History
                        </summary>
                        <div className="mt-4 border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-600">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2 text-left font-semibold text-gray-800">Date</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-800">Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commitHistory.map((commit, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">{commit.date}</td>
                                            <td className="px-4 py-2">
                                                <a href={commit.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
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
