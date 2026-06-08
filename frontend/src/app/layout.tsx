import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Saathi Bank of India | Internet Banking',
  description: 'Secure online banking for accounts, payments, cards, statements, and support.',
  icons: {
    icon: '/logo.png',
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
