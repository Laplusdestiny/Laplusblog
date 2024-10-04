import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";

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
        <Analytics />
        <Header />
        <div className="flex flex-col md:flex-row">
          <main className="w-full md:w-3/4 p-4 bg-white shadow-lg rounded-lg">
            {children}
          </main>
          <aside className="hidden md:block md:w-1/4 p-4 bg-gray-100">
            <h2 className="text-center">Follow Me</h2>
            <div className="grid grid-cols-4 place-content-center">
              <div>
                <Link href="https://x.com/Laplusdestiny">
                  <Image
                    src="https://img.icons8.com/?size=100&id=ud9VVQzOPag8&format=png&color=000000"
                    height={10}
                    width={70}
                    alt="Twitter"
                  />
                </Link>
              </div>
              <div>
                <Link href="https://misskey.io/@Laplusdestiny">
                  <Image
                    src="https://github.com/misskey-dev/assets/blob/main/public/favicon.png?raw=true"
                    height={10}
                    width={70}
                    alt="misskey.io"
                  />
                </Link>
              </div>
              <div>
                <Link href="https://github.com/Laplusdestiny">
                  <Image
                    src="https://img.icons8.com/?size=100&id=20675&format=png&color=000000"
                    height={10}
                    width={70}
                    alt="GitHub"
                  />
                </Link>
              </div>
            </div>
          </aside>
        </div>
        <Footer />
      </body>
    </html>
  );
}
