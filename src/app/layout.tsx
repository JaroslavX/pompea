import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import RightMenu from '../components/RightMenu';
import Image from 'next/image';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Помпейська дев’ятниця',
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
    <html lang="ua">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen`}>
        <div className="max-w-[1200px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <header className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex justify-center items-center transition-transform hover:scale-[1.01] duration-300">
            <Link href="/">
              <Image 
                src="/img/logo32.jpg" 
                alt="Помпейська дев'ятниця Logo" 
                width={800} 
                height={350} 
                priority 
                className="w-auto h-auto max-h-[350px]"
              />
            </Link>
          </header>

          <main className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
            {children}
          </main>

          <aside className="lg:col-span-1">
            <RightMenu />
          </aside>
          
        </div>
      </body>
    </html>
  );
}
