/**
 * useAsync Hook
 * 
 * Generic hook for handling async operations
 */

import { useState, useCallback } from 'react';
import type { AsyncState } from '../types';

type UseAsyncReturn<T> = AsyncState<T> & {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
};

/**
 * Generic hook for async operations
 */
export const useAsync = <T,>(
  asyncFunction: (...args: unknown[]) => Promise<T>
): UseAsyncReturn<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState({ data: null, status: 'loading', error: null });

      try {
        const data = await asyncFunction(...args);
        setState({ data, status: 'success', error: null });
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState({ data: null, status: 'error', error: errorMessage });
        return null;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, status: 'idle', error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
