import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nucleus Connect — Utah Innovation Opportunity Graph",
  description: "AI-powered talent-to-startup matching for Utah's innovation ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8f9fb] text-[#0f172a]">
        <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f] text-white font-bold text-sm">N</div>
              <span className="text-lg font-bold tracking-tight text-[#1e3a5f]">Nucleus Connect</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/intake" className="text-[#64748b] hover:text-[#1e3a5f] transition-colors">Find Connections</Link>
              <Link href="/staff" className="text-[#64748b] hover:text-[#1e3a5f] transition-colors">Staff Dashboard</Link>
              <Link href="/graph" className="text-[#64748b] hover:text-[#1e3a5f] transition-colors">Opportunity Graph</Link>
              <Link href="/integrations" className="text-[#64748b] hover:text-[#1e3a5f] transition-colors">Integrations</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#e2e8f0] bg-white py-8">
          <div className="mx-auto max-w-7xl px-6 text-center text-sm text-[#64748b]">
            Nucleus Connect — AI-powered matching for Utah's innovation ecosystem.
            {" "}<span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-xs font-medium">Hackathon Demo</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
