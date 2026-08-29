'use client';

import { useEffect, useState } from 'react';

// Zeigt das Startup-Foto aus /assets; solange keins da ist,
// erscheint ein gestalteter Hinweis statt eines kaputten Bildes.
// Das Bild wird erst nach dem Mount geprüft, damit ein fehlendes Foto
// nie als kaputtes Bild-Icon aufblitzt.
export function StartupPhoto({ caption, missingHint }: { caption: string; missingHint: string }) {
  const [state, setState] = useState<'pending' | 'ok' | 'missing'>('pending');

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setState('ok');
    probe.onerror = () => setState('missing');
    probe.src = '/assets/startup.jpg';
  }, []);

  return (
    <figure className="photo-frame" style={{ margin: 0 }}>
      {state === 'ok' ? (
        <img src="/assets/startup.jpg" alt={caption} />
      ) : (
        <div className="photo-frame__missing">{state === 'missing' ? missingHint : ''}</div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
