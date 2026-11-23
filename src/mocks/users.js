/**
 * Mock user store, persisted in localStorage so sign up → reload → log in works.
 * Passwords are never stored in plain text here, only a throwaway hash.
 * This exists only for UI development; the real store is the MySQL DB in ../Server.
 */
const KEY = 'dna-mock-users';

export const DEMO_USER = {
  id: 'u_demo',
  fullName: 'Demo Customer',
  emailAddress: 'demo@dna.test',
  password: 'revolution94',
  createdAt: '2024-03-01T12:00:00.000Z',
};

function hash(str) {
  // FNV-1a — not cryptographic, just keeps plain text out of storage in mock mode.
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to seed */
  }
  const { password, ...demo } = DEMO_USER;
  return [{ ...demo, passwordHash: hash(password) }];
}

function save(users) {
  try {
    localStorage.setItem(KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable — mock still works for this session */
  }
}

export const mockUsers = {
  findByEmail(email) {
    return load().find((u) => u.emailAddress === email.toLowerCase()) || null;
  },
  findById(id) {
    return load().find((u) => u.id === id) || null;
  },
  create({ fullName, emailAddress, password }) {
    const users = load();
    const user = {
      id: `u_${Date.now().toString(36)}`,
      fullName,
      emailAddress: emailAddress.toLowerCase(),
      passwordHash: hash(password),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    save(users);
    return user;
  },
  update(id, patch) {
    const users = load();
    const i = users.findIndex((u) => u.id === id);
    if (i === -1) return null;
    users[i] = { ...users[i], ...patch };
    save(users);
    return users[i];
  },
  checkPassword(user, password) {
    return user.passwordHash === hash(password);
  },
};

/** Strip private fields before handing a user to the UI. */
export const publicUser = ({ passwordHash, ...user }) => user;

/** Mock tokens are just the user id, base64'd. Real tokens are JWTs from the API. */
export const mockToken = (user) => `mock.${btoa(user.id)}`;
export const userIdFromMockToken = (token) => {
  try {
    return token?.startsWith('mock.') ? atob(token.slice(5)) : null;
  } catch {
    return null;
  }
};
