import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Book shop',
  description: 'Books',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} dark:text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-black bg-stone-100`}
      >
        <div>{children}</div>
      </body>
    </html>
  );
}
