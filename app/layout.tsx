/**
 * Root Layout
 * Sets up metadata, theme, and global providers
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Stream Theater - Cinematic Livestream Viewer',
    template: '%s | Stream Theater',
  },
  description:
    'Premium, distraction-free livestream viewing experience for Twitch and YouTube. Theater-style layout with optional chat, keyboard shortcuts, and responsive design.',
  keywords: [
    'twitch',
    'youtube',
    'livestream',
    'theater',
    'viewer',
    'chat',
    'streaming',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stream-theater.vercel.app',
    siteName: 'Stream Theater',
    title: 'Stream Theater - Cinematic Livestream Viewer',
    description:
      'Premium, distraction-free livestream viewing experience for Twitch and YouTube',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stream Theater',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stream Theater - Cinematic Livestream Viewer',
    description:
      'Premium, distraction-free livestream viewing experience for Twitch and YouTube',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent layout shift */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
