import type { Metadata } from 'next';
import { ColorSchemeScript, DirectionProvider } from '@mantine/core';
import { Alexandria } from 'next/font/google';
import { AppThemeProvider } from '@/src/theme/AppThemeProvider';
import { QueryProvider } from '@/src/core/api';
import './globals.css';

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-alexandria',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'معهد جيل السلام | لوحة التحكم',
  description: 'لوحة التحكم الإدارية لمعهد جيل السلام',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={alexandria.variable} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body dir="rtl" className={alexandria.className}>
        <DirectionProvider initialDirection="rtl">
          <AppThemeProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </AppThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
