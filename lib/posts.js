import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

// 記事本文をページ分割するマーカー (単独行で記述する)
//   <!-- nextpage -->
const PAGE_BREAK = /^\s*<!--\s*nextpage\s*-->\s*$/i;
const FENCE = /^\s*(`{3,}|~{3,})/;

/**
 * Markdown 本文を <!-- nextpage --> の行で分割する。
 * コードブロック内のマーカーは区切りとして扱わない。空のページは除外する。
 */
export function splitPages(content) {
    const pages = [];
    let current = [];
    let fence = null;

    for (const line of content.split(/\r?\n/)) {
        const fenceMatch = line.match(FENCE);
        if (fenceMatch) {
            const marker = fenceMatch[1];
            if (fence === null) {
                fence = marker;
            } else if (marker[0] === fence[0] && marker.length >= fence.length) {
                fence = null;
            }
        }

        if (fence === null && PAGE_BREAK.test(line)) {
            pages.push(current.join('\n'));
            current = [];
            continue;
        }
        current.push(line);
    }
    pages.push(current.join('\n'));

    const nonEmpty = pages.filter((page) => page.trim() !== '');
    return nonEmpty.length > 0 ? nonEmpty : [''];
}

/**
 * posts/<slug>.md を読み込み、frontmatter とページ分割済み本文を返す。
 * ファイルが存在しない場合は null。
 */
export function getPost(slug) {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    if (path.dirname(filePath) !== postsDirectory || !fs.existsSync(filePath)) {
        return null;
    }
    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    return { data, pages: splitPages(content) };
}

/** URL のページ番号セグメントを検証して数値にする。不正なら null。 */
export function parsePageNumber(segment) {
    return /^[1-9]\d{0,3}$/.test(segment) ? Number(segment) : null;
}

/** ページ番号から記事の URL パスを組み立てる (1 ページ目は /posts/<slug>) */
export function postPath(slug, pageNumber = 1) {
    return pageNumber > 1 ? `/posts/${slug}/${pageNumber}` : `/posts/${slug}`;
}
