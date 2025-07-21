import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={GeistSans.className}>
      <body className="container mx-auto bg-background text-foreground">
        <Analytics />
        <Header />
        <div className="flex flex-col md:flex-row">
          <main className="w-full p-4">
            {children}
          </main>
        </div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
