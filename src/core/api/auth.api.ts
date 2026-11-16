import { apiClient } from './client';
import {
  ChangePasswordPayload,
  LoginCredentials,
  RefreshResponse,
  UserProfile,
  WebAuthResponse,
} from './types';

/**
 * Authentication API Service
 *
 * Encapsulates backend HTTP calls for the authentication domain.
 */
export const authApi = {
  /**
   * Log in user with phone and password.
   * Web client receives user object in JSON and HttpOnly auth cookies in headers.
   */
  async login(credentials: LoginCredentials): Promise<WebAuthResponse> {
    const response = await apiClient.post<WebAuthResponse>(
      '/auth/login',
      credentials,
    );
    return response.data;
  },

  /**
   * Log out user from all sessions.
   * Clears database refresh token and clears HttpOnly cookies.
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * Fetch current authenticated user's profile with institute details.
   */
  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/me');
    return response.data;
  },

  /**
   * The user picks a new password (forced after a new or reset account).
   * The server rotates the cookies, so the session continues.
   */
  async changePassword(payload: ChangePasswordPayload): Promise<WebAuthResponse> {
    const response = await apiClient.post<WebAuthResponse>('/auth/change-password', payload);
    return response.data;
  },

  /**
   * Manually trigger token refresh if needed.
   */
  async refresh(): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', {});
    return response.data;
  },
};
