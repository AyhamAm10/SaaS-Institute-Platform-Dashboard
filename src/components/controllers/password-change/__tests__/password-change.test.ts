import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PASSWORD, passwordChangeLabels, validatePasswordChange } from '../init/password-change.init';

test('the forced change asks for the current password first', () => {
  assert.equal(validatePasswordChange('', 'new-password-1', 'new-password-1'), passwordChangeLabels.currentRequired);
});

test('a short new password is refused', () => {
  assert.ok(validatePasswordChange(DEFAULT_PASSWORD, 'short', 'short'));
});

test('the default password cannot be chosen again', () => {
  assert.equal(validatePasswordChange(DEFAULT_PASSWORD, DEFAULT_PASSWORD, DEFAULT_PASSWORD), passwordChangeLabels.sameAsDefault);
});

test('the confirmation must match', () => {
  assert.equal(validatePasswordChange(DEFAULT_PASSWORD, 'new-password-1', 'new-password-2'), passwordChangeLabels.mismatch);
});

test('a valid change passes', () => {
  assert.equal(validatePasswordChange(DEFAULT_PASSWORD, 'new-password-1', 'new-password-1'), null);
});
