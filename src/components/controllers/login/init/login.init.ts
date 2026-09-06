import { LoginInitialProps } from '../state/login.state';

/**
 * Derives initial Login controller props from URL search parameters or server props.
 * Strictly adheres to the init layer responsibility: non-API runtime bootstrap & parameters.
 */
export function resolveLoginInitialProps(
  searchParams?: Record<string, string | string[] | undefined>,
): LoginInitialProps {
  const errorParam = searchParams?.['error'];
  if (errorParam === 'unauthorized_role') {
    return {
      initialError:
        'عذراً، هذا الحساب غير مصرح له بالدخول كمسؤول للنظام. يرجى استخدام حساب إداري.',
    };
  }
  return {};
}
