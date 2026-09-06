import { Metadata } from 'next';
import { Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { RenderUi } from './render-ui';
import { resolveLoginInitialProps } from '@/src/components/controllers/login';

export const metadata: Metadata = {
  title: 'تسجيل الدخول — منصة إدارة المؤسسات التعليمية SaaS',
  description: 'بوابة تسجيل دخول مسؤولي ومشرفي المعاهد والمؤسسات التعليمية',
};

/**
 * Pure Server Component entry point for the /login route.
 *
 * Strictly adheres to the Server Component Rule (no 'use client').
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const initialProps = resolveLoginInitialProps(resolvedParams);

  return (
    <Suspense
      fallback={
        <Center h="100vh" bg="var(--mantine-color-body)">
          <Loader size="md" color="primary.6" />
        </Center>
      }
    >
      <RenderUi {...initialProps} />
    </Suspense>
  );
}
