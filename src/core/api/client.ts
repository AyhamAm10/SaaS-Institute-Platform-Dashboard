import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { tokenRefreshHandler } from './refresh';
import { getActiveAcademicYearId, getActiveBranchId } from '../context/operational-context';

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

// Attach request interceptor for central operational dimension injection (X-Branch-Id, X-Academic-Year-Id)
apiClient.interceptors.request.use((config) => {
  const branchId = getActiveBranchId();
  const academicYearId = getActiveAcademicYearId();

  if (branchId !== null && branchId !== undefined) {
    if (typeof config.headers?.set === 'function') {
      config.headers.set('X-Branch-Id', String(branchId));
    } else if (config.headers) {
      config.headers['X-Branch-Id'] = String(branchId);
    }
  }

  if (academicYearId !== null && academicYearId !== undefined) {
    if (typeof config.headers?.set === 'function') {
      config.headers.set('X-Academic-Year-Id', String(academicYearId));
    } else if (config.headers) {
      config.headers['X-Academic-Year-Id'] = String(academicYearId);
    }
  }

  return config;
});

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
