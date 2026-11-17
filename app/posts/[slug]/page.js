import { generatePostMetadata, PostPage } from './post';

// /posts/<slug> : 記事の 1 ページ目
export async function generateMetadata({ params }) {
    const { slug } = await params;
    return generatePostMetadata(slug, 1);
}

export default async function BlogPost({ params }) {
    const { slug } = await params;
    return <PostPage slug={slug} pageNumber={1} />;
}
