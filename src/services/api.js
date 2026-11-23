import { API_URL } from './config.js';

/**
 * Thin fetch wrapper: base URL, JSON in/out, auth header, one shared error shape.
 * Every service goes through `api` so the backend only has to be wired once.
 */

/* ── Token store ────────────────────────────────────────────────────
   The access token lives in memory; a copy goes to sessionStorage so a
   page refresh doesn't log the user out during mock development.
   TODO(backend): the Express API issues a 15-minute access token plus a
   RefreshToken cookie. Once /auth/refresh exists, drop sessionStorage and
   rehydrate by calling refreshSession() on boot instead. */
const TOKEN_KEY = 'dna-access-token';
let accessToken = readStoredToken();

function readStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getToken() {
  return accessToken;
}

export function setToken(token) {
  accessToken = token || null;
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable (private mode) — memory copy still works */
  }
}

/* ── Errors ────────────────────────────────────────────────────────── */
export class ApiError extends Error {
  /**
   * @param {string} message      Human-readable, safe to show in the UI
   * @param {object} [opts]
   * @param {number} [opts.status] HTTP status (0 = network failure)
   * @param {string} [opts.code]   Machine-readable code
   * @param {Record<string,string>} [opts.fieldErrors] Per-field messages keyed by request field name
   */
  constructor(message, { status = 0, code = 'UNKNOWN', fieldErrors = {}, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

const FRIENDLY = {
  0: "We couldn't reach the server. Check your connection and try again.",
  400: 'Some details need another look.',
  401: 'Please log in to continue.',
  403: "You don't have access to that.",
  404: "We couldn't find what you were looking for.",
  409: 'That already exists.',
  422: 'Some details need another look.',
  429: 'Too many attempts. Wait a moment and try again.',
  500: 'Something went wrong on our side. Try again in a moment.',
};

/**
 * Turns any backend error body into an ApiError. Handles the shapes the
 * Express + zod server is likely to send:
 *   { error: "Token Missing" }
 *   { message: "..." }
 *   { errors: [{ path: ["emailAddress"], message: "Invalid email" }] }   (zod issues)
 *   { fieldErrors: { emailAddress: "..." } }
 */
export function normalizeError(status, body) {
  const fieldErrors = {};
  const issues = Array.isArray(body?.errors) ? body.errors : Array.isArray(body?.issues) ? body.issues : null;
  if (issues) {
    for (const issue of issues) {
      const key = Array.isArray(issue.path) ? issue.path.join('.') : issue.path || issue.field;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
  }
  if (body?.fieldErrors && typeof body.fieldErrors === 'object') Object.assign(fieldErrors, body.fieldErrors);

  const raw = typeof body?.error === 'string' ? body.error : body?.message;
  const message = raw || FRIENDLY[status] || FRIENDLY[status >= 500 ? 500 : 400];
  return new ApiError(message, { status, code: body?.code || `HTTP_${status}`, fieldErrors });
}

/* ── Request ───────────────────────────────────────────────────────── */
async function request(path, { method = 'GET', body, headers, signal, auth = true } = {}) {
  const init = {
    method,
    signal,
    headers: { Accept: 'application/json', ...headers },
    // The API sets an httpOnly RefreshToken cookie; send it cross-origin.
    credentials: 'include',
  };
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  if (auth && accessToken) init.headers.Authorization = `Bearer ${accessToken}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, init);
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new ApiError(FRIENDLY[0], { status: 0, code: 'NETWORK', cause: err });
  }

  // TODO(backend): on 401/403 "Token Expired", call POST /auth/refresh once
  // (the RefreshToken cookie rides along), store the new access token with
  // setToken(), then retry this request. Until then the session just ends.
  if (res.status === 401) setToken(null);

  if (res.status === 204) return null;
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) throw normalizeError(res.status, isJson ? data : { message: undefined });
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
