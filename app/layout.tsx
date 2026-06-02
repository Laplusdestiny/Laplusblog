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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="container mx-auto bg-background text-foreground min-h-screen flex flex-col justify-between">
        <Analytics />
        <div>
          <Header />
          <div className="flex flex-col md:flex-row">
            <main className="w-full p-6 md:p-10 max-w-5xl mx-auto">
              {children}
            </main>
          </div>
        </div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
