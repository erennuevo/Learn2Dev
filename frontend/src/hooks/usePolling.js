import { useEffect, useRef, useCallback } from 'react';

export default function usePolling(fetchFn, intervalMs, active = true) {
    const savedFn = useRef(fetchFn);

    useEffect(() => {
        savedFn.current = fetchFn;
    }, [fetchFn]);

    useEffect(() => {
        if (!active) return;

        const poll = () => savedFn.current();

        // Initial fetch
        poll();

        const intervalId = setInterval(poll, intervalMs);

        return () => clearInterval(intervalId);
    }, [intervalMs, active]);
}