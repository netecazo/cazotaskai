import type { Metadata } from 'next';
import './globals.css';


const title = 'CazoTask — The 5-Hour AI Workweek Toolkit';
const description =
  'CazoTask gives you 40+ ready-to-run AI automations for the admin work that eats your week. Connect your tools, switch one on, get the hours back.';

export const metadata: Metadata = {
  title,
  description,
  applicationName: 'CazoTask',
  openGraph: {
    type: 'website',
    siteName: 'CazoTask',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
