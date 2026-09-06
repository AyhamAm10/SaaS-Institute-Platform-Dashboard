/**
 * System-wide user roles.
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  INSTITUTE_ADMIN = 'INSTITUTE_ADMIN',
  TEACHER = 'TEACHER',
  FAMILY = 'FAMILY',
  STUDENT = 'STUDENT',
}

/**
 * Basic sanitized user record returned from auth endpoints.
 */
export interface SafeUser {
  id: number;
  instituteId: number;
  fullName: string;
  phone: string;
  role: UserRole | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Institute details associated with a user profile.
 */
export interface InstituteInfo {
  id: number;
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  phone?: string | null;
  address?: string | null;
}

/**
 * Full user profile with institute details (from GET /auth/me).
 */
export interface UserProfile extends SafeUser {
  institute: InstituteInfo;
}

/**
 * Login payload credentials.
 */
export interface LoginCredentials {
  phone: string;
  password: string;
}

/**
 * Response from POST /auth/login for Web client (tokens delivered via HttpOnly cookies).
 */
export interface WebAuthResponse {
  user: SafeUser;
}

/**
 * Response from POST /auth/refresh for Web client.
 */
export interface RefreshResponse {
  message: string;
}

/**
 * Standard API error response shape.
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
