import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ClientToaster from '@/components/UI/ClientToaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hattab Auto - Car Parts Import Company',
  description: 'Your trusted partner for importing high-quality car parts. We specialize in sourcing authentic automotive components from around the world.',
  keywords: 'car parts, automotive, import, auto parts, vehicle components',
  authors: [{ name: 'Hattab Auto' }],
  openGraph: {
    title: 'Hattab Auto - Car Parts Import Company',
    description: 'Your trusted partner for importing high-quality car parts.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <ClientToaster />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
} 