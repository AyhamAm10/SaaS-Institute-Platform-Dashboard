import type { CSSVariablesResolver } from '@mantine/core';
import { darkTokens, lightTokens, sharedTokens, tokenVar } from './tokens';

function toCssVariables(tokens: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(tokens).map(([key, value]) => [tokenVar(key), value]));
}

/**
 * Emits every semantic token as a `--app-*` CSS variable for both color schemes,
 * plus the Mantine variable overrides that keep primary actions on-brand in dark mode
 * (ink buttons would disappear on a near-black canvas, so they switch to logo orange).
 */
export const appCssVariablesResolver: CSSVariablesResolver = () => ({
  variables: toCssVariables(sharedTokens),
  light: toCssVariables({ ...lightTokens }),
  dark: {
    ...toCssVariables({ ...darkTokens }),
    '--mantine-color-primary-filled': darkTokens.buttonBg,
    '--mantine-color-primary-filled-hover': darkTokens.buttonHover,
    '--mantine-color-primary-light': darkTokens.brandAccentSoft,
    '--mantine-color-primary-light-hover': darkTokens.badgeBg,
    '--mantine-color-primary-light-color': darkTokens.brandAccentText,
    '--mantine-color-primary-outline': darkTokens.textPrimary,
    '--mantine-color-body': darkTokens.bg,
  },
});
