import { api, ApiError, setToken, getToken } from './api.js';
import { USE_MOCKS } from './config.js';
import { delay } from '../mocks/delay.js';
import { mockUsers, publicUser, mockToken, userIdFromMockToken } from '../mocks/users.js';

/**
 * Field names match the backend's zod schema (Server/validators/auth.schema.js):
 *   signup: { fullName, emailAddress, password }
 *   login:  { emailAddress, password }
 * Every method resolves to { user, token } or throws ApiError.
 */
export const authService = {
  async signup({ fullName, emailAddress, password }) {
    if (USE_MOCKS) {
      await delay(900);
      if (mockUsers.findByEmail(emailAddress)) {
        throw new ApiError('An account with that email already exists.', {
          status: 409,
          code: 'EMAIL_TAKEN',
          fieldErrors: { emailAddress: 'That email already has an account. Log in instead?' },
        });
      }
      const user = mockUsers.create({ fullName: fullName.trim(), emailAddress, password });
      const token = mockToken(user);
      setToken(token);
      return { user: publicUser(user), token };
    }
    // TODO(backend): POST /auth/signup → { user, accessToken }; server sets RefreshToken cookie.
    const data = await api.post('/auth/signup', { fullName, emailAddress, password }, { auth: false });
    setToken(data.accessToken);
    return { user: data.user, token: data.accessToken };
  },

  async login({ emailAddress, password }) {
    if (USE_MOCKS) {
      await delay(800);
      const user = mockUsers.findByEmail(emailAddress);
      if (!user || !mockUsers.checkPassword(user, password)) {
        throw new ApiError('That email and password don’t match an account.', {
          status: 401,
          code: 'INVALID_CREDENTIALS',
        });
      }
      const token = mockToken(user);
      setToken(token);
      return { user: publicUser(user), token };
    }
    // TODO(backend): POST /auth/login → { user, accessToken }; server sets RefreshToken cookie.
    const data = await api.post('/auth/login', { emailAddress, password }, { auth: false });
    setToken(data.accessToken);
    return { user: data.user, token: data.accessToken };
  },

  async logout() {
    if (USE_MOCKS) {
      await delay(200);
      setToken(null);
      return;
    }
    try {
      // TODO(backend): POST /auth/logout → clears the RefreshToken cookie server-side.
      await api.post('/auth/logout');
    } finally {
      setToken(null);
    }
  },

  /** Returns the current user, or null when there is no valid session. */
  async me() {
    const token = getToken();
    if (USE_MOCKS) {
      await delay(200);
      const id = userIdFromMockToken(token);
      const user = id && mockUsers.findById(id);
      if (!user) {
        setToken(null);
        return null;
      }
      return { user: publicUser(user), token };
    }
    if (!token) return null; // TODO(backend): try POST /auth/refresh here before giving up.
    try {
      // TODO(backend): GET /auth/me (Authorization: Bearer) → { user }
      const data = await api.get('/auth/me');
      return { user: data.user, token: getToken() };
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) return null;
      throw err;
    }
  },
};
