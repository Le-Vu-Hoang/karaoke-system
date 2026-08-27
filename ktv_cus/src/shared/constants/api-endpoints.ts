export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH_TOKEN: '/auth/refresh',
        LOGOUT: '/auth/logout',
    },
    USERS: {
        ME: '/users/me',
        UPDATE_PROFILE: '/users/me',
        CHANGE_PASSWORD: '/users/me/password',
    },
    ROOMS: {
        LIST: '/rooms',
        TYPES: '/rooms/types',
        DETAILS: (id: string) => `/rooms/${id}`,
        UPDATE_STATUS: (id: string) => `/rooms/${id}/status`,
        AVAILABILITY: (id: string) => `/rooms/types/${id}/availability`,
    },
    BOOKINGS: {
        CREATE: '/bookings',
        LIST: '/bookings',
        CANCEL: (id: string) => `/bookings/${id}/cancel`,
        GET_ME: '/bookings/me',
    },
    SERVICES: {
        LIST: '/services',
        CATEGORIES: '/services/categories',
    }
} as const;