// ./shared/api-types.ts — Single source of truth cho API

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface WalkInCheckInRequest {
  roomId: string;
  durationHours: number;
  guestName?: string;
  guestPhone?: string;
}
