import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { tokenRefreshHandler } from './refresh';

export const API_BASE_URL =
  process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3000/api';

/**
 * Standard configured Axios client for the Admin Dashboard.
 *
 * Configures:
 * - withCredentials: true (sends HttpOnly cookies)
 * - X-Client-Type: web (instructs backend dual delivery strategy)
 * - Automatic 401 interception and token refresh rotation
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Type': 'web',
    'Accept-Language': 'ar',
  },
  timeout: 15000,
});

/**
 * Perform silent token refresh request directly.
 */
async function performTokenRefresh(): Promise<AxiosResponse> {
  return axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'web',
        'Accept-Language': 'ar',
      },
    },
  );
}

// Attach response interceptor for 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (tokenRefreshHandler.isAuthError(error)) {
      return tokenRefreshHandler.handle401(
        error,
        apiClient,
        performTokenRefresh,
      );
    }
    return Promise.reject(error);
  },
);
