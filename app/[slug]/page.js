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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBluesky, faLine, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './content.css';

// Parse markdown contents
export default async function BlogPost({ params }) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

    // Read the markdown file content from the given file path
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents); // Extract metadata and content from the markdown file
    const title = data.title;
    const date = data.date;

    // Process the markdown content to convert it to HTML
    const processedContent = await unified()
        .use(remarkParse) // Parse the markdown content into an abstract syntax tree (AST)
        .use(remarkGfm) // Add support for GitHub Flavored Markdown (GFM)
        .use(remarkRehype) // Convert the markdown AST to a rehype AST (HTML)
        .use(rehypeStringify) // Convert the rehype AST to an HTML string
        .process(content);

    const contentHtml = processedContent.toString();

    // Construct URLs for sharing on various social media platforms
    const twitterUrl = `https://twitter.com/share?url=https://blog.laplusdestiny.com/${slug}&text=Laplusblog ${encodeURIComponent(title)}`;
    const misskeyUrl = `https://misskey-hub.net/share/?text=Laplusblog+${encodeURIComponent(title)}&url=https:%2F%2Fblog.laplusdestiny.com/${slug}&visibility=public&localOnly=0&manualInstance=misskey.io`;
    const blueskyUrl = `https://bsky.app/intent/compose?text=Laplusblog+${encodeURIComponent(title)} https:%2F%2Fblog.laplusdestiny.com/${slug}`;
    const lineUrl = `https://line.me/R/msg/text/?{https://blog.laplusdestiny.com/${slug}}%0a{Laplusblog ${encodeURIComponent(title)}}`;

    return (
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
                {/* Blog content rendered as HTML */}
                <div
                    className="mt-6"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                ></div>
            </div>
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
        </div>
    );
}
