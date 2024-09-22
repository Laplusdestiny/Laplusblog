import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>トップページ</h1>
      <Link href="/blog">
        ブログページへ
      </Link>
    </div>
  );
}
