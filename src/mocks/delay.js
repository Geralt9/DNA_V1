/** Simulated network latency so loading states are visible in mock mode. */
export function delay(ms = 450, signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms + Math.round(Math.random() * 250));
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/** Deep copy so callers can't mutate the mock "database". */
export const clone = (value) => structuredClone(value);
