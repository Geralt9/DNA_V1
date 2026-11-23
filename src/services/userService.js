import { api, ApiError, getToken } from './api.js';
import { USE_MOCKS } from './config.js';
import { delay } from '../mocks/delay.js';
import { mockUsers, publicUser, userIdFromMockToken } from '../mocks/users.js';

function currentMockUser() {
  const id = userIdFromMockToken(getToken());
  const user = id && mockUsers.findById(id);
  if (!user) throw new ApiError('Please log in to continue.', { status: 401, code: 'UNAUTHENTICATED' });
  return user;
}

export const userService = {
  async getProfile() {
    if (USE_MOCKS) {
      await delay(300);
      return publicUser(currentMockUser());
    }
    // TODO(backend): GET /users/me (Authorization: Bearer) → User
    return api.get('/users/me');
  },

  /** @param {{fullName?: string}} patch */
  async updateProfile(patch) {
    if (USE_MOCKS) {
      await delay(700);
      const user = currentMockUser();
      const fullName = patch.fullName?.trim();
      if (fullName !== undefined && fullName.length < 2) {
        throw new ApiError('Some details need another look.', {
          status: 422,
          code: 'VALIDATION',
          fieldErrors: { fullName: 'Use at least 2 characters.' },
        });
      }
      return publicUser(mockUsers.update(user.id, { fullName }));
    }
    // TODO(backend): PATCH /users/me { fullName } → User
    return api.patch('/users/me', patch);
  },
};
