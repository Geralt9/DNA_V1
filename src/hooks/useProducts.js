import { useCallback, useEffect, useState } from 'react';
import { productsService } from '../services/productsService.js';

/**
 * Generic async loader with loading / error / retry and abort-on-unmount.
 * `deps` decide when to refetch; `load` receives an AbortSignal.
 */
function useAsync(load, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    load(ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error?.name === 'AbortError') return;
        setState((s) => ({ ...s, loading: false, error }));
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}

/** @param {{category?:string, garment?:string, featured?:boolean}} [filters] */
export function useProducts(filters = {}) {
  const { category, garment, featured } = filters;
  const { data, loading, error, retry } = useAsync(
    (signal) => productsService.getAll({ category, garment, featured }, { signal }),
    [category, garment, featured],
  );
  return { products: data ?? [], loading, error, retry };
}

export function useProduct(id) {
  const { data, loading, error, retry } = useAsync((signal) => productsService.getById(id, { signal }), [id]);
  return { product: data, loading, error, retry };
}
