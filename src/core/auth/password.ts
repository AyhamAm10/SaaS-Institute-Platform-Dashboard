/** Minimum password length across user accounts (staff, teachers). */
export const USER_PASSWORD_MIN = 8;

/** Same as USER_PASSWORD_MIN for backwards compatibility with staff utils. */
export const STAFF_PASSWORD_MIN = USER_PASSWORD_MIN;

/**
 * Validates a password in Arabic.
 * Returns an Arabic error message string, or null when valid.
 */
export function passwordError(password: string): string | null {
  if (!password) return 'كلمة المرور مطلوبة';
  if (password.length < USER_PASSWORD_MIN) return `كلمة المرور ${USER_PASSWORD_MIN} محارف على الأقل`;
  return null;
}

