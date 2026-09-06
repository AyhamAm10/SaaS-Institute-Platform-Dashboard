import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { tokenRefreshHandler } from '../refresh';
import { isUserAdmin } from '../../auth/useAuth';
import { UserProfile, UserRole } from '../types';

describe('Auth Flow & Protection Architecture', () => {
  describe('isUserAdmin Role Authorization', () => {
    it('authorizes SUPER_ADMIN as admin', () => {
      const user: UserProfile = {
        id: 1,
        instituteId: 10,
        fullName: 'Super Admin',
        phone: '+966500000000',
        role: UserRole.SUPER_ADMIN,
        institute: { id: 10, name: 'Main Campus' },
      };
      assert.strictEqual(isUserAdmin(user), true);
    });

    it('authorizes INSTITUTE_ADMIN as admin', () => {
      const user: UserProfile = {
        id: 2,
        instituteId: 10,
        fullName: 'Institute Admin',
        phone: '+966511111111',
        role: UserRole.INSTITUTE_ADMIN,
        institute: { id: 10, name: 'Main Campus' },
      };
      assert.strictEqual(isUserAdmin(user), true);
    });

    it('denies TEACHER, STUDENT, and FAMILY from admin access', () => {
      const teacher: UserProfile = {
        id: 3,
        instituteId: 10,
        fullName: 'Teacher',
        phone: '+966522222222',
        role: UserRole.TEACHER,
        institute: { id: 10, name: 'Main Campus' },
      };
      const student: UserProfile = {
        id: 4,
        instituteId: 10,
        fullName: 'Student',
        phone: '+966533333333',
        role: UserRole.STUDENT,
        institute: { id: 10, name: 'Main Campus' },
      };
      assert.strictEqual(isUserAdmin(teacher), false);
      assert.strictEqual(isUserAdmin(student), false);
      assert.strictEqual(isUserAdmin(null), false);
      assert.strictEqual(isUserAdmin(undefined), false);
    });
  });

  describe('Token Refresh Handler & Automatic Retry', () => {
    let mockClient: any;
    let refreshCount = 0;
    let authFailureCalled = false;

    beforeEach(() => {
      refreshCount = 0;
      authFailureCalled = false;
      tokenRefreshHandler.setOnAuthFailure(() => {
        authFailureCalled = true;
      });

      mockClient = async (config: any) => {
        return { data: 'success', config };
      };
    });

    it('identifies 401 as eligible auth error, preventing infinite loops', () => {
      const eligible401: any = {
        response: { status: 401 },
        config: { url: '/api/institutes' },
      };
      assert.strictEqual(tokenRefreshHandler.isAuthError(eligible401), true);

      // Already retried should be rejected
      const alreadyRetried: any = {
        response: { status: 401 },
        config: { url: '/api/institutes', _retry: true },
      };
      assert.strictEqual(tokenRefreshHandler.isAuthError(alreadyRetried), false);

      // Login / Refresh itself should not trigger refresh
      const login401: any = {
        response: { status: 401 },
        config: { url: '/api/auth/login' },
      };
      const refresh401: any = {
        response: { status: 401 },
        config: { url: '/api/auth/refresh' },
      };
      assert.strictEqual(tokenRefreshHandler.isAuthError(login401), false);
      assert.strictEqual(tokenRefreshHandler.isAuthError(refresh401), false);

      // Non-401 error
      const error500: any = {
        response: { status: 500 },
        config: { url: '/api/institutes' },
      };
      assert.strictEqual(tokenRefreshHandler.isAuthError(error500), false);
    });

    it('triggers refresh and retries the original request exactly once', async () => {
      const mockRefresh = async () => {
        refreshCount++;
        return { message: 'Tokens refreshed' };
      };

      const error401: any = {
        response: { status: 401 },
        config: { url: '/api/institutes' },
      };

      const result: any = await tokenRefreshHandler.handle401(
        error401,
        mockClient,
        mockRefresh,
      );

      assert.strictEqual(refreshCount, 1);
      assert.strictEqual(result.data, 'success');
      assert.strictEqual(result.config._retry, true);
    });

    it('queues multiple concurrent 401 requests and executes only ONE refresh', async () => {
      let resolveRefresh: any;
      const delayedRefreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });

      const mockRefresh = async () => {
        refreshCount++;
        await delayedRefreshPromise;
        return { message: 'Tokens refreshed' };
      };

      const error1: any = {
        response: { status: 401 },
        config: { url: '/api/courses' },
      };
      const error2: any = {
        response: { status: 401 },
        config: { url: '/api/students' },
      };
      const error3: any = {
        response: { status: 401 },
        config: { url: '/api/grades' },
      };

      // Launch all 3 requests simultaneously
      const promise1 = tokenRefreshHandler.handle401(error1, mockClient, mockRefresh);
      const promise2 = tokenRefreshHandler.handle401(error2, mockClient, mockRefresh);
      const promise3 = tokenRefreshHandler.handle401(error3, mockClient, mockRefresh);

      // Only 1 refresh should have started
      assert.strictEqual(refreshCount, 1);

      // Release delayed refresh
      resolveRefresh();

      const [res1, res2, res3]: any = await Promise.all([promise1, promise2, promise3]);

      assert.strictEqual(refreshCount, 1, 'Only one refresh must be invoked for concurrent 401s');
      assert.strictEqual(res1.data, 'success');
      assert.strictEqual(res2.data, 'success');
      assert.strictEqual(res3.data, 'success');
      assert.strictEqual(res1.config._retry, true);
      assert.strictEqual(res2.config._retry, true);
      assert.strictEqual(res3.config._retry, true);
    });

    it('clears state and rejects queued requests when refresh fails', async () => {
      const failingRefresh = async () => {
        throw new Error('Refresh token revoked');
      };

      const error1: any = {
        response: { status: 401 },
        config: { url: '/api/dashboard' },
      };

      await assert.rejects(
        async () => {
          await tokenRefreshHandler.handle401(error1, mockClient, failingRefresh);
        },
        {
          message: 'Refresh token revoked',
        },
      );

      assert.strictEqual(authFailureCalled, true, 'Auth failure callback must be triggered on failed refresh');
    });
  });
});
