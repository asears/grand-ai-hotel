import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Chat - Next.js 15 + Vercel AI SDK',
  description: 'Production-ready streaming AI chat application',
  keywords: ['AI', 'chat', 'Next.js', 'Vercel', 'Claude', 'GPT-4'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
