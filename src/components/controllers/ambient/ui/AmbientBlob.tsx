'use client';

import { useId } from 'react';
import { Box, rem } from '@mantine/core';
import { motion, useReducedMotion } from 'framer-motion';
import { AmbientBlobConfig, getBlobShapeCycle } from '../init/ambient.init';

export interface AmbientBlobProps {
  blob: AmbientBlobConfig;
}

/**
 * A single liquid blob: the outline morphs continuously (path interpolation)
 * while the whole shape drifts and rotates slowly. Animations run on rAF,
 * so browsers pause them automatically in background tabs.
 */
export function AmbientBlob({ blob }: AmbientBlobProps) {
  const gradientId = useId();
  const reduceMotion = useReducedMotion();
  const shapes = getBlobShapeCycle(blob.phase);

  return (
    <Box
      component={motion.div}
      initial={false}
      animate={
        reduceMotion
          ? undefined
          : {
              x: [0, blob.drift.x],
              y: [0, blob.drift.y],
              rotate: [0, blob.drift.rotate],
              scale: [1, blob.drift.scale ?? 1],
            }
      }
      transition={{ duration: blob.driftDuration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        top: blob.top,
        bottom: blob.bottom,
        left: blob.left,
        right: blob.right,
        width: rem(blob.size),
        height: rem(blob.size),
        opacity: `calc(var(--app-blob-opacity) * ${blob.opacity})`,
        filter: 'blur(34px)',
        willChange: 'transform',
      }}
    >
      <motion.svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id={gradientId} cx="40%" cy="35%" r="70%">
            <stop offset="0%" style={{ stopColor: 'var(--app-blob-start)' }} />
            <stop offset="60%" style={{ stopColor: 'var(--app-blob-mid)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--app-blob-end)' }} />
          </radialGradient>
        </defs>
        <motion.path
          fill={`url(#${gradientId})`}
          initial={{ d: shapes[0] }}
          animate={reduceMotion ? undefined : { d: shapes }}
          transition={{ duration: blob.morphDuration, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    </Box>
  );
}
