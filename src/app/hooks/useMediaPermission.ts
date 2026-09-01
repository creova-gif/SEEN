import { useCallback, useRef, useState } from 'react';

export type MediaPermissionKind = 'microphone' | 'camera' | 'camera-microphone';
export type MediaPermissionStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

interface UseMediaPermissionResult {
  status: MediaPermissionStatus;
  /** Human-readable reason for the last failure, derived from the real DOMException. */
  error: string | null;
  /** The live MediaStream once granted. Remember to call `release()` when done with it. */
  stream: MediaStream | null;
  /** Calls the real `navigator.mediaDevices.getUserMedia`. Use this both for the
   *  initial request and as the "retry" callback after a denial. */
  requestAccess: () => Promise<MediaStream | null>;
  /** Stops all tracks on the current stream. Call this on unmount / when recording ends. */
  release: () => void;
}

function constraintsFor(kind: MediaPermissionKind): MediaStreamConstraints {
  switch (kind) {
    case 'microphone':
      return { audio: true };
    case 'camera':
      return { video: true };
    case 'camera-microphone':
      return { audio: true, video: true };
  }
}

/**
 * Real getUserMedia-backed permission hook — no fabricated states. `status`
 * only ever becomes 'denied' when the browser's own getUserMedia() promise
 * actually rejects with a permission error (NotAllowedError / SecurityError),
 * and 'unsupported' only when `navigator.mediaDevices.getUserMedia` does not
 * exist on this device/browser at all. There is no API to reopen the OS/browser
 * permission dialog programmatically from a web page, so the only honest retry
 * path is to call `requestAccess()` again (the browser may re-prompt, or the
 * viewer may need to flip the permission in their browser/device settings first
 * — the paired PermissionDeniedScreen component says this explicitly rather
 * than promising a working settings deep-link).
 *
 * Not currently wired into any screen — see PermissionDeniedScreen.tsx for the
 * intended call site (the "Record or upload" narration button in
 * MediaChaptersStep.tsx has no click handler today).
 */
export function useMediaPermission(kind: MediaPermissionKind = 'microphone'): UseMediaPermissionResult {
  const [status, setStatus] = useState<MediaPermissionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [, forceRender] = useState(0);

  const release = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    forceRender((n) => n + 1);
  }, []);

  const requestAccess = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported');
      setError('This browser does not support microphone/camera access.');
      return null;
    }

    setStatus('requesting');
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraintsFor(kind));
      streamRef.current = stream;
      setStatus('granted');
      forceRender((n) => n + 1);
      return stream;
    } catch (err) {
      const name = err instanceof DOMException ? err.name : '';
      const message =
        name === 'NotAllowedError' || name === 'SecurityError'
          ? 'Access was denied.'
          : name === 'NotFoundError'
            ? 'No compatible device was found.'
            : err instanceof Error
              ? err.message
              : 'Could not access the device.';
      setStatus('denied');
      setError(message);
      return null;
    }
  }, [kind]);

  return { status, error, stream: streamRef.current, requestAccess, release };
}
