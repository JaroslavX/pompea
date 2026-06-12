import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import RightMenu from '../components/RightMenu';
import Image from 'next/image';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Помпейська дев'ятниця",
  description: 'Помпейська дев\'ятниця, вервиця, свідчення та молитви',
  icons: {
    icon: '/img/favicon128.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ua" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen`} suppressHydrationWarning>
        <div className="max-w-[1200px] mx-auto px-4 pt-6 pb-10 grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Full-bleed header banner — no card boxing */}
          <header className="lg:col-span-4 overflow-hidden rounded-2xl shadow-md">
            <Link href="/" className="block">
              <Image
                src="/img/logo32.jpg"
                alt="Помпейська дев'ятниця Logo"
                width={1200}
                height={400}
                priority
                className="w-full h-auto"
              />
            </Link>
          </header>

          {/* Main content — warm white with green border accent */}
          <main className="lg:col-span-3 rounded-xl shadow-sm border border-[#d1e8da] p-8 min-h-[500px] min-w-0 overflow-hidden" style={{ background: '#fffffe' }}>
            {children}
          </main>

          <aside className="lg:col-span-1 lg:self-start lg:sticky lg:top-6">
            <RightMenu />
          </aside>

        </div>

        {/* Copyright footer */}
        <footer className="max-w-[1200px] mx-auto px-4 pb-6 text-center text-sm" style={{ color: '#6b8f7a' }}>
          © {new Date().getFullYear()}{' '} Помпейська дев&apos;ятниця. Всі права захищені.
        </footer>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
