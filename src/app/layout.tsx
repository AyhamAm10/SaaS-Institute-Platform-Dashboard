import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Readex_Pro } from 'next/font/google';
import { baseTheme } from '@/src/theme';
import './globals.css';

const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-readex-pro',
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
    <html lang="ar" dir="rtl" className={readexPro.variable} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body dir="rtl" className={readexPro.className}>
        <MantineProvider theme={baseTheme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
