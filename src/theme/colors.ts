import { MantineColorsTuple } from '@mantine/core';

/**
 * Default SaaS Platform Primary Color: Elegant Deep Indigo
 * 10-shade scale calibrated for high contrast and modern SaaS dashboards.
 */
export const defaultPrimaryColor: MantineColorsTuple = [
  '#eef2ff',
  '#e0e7ff',
  '#c7d2fe',
  '#a5b4fc',
  '#818cf8',
  '#6366f1',
  '#4f46e5', // Primary shade (index 6)
  '#4338ca',
  '#3730a3',
  '#312e81',
];

/**
 * Secondary Accent Color: Vibrant Teal
 */
export const defaultSecondaryColor: MantineColorsTuple = [
  '#f0fdfa',
  '#ccfbf1',
  '#99f6e4',
  '#5eead4',
  '#2dd4bf',
  '#14b8a6',
  '#0d9488', // Accent shade (index 6)
  '#0f766e',
  '#115e59',
  '#134e4a',
];

/**
 * Neutral Slate Surface Scale for refined light & dark backgrounds
 */
export const slateNeutral: MantineColorsTuple = [
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
];

/**
 * Multi-Tenant White-Labeling Branding Configuration Interface.
 * Institutes can customize primary, secondary colors and logos.
 */
export interface InstituteBrandConfig {
  name: string;
  logoUrl?: string;
  primaryColor?: string; // hex or color key
  primaryShades?: MantineColorsTuple;
  secondaryColor?: string;
}
