'use client';

import { useEffect, useState } from 'react';
import { AppAmbientInitialProps } from './init/ambient.init';
import { AmbientContext, createAmbientStore } from './store/ambient.store';
import { AmbientField } from './ui/AmbientField';

/**
 * AppAmbient
 *
 * Living background: logo-orange liquid blobs that morph and drift behind
 * the frosted-glass surfaces. Mount once per screen (layout or login).
 */
export function AppAmbient(props: AppAmbientInitialProps) {
  const [store] = useState(() => createAmbientStore(props));

  useEffect(() => {
    store.getState().updateProps(props);
  }, [store, props.variant, props.intensity]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AmbientContext.Provider value={store}>
      <AmbientField />
    </AmbientContext.Provider>
  );
}
