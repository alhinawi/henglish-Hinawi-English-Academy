import { useEffect, useRef, useState } from 'react';

export function useOwnedClipboard(scope: string) {
  const version = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const invalidate = () => {
    version.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    setCopiedKey(null);
    setCopyFailed(false);
  };
  useEffect(() => { invalidate(); return invalidate; }, [scope]);
  const copy = async (text: string, key = 'text') => {
    invalidate();
    if (!text.trim()) return false;
    const request = version.current;
    try {
      await navigator.clipboard.writeText(text);
      if (request !== version.current) return false;
      setCopiedKey(key);
      timer.current = setTimeout(() => {
        if (request === version.current) setCopiedKey(null);
      }, 2000);
      return true;
    } catch {
      if (request === version.current) setCopyFailed(true);
      return false;
    }
  };
  return { copy, copiedKey, copyFailed };
}
