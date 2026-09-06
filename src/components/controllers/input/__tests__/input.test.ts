import { describe, it } from 'node:test';
import assert from 'node:assert';
import { resolveInputConfig } from '../init/input.init';
import { createInputStore } from '../store/input.store';

describe('InputController (AppInput) — Architecture & State Isolation', () => {
  describe('Input Initialization & Directional Intelligence (init)', () => {
    it('defaults to RTL direction for standard text and textarea', () => {
      const textConfig = resolveInputConfig({ type: 'text' });
      assert.strictEqual(textConfig.direction, 'rtl');
      assert.strictEqual(textConfig.textAlign, 'right');

      const textareaConfig = resolveInputConfig({ type: 'textarea' });
      assert.strictEqual(textareaConfig.direction, 'rtl');
      assert.strictEqual(textareaConfig.textAlign, 'right');
    });

    it('automatically applies LTR direction for phone, email, password, number, and url', () => {
      const telConfig = resolveInputConfig({ type: 'tel' });
      assert.strictEqual(telConfig.direction, 'ltr');
      assert.strictEqual(telConfig.textAlign, 'left');

      const emailConfig = resolveInputConfig({ type: 'email' });
      assert.strictEqual(emailConfig.direction, 'ltr');
      assert.strictEqual(emailConfig.textAlign, 'left');

      const pwdConfig = resolveInputConfig({ type: 'password' });
      assert.strictEqual(pwdConfig.direction, 'ltr');
      assert.strictEqual(pwdConfig.textAlign, 'left');

      const numConfig = resolveInputConfig({ type: 'number' });
      assert.strictEqual(numConfig.direction, 'ltr');
      assert.strictEqual(numConfig.textAlign, 'left');

      const urlConfig = resolveInputConfig({ type: 'url' });
      assert.strictEqual(urlConfig.direction, 'ltr');
      assert.strictEqual(urlConfig.textAlign, 'left');
    });

    it('applies default size "md" and rounded rectangle radius "md" adhering to Curved Organic UI', () => {
      const config = resolveInputConfig({});
      assert.strictEqual(config.size, 'md');
      assert.strictEqual(config.radius, 'md');
    });

    it('creates smart default icons for typed inputs when leftSection is omitted', () => {
      const searchConfig = resolveInputConfig({ type: 'search' });
      assert.ok(searchConfig.defaultLeftSection);

      const telConfig = resolveInputConfig({ type: 'tel' });
      assert.ok(telConfig.defaultLeftSection);

      const pwdConfig = resolveInputConfig({ type: 'password' });
      assert.ok(pwdConfig.defaultLeftSection);
    });

    it('preserves custom leftSection if provided by the consumer', () => {
      const customIcon = 'CUSTOM_ICON';
      const config = resolveInputConfig({ type: 'search', leftSection: customIcon });
      assert.strictEqual(config.defaultLeftSection, customIcon);
    });
  });

  describe('Per-Instance Zustand Store Isolation (store)', () => {
    it('guarantees complete state isolation between multiple input instances', () => {
      const storeA = createInputStore({ type: 'text', defaultValue: 'Instance A' });
      const storeB = createInputStore({ type: 'text', defaultValue: 'Instance B' });

      assert.strictEqual(storeA.getState().value, 'Instance A');
      assert.strictEqual(storeB.getState().value, 'Instance B');

      // Modifying Store A must never mutate Store B
      storeA.getState().setValue('Modified A');
      assert.strictEqual(storeA.getState().value, 'Modified A');
      assert.strictEqual(storeB.getState().value, 'Instance B');

      storeA.getState().setFocused(true);
      assert.strictEqual(storeA.getState().isFocused, true);
      assert.strictEqual(storeB.getState().isFocused, false);
    });

    it('manages password visibility state and toggle', () => {
      const store = createInputStore({ type: 'password' });
      assert.strictEqual(store.getState().isPasswordVisible, false);

      store.getState().togglePasswordVisibility();
      assert.strictEqual(store.getState().isPasswordVisible, true);

      store.getState().togglePasswordVisibility();
      assert.strictEqual(store.getState().isPasswordVisible, false);
    });

    it('updates internal state when external props change', () => {
      const store = createInputStore({ type: 'text', error: null });
      assert.strictEqual(store.getState().error, null);

      store.getState().updateProps({ type: 'text', error: 'حقل مطلوب' });
      assert.strictEqual(store.getState().error, 'حقل مطلوب');
    });
  });
});
