import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
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
        </div>
    );
}
