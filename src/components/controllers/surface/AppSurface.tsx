'use client';

import { Box } from '@mantine/core';
import { AppSurfaceProps, resolveSurfaceStyle } from './init/surface.init';

/**
 * AppSurface
 *
 * The single frosted-glass container of the design system. Every card, panel and
 * nested block should be an AppSurface so glass, radius and elevation stay consistent.
 * Stateless presentational primitive: init/ (style resolution) + root only.
 */
export function AppSurface({ children, padding = 'lg', interactive, className, style, onClick, ...rest }: AppSurfaceProps) {
  const classes = [interactive ? 'app-glass-interactive' : undefined, className].filter(Boolean).join(' ');

  return (
    <Box
      p={padding}
      className={classes || undefined}
      onClick={onClick}
      style={{
        position: 'relative',
        color: 'var(--app-text-primary)',
        cursor: onClick ? 'pointer' : undefined,
        ...resolveSurfaceStyle(rest),
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
