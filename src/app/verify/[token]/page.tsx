import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'التحقق من مستند',
  robots: { index: false, follow: false },
};

/** VerifyPage — public Server Component entry point (role.md §9). */
export default function VerifyPage() {
  return <RenderUi />;
}
