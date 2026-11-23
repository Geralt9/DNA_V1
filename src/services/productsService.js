import { api, ApiError } from './api.js';
import { USE_MOCKS } from './config.js';
import { products as seed } from '../mocks/products.js';
import { delay, clone } from '../mocks/delay.js';

// In-memory mock "table" so create/update/remove behave during development.
let table = clone(seed);

function matches(product, { category, garment, featured } = {}) {
  if (category && category !== 'all' && product.category !== category) return false;
  if (garment && garment !== 'all' && product.garment !== garment) return false;
  if (featured !== undefined && product.featured !== featured) return false;
  return true;
}

function toQuery(params = {}) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== 'all') q.set(k, v);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const productsService = {
  /** @param {{category?:string, garment?:string, featured?:boolean}} [filters] */
  async getAll(filters = {}, { signal } = {}) {
    if (USE_MOCKS) {
      await delay(380, signal);
      return clone(table.filter((p) => matches(p, filters)));
    }
    // TODO(backend): GET /products?category=&garment=&featured= → Product[]
    return api.get(`/products${toQuery(filters)}`, { signal, auth: false });
  },

  async getById(id, { signal } = {}) {
    if (USE_MOCKS) {
      await delay(260, signal);
      const found = table.find((p) => p.id === id);
      if (!found) throw new ApiError('We couldn’t find that design.', { status: 404, code: 'NOT_FOUND' });
      return clone(found);
    }
    // TODO(backend): GET /products/:id → Product (404 when missing)
    return api.get(`/products/${encodeURIComponent(id)}`, { signal, auth: false });
  },

  async create(data) {
    if (USE_MOCKS) {
      await delay();
      const product = { featured: false, year: null, ...data, id: data.id || `p_${Date.now().toString(36)}` };
      table = [...table, product];
      return clone(product);
    }
    // TODO(backend): POST /products (admin, auth header) → Product
    return api.post('/products', data);
  },

  async update(id, patch) {
    if (USE_MOCKS) {
      await delay();
      const i = table.findIndex((p) => p.id === id);
      if (i === -1) throw new ApiError('We couldn’t find that design.', { status: 404, code: 'NOT_FOUND' });
      table = table.map((p) => (p.id === id ? { ...p, ...patch, id } : p));
      return clone(table[i]);
    }
    // TODO(backend): PUT /products/:id (admin) → Product
    return api.put(`/products/${encodeURIComponent(id)}`, patch);
  },

  async remove(id) {
    if (USE_MOCKS) {
      await delay();
      table = table.filter((p) => p.id !== id);
      return null;
    }
    // TODO(backend): DELETE /products/:id (admin) → 204
    return api.delete(`/products/${encodeURIComponent(id)}`);
  },
};
