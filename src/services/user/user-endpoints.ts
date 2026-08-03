// src/services/user/user-endpoints.ts

export const UserEndpoints = {
  PROFILE: {
    GET: '/user/profile',
    UPDATE: '/user/profile',
    UPLOAD_AVATAR: '/user/profile/avatar',
  },
  ADDRESS: {
    GET_ALL: '/user/addresses',
    CREATE: '/user/addresses',
    UPDATE: (id: string) => `/user/addresses/${id}`,
    DELETE: (id: string) => `/user/addresses/${id}`,
    SET_DEFAULT: (id: string) => `/user/addresses/${id}/default`,
  },
  PREFERENCES: {
    GET: '/user/preferences',
    UPDATE: '/user/preferences',
  },
  NOTIFICATIONS: {
    GET_ALL: '/user/notifications',
    MARK_READ: (id: string) => `/user/notifications/${id}/read`,
    MARK_ALL_READ: '/user/notifications/read-all',
  },
} as const;