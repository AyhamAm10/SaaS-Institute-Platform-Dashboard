'use client';

import { LoginController, LoginInitialProps } from '@/src/components/controllers/login';

/**
 * RenderUi for Login Page
 *
 * Client Component boundary orchestrating the LoginController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic.
 */
export function RenderUi(props: LoginInitialProps) {
  return <LoginController {...props} />;
}
