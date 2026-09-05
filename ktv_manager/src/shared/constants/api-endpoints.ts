export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  USERS: {
    LIST: "/users",
    DETAILS: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
  },
  ROOMS: {
    LIST: "/rooms",
    TYPES: "/rooms/types",
    DETAILS: (id: string) => `/rooms/${id}`,
    UPDATE_STATUS: (id: string) => `/rooms/${id}/status`,
    AVAILABILITY: (id: string) => `/rooms/types/${id}/availability`,
  },
  BOOKINGS: {
    LIST: "/bookings",
    DETAILS: (id: string) => `/bookings/${id}`,
    CHECKIN: (id: string) => `/bookings/${id}/check-in`,
    WALK_IN_CHECKIN: "/bookings/walk-in",
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
    CONFIRM: (id: string) => `/bookings/${id}/confirm`,
  },
  INVOICES: {
    LIST: "/invoices",
    DETAILS: (id: string) => `/invoices/${id}`,
    ADD_SERVICE: (id: string) => `/invoices/${id}/services`,
    CHECKOUT: (id: string) => `/invoices/${id}/checkout`,
  },
  SERVICES: {
    LIST: "/services",
    CATEGORIES: "/services/categories",
    DETAILS: (id: string) => `/services/${id}`,
  },
  SHIFTS: {
    OPEN: "/shifts/open",
    CLOSE: (id: string) => `/shifts/${id}/close`,
    LIST: "/shifts",
    CURRENT: "/shifts/current",
  },
  PRICING: {
    RULES: "/pricing/rules",
    CALCULATE: "/pricing/calculate",
  },
} as const;
