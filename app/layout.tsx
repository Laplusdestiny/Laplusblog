import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluesky, faSquareGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";

export const metadata: Metadata = {
  title: "Laplusblog",
  description: "Blog page of Laplusdestiny",
  openGraph: {
    title: "Laplusblog",
    description: "Blog page of Laplusdestiny",
    url: "https://blog.laplusdestiny.com",
    siteName: "Laplusblog",
    images: [
      {
        url: "https://blog.laplusdestiny.com/ogp.png",
        width: 1200,
        height: 630,
        alt: "Laplusblog OGP Image"
      }
    ],
    locale: "ja_JP",
    type: "website"
  }
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
            <h2 className="text-center text-xl font-semibold mb-4">Follow Me</h2>
            <div className="flex flex-col items-center space-y-4">
              <Link href="https://x.com/Laplusdestiny" className="transition-transform transform hover:scale-110 text-black">
                <FontAwesomeIcon icon={faXTwitter} className='h-[40px] w-[40px]' />
              </Link>
              <Link href="https://misskey.io/@Laplusdestiny" className="transition-transform transform hover:scale-110">
                <Image
                  src="https://github.com/misskey-dev/assets/blob/main/public/favicon.png?raw=true"
                  height={40}
                  width={40}
                  alt="misskey.io"
                />
              </Link>
              <Link href="https://github.com/Laplusdestiny" className="transition-transform transform hover:scale-110 text-black ">
                <FontAwesomeIcon icon={faSquareGithub} className='h-[40px] w-[40px]' />
              </Link>
              <Link href="https://bsky.app/profile/laplusdestiny.com" className="transition-transform transform hover:scale-110 text-[#1185FE]">
                <FontAwesomeIcon icon={faBluesky} className='h-[40px] w-[40px]' />
              </Link>
            </div>
          </aside>
        </div>
        <Footer />
      </body>
    </html>
  );
}
