import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your personal expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme')??"dark";document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--c-page)] text-[var(--c-t1)] transition-colors duration-200">
        <ThemeProvider>
          <nav className="bg-[var(--c-nav)] backdrop-blur-md sticky top-0 z-40" style={{ borderBottom: "1px solid var(--c-border)", boxShadow: "0 1px 0 var(--c-border), 0 4px 12px rgba(0,0,0,0.04)" }}>
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="font-semibold text-[var(--c-t1)] flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: "#FFCC00" }}>RM</span>
                <span>Expense Tracker</span>
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className="px-3 py-1.5 text-sm text-[var(--c-t2)] hover:text-[var(--c-t1)] rounded-lg hover:bg-[var(--c-hover)] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/expenses"
                  className="px-3 py-1.5 text-sm text-[var(--c-t2)] hover:text-[var(--c-t1)] rounded-lg hover:bg-[var(--c-hover)] transition-colors"
                >
                  Transactions
                </Link>
                <Link
                  href="/settings"
                  className="px-3 py-1.5 text-sm text-[var(--c-t2)] hover:text-[var(--c-t1)] rounded-lg hover:bg-[var(--c-hover)] transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
          </nav>
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
