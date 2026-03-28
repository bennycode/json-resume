import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSON Resume Builder",
  description: "Build your resume following the JSON Resume standard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <Link href="/dashboard" className="inline-block">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Resume Builder
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Build your professional profile
              </p>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
