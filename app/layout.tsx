import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f4fafe] text-[#1c1c1d] font-[family-name:var(--font-manrope)]">
        <header className="sticky top-0 z-50 border-b border-[#dce6f0] bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/nucleus-wordmark.png"
                alt="THE NUCLEUS INSTITUTE"
                width={140}
                height={32}
                className="h-7 w-auto"
                priority
              />
              <span className="text-sm font-semibold tracking-tight text-[#0048bd]">Connect</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-semibold">
              <Link href="/intake" className="text-[#1c1c1d]/70 hover:text-[#0048bd] transition-colors">Find Connections</Link>
              <Link href="/staff" className="text-[#1c1c1d]/70 hover:text-[#0048bd] transition-colors">Staff Dashboard</Link>
              <Link href="/graph" className="text-[#1c1c1d]/70 hover:text-[#0048bd] transition-colors">Opportunity Graph</Link>
              <Link href="/integrations" className="text-[#1c1c1d]/70 hover:text-[#0048bd] transition-colors">Integrations</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#dce6f0] bg-white py-8">
          <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-2">
            <Image
              src="/nucleus-wordmark.png"
              alt="THE NUCLEUS INSTITUTE"
              width={120}
              height={28}
              className="h-5 w-auto opacity-60"
            />
            <div className="text-center text-sm text-[#1c1c1d]/50">
              AI-powered matching for Utah's innovation ecosystem.
              {" "}<span className="rounded-full bg-[#f4fafe] px-2 py-0.5 text-xs font-medium">Hackathon Demo</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
