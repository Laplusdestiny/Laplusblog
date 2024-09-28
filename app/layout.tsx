import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";

export const metadata: Metadata = {
  title: "Laplusblog",
  description: "Blog page of Laplusdestiny",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="container mx-auto">
        <Header />
        <div className="flex">
          <main className="w-3/4 p-4 bg-white shadow-lg rounded-lg">
            {children}
          </main>
          <aside className="w-1/4 p-4 bg-gray-100">
            <h2 className="text-center">Follow Us</h2>
            <a className="twitter-timeline" href="https://twitter.com/Laplusdestiny?ref_src=twsrc%5Etfw">Tweets by Laplusdestiny</a> <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
          </aside>
        </div>
      </body>
    </html>
  );
}
