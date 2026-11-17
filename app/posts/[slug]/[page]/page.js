import { notFound, permanentRedirect } from 'next/navigation';
import { generatePostMetadata, PostPage } from '../post';
import { parsePageNumber, postPath } from '../../../../lib/posts';

// /posts/<slug>/<page> : 記事の 2 ページ目以降
export async function generateMetadata({ params }) {
    const { slug, page } = await params;
    const pageNumber = parsePageNumber(page);
    if (pageNumber === null) {
        return notFound();
    }
    return generatePostMetadata(slug, pageNumber);
}

export default async function BlogPostPage({ params }) {
    const { slug, page } = await params;
    const pageNumber = parsePageNumber(page);
    if (pageNumber === null) {
        return notFound();
    }
    // /posts/<slug>/1 は /posts/<slug> に統一する
    if (pageNumber === 1) {
        permanentRedirect(postPath(slug));
    }
    return <PostPage slug={slug} pageNumber={pageNumber} />;
}
