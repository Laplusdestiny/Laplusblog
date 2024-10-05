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
import { faBluesky, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './content.css';

// Parse markdown contents
export default async function BlogPost({ params }) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);

    // Convert markdown to html
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const title = data.title;
    const date = data.date;

    // Process markdown using remark and rehype
    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(content);

    const contentHtml = processedContent.toString();
    const twitterUrl = `https://twitter.com/share?url=https://blog.laplusdestiny.com/${slug}&text=Laplusblog ${encodeURIComponent(title)}`;
    const misskeyUrl = `https://misskey-hub.net/share/?text=Laplusblog+${encodeURIComponent(title)}&url=https:%2F%2Fblog.laplusdestiny.com/${slug}&visibility=public&localOnly=0&manualInstance=misskey.io`
    const blueskyUrl = `https://bsky.app/intent/compose?text=Laplusblog+${encodeURIComponent(title)} https:%2F%2Fblog.laplusdestiny.com/${slug}`

    return (
        <div className="bg-white px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {title}
                </h1>
                <div className="flex items-center gap-x-4 text-xs">
                    <div className="text-gray-500">{date}</div>
                </div>
                <div
                    className="mt-6"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                ></div>
            </div>
            <div className='mx-auto mt-8 max-w-3xl gap-4'>
                <div className='mx-auto mt-8 grid grid-cols-3'>
                    <div className='col-span-1 flex justify-center bg-black text-white items-center'>
                        <Link href={twitterUrl} target="_blank" rel="noopener noreferrer" className='text-white no-underline'>
                            <FontAwesomeIcon icon={faXTwitter} className='h-[30px]' />
                        </Link>
                    </div>
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
                    <div className='col-span-1 flex justify-center bg-[#1185FE] text-white items-center'>
                        <Link href={blueskyUrl} target="_blank" rel="noopener noreferrer" className='text-white no-underline'>
                            <FontAwesomeIcon icon={faBluesky} className='h-[30px]' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

