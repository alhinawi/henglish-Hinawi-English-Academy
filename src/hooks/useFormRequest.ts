import { useEffect, useRef } from 'react';

// A form result and its delayed redirect belong to the visit that submitted it.
export function useFormRequest() {
  const version = useRef(0);
  const redirect = useRef<ReturnType<typeof setTimeout> | null>(null);
  const invalidate = () => {
    version.current += 1;
    if (redirect.current !== null) clearTimeout(redirect.current);
    redirect.current = null;
  };
  useEffect(() => invalidate, []);
  const beginRequest = () => {
    invalidate();
    const request = version.current;
    return () => request === version.current;
  };
  const redirectAfter = (isCurrent: () => boolean, callback: () => void) => {
    if (!isCurrent()) return;
    if (redirect.current !== null) clearTimeout(redirect.current);
    redirect.current = setTimeout(() => {
      redirect.current = null;
      if (isCurrent()) callback();
    }, 1500);
  };
  return { beginRequest, redirectAfter };
}
