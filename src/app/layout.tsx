import type { Metadata } from 'next';
import { ColorSchemeScript, DirectionProvider, MantineProvider } from '@mantine/core';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { baseTheme } from '@/src/theme';
import { QueryProvider } from '@/src/core/api';
import './globals.css';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'منصة إدارة المعاهد والمؤسسات التعليمية SaaS',
  description: 'لوحة التحكم الإدارية الذكية للمؤسسات التعليمية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body dir="rtl" className={ibmPlexArabic.className}>
        <DirectionProvider initialDirection="rtl">
          <MantineProvider theme={baseTheme} defaultColorScheme="light">
            <QueryProvider>
              {children}
            </QueryProvider>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
