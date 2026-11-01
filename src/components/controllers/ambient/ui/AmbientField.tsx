'use client';

import { Box } from '@mantine/core';
import { useAmbientMirror } from '../store/useAmbientMirror';
import { AmbientBlob } from './AmbientBlob';

/** Fixed, non-interactive layer that renders every configured blob behind the glass UI. */
export function AmbientField() {
  const config = useAmbientMirror('config');

  return (
    <Box
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {config.blobs.map((blob, index) => (
        <AmbientBlob key={`${config.variant}-${index}`} blob={blob} />
      ))}
    </Box>
  );
}
