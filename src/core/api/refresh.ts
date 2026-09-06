import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

/**
 * Token Refresh Manager
 *
 * Handles automatic silent access token refresh, request retries,
 * concurrent request queuing, loop prevention, and graceful logout on failure.
 */
class TokenRefreshHandler {
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];
  private onAuthFailureCallback?: () => void;

  /**
   * Register a callback to be invoked when authentication definitively fails
   * (e.g. to clear query cache and redirect to login).
   */
  public setOnAuthFailure(callback: () => void): void {
    this.onAuthFailureCallback = callback;
  }

  private processQueue(error: Error | null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });

    this.failedQueue = [];
  }

  /**
   * Determine whether a request error is an eligible 401 candidate for refresh.
   */
  public isAuthError(error: AxiosError): boolean {
    if (!error.response || error.response.status !== 401) {
      return false;
    }

    const config = error.config as ExtendedAxiosRequestConfig | undefined;
    if (!config) return false;

    // Prevent loop: already retried
    if (config._retry) return false;

    // Ignore auth endpoints itself to avoid infinite recursion
    const url = config.url ?? '';
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
      return false;
    }

    // Do NOT trigger silent refresh if user is already on the login page
    if (
      typeof window !== 'undefined' &&
      window.location?.pathname?.startsWith('/login')
    ) {
      return false;
    }

    return true;
  }

  /**
   * Handle 401 response: initiates refresh or queues request.
   */
  public async handle401(
    error: AxiosError,
    client: AxiosInstance,
    refreshFn: () => Promise<unknown>,
  ): Promise<unknown> {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (this.isRefreshing) {
      // Refresh is already in flight: queue this request until refresh settles
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      })
        .then(() => {
          originalRequest._retry = true;
          return client(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      // Trigger refresh call (cookies are rotated by backend)
      await refreshFn();

      // Drain queue successfully
      this.processQueue(null);

      // Retry original request
      return client(originalRequest);
    } catch (refreshError) {
      // Refresh failed — clear queue and notify failure
      const finalError =
        refreshError instanceof Error
          ? refreshError
          : new Error('Failed to refresh authentication token');

      this.processQueue(finalError);

      if (this.onAuthFailureCallback) {
        this.onAuthFailureCallback();
      } else if (
        typeof window !== 'undefined' &&
        !window.location?.pathname?.startsWith('/login')
      ) {
        window.location.replace('/login');
      }

      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const tokenRefreshHandler = new TokenRefreshHandler();
