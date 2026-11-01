export type AmbientVariant = 'dashboard' | 'login';
export type AmbientIntensity = 'soft' | 'normal' | 'vivid';

export interface AppAmbientInitialProps {
  variant?: AmbientVariant;
  intensity?: AmbientIntensity;
}

/** One liquid blob: where it sits, how big it is, and how it drifts. */
export interface AmbientBlobConfig {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  opacity: number;
  morphDuration: number;
  driftDuration: number;
  drift: { x: number; y: number; rotate: number; scale?: number };
  /** Index offset into the shared shape cycle so blobs never morph in sync. */
  phase: number;
}

export interface ResolvedAmbientConfig {
  variant: AmbientVariant;
  blobs: AmbientBlobConfig[];
}

/**
 * Closed blob outlines in a 200x200 box. Every path uses the same command structure
 * (M + 4 cubic segments + Z) so they interpolate smoothly into one another,
 * like a water balloon rolling and reshaping.
 */
export const AMBIENT_BLOB_SHAPES = [
  'M100,20 C145,20 180,55 180,100 C180,145 145,180 100,180 C55,180 20,145 20,100 C20,55 55,20 100,20 Z',
  'M100,30 C150,10 190,60 175,105 C160,155 130,185 90,175 C45,165 10,135 25,90 C38,50 60,42 100,30 Z',
  'M105,15 C140,30 170,40 182,92 C192,140 150,170 110,185 C65,198 30,160 22,115 C15,70 60,5 105,15 Z',
  'M95,25 C135,15 185,45 170,95 C158,140 165,175 105,178 C55,180 30,150 28,105 C26,60 55,32 95,25 Z',
] as const;

const INTENSITY_SCALE: Record<AmbientIntensity, number> = {
  soft: 0.7,
  normal: 1,
  vivid: 1.25,
};

const DASHBOARD_BLOBS: AmbientBlobConfig[] = [
  { top: '-140px', right: '16%', size: 540, opacity: 1, morphDuration: 14, driftDuration: 26, drift: { x: -120, y: 90, rotate: 40 }, phase: 0 },
  { bottom: '-160px', left: '6%', size: 460, opacity: 0.82, morphDuration: 18, driftDuration: 30, drift: { x: 140, y: -110, rotate: -35 }, phase: 2 },
  { top: '42%', right: '50%', size: 300, opacity: 0.64, morphDuration: 11, driftDuration: 22, drift: { x: -90, y: -70, rotate: 60, scale: 1.15 }, phase: 3 },
];

const LOGIN_BLOBS: AmbientBlobConfig[] = [
  { top: '-120px', left: '-80px', size: 560, opacity: 1, morphDuration: 13, driftDuration: 24, drift: { x: 120, y: 80, rotate: 30 }, phase: 1 },
  { bottom: '-180px', right: '-60px', size: 620, opacity: 0.85, morphDuration: 17, driftDuration: 28, drift: { x: -110, y: -90, rotate: -40 }, phase: 3 },
];

export function resolveAmbientConfig(props: AppAmbientInitialProps): ResolvedAmbientConfig {
  const variant = props.variant ?? 'dashboard';
  const scale = INTENSITY_SCALE[props.intensity ?? 'normal'];
  const source = variant === 'login' ? LOGIN_BLOBS : DASHBOARD_BLOBS;

  return {
    variant,
    blobs: source.map((blob) => ({ ...blob, opacity: Math.min(1, blob.opacity * scale) })),
  };
}

/** Rotates the shape cycle so each blob starts from a different outline and loops back. */
export function getBlobShapeCycle(phase: number): string[] {
  const shapes = [...AMBIENT_BLOB_SHAPES];
  const rotated = [...shapes.slice(phase % shapes.length), ...shapes.slice(0, phase % shapes.length)];
  return [...rotated, rotated[0]];
}
