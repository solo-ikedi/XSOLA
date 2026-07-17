// ─────────────────────────────────────────────────────
//  useStatus — Custom Hook
//  Polls /status every 10 seconds automatically.
//  Use this in Dashboard instead of writing fetch logic yourself.
//
//  Usage:
//    const { status, loading, error, refresh } = useStatus('1');
// ─────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { powerAPI } from './api';

export function useStatus(shopId) {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const refresh = useCallback(async () => {
    try {
      const data = await powerAPI.getStatus(shopId);
      setStatus(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    refresh(); // fetch immediately on mount

    // poll every 10 seconds to stay in sync with hardware
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval); // cleanup on unmount
  }, [refresh]);

  return { status, loading, error, refresh };
}