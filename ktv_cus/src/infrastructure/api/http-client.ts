import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/env';
import {
    ApiError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
    InternalServerError,
} from '@/core/exceptions/api-error';
import { API_ENDPOINTS } from '@/shared/constants/api-endpoints';

// ==========================================
// 1. CẤU HÌNH CƠ BẢN
// ==========================================
const BASE_URL: string = env.NEXT_PUBLIC_BACKEND_URL || 'localhost:3001';
const TIMEOUT = 15000;

export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
});

// ==========================================
// 2. QUẢN LÝ TOKENS (CLIENT-SIDE)
// ==========================================
export const clearTokens = () => {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(new CustomEvent('auth-logout'));
};

// ==========================================
// 3. XỬ LÝ CONCURRENT REFRESH TOKEN QUEUE
// ==========================================
let isRefreshing = false;
let failedQueue: Array<{
    resolve: () => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

// Hàm gọi API refresh token
const refreshAccessTokenApi = async (): Promise<void> => {
    await axios.post(
        `${BASE_URL}/v1/auth/refresh`,
        {},
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    );
};

// ==========================================
// 4. REQUEST INTERCEPTOR
// ==========================================
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config,
    (error) => Promise.reject(error)
);

interface ApiErrorResponse {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;

    [key: string]: unknown;
}

// ==========================================
// 5. RESPONSE INTERCEPTOR & ERROR MAPPING
// ==========================================
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 5.1. Xử lý tự động Refresh Token khi gặp lỗi 401 Unauthorized
        // Không tự động refresh token đối với các request liên quan đến Auth (login, register, refresh)
        const isAuthRequest = originalRequest?.url?.includes(API_ENDPOINTS.AUTH.LOGIN) ||
            originalRequest?.url?.includes(API_ENDPOINTS.AUTH.REGISTER) ||
            originalRequest?.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(apiClient(originalRequest)),
                        reject: (err: unknown) => reject(err),
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await refreshAccessTokenApi();
                processQueue(null);

                // Thực thi lại request ban đầu
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                clearTokens();
                return Promise.reject(new UnauthorizedError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'));
            } finally {
                isRefreshing = false;
            }
        }

        // 5.2. Chuyển đổi các lỗi API thô
        if (error.response) {
            const status = error.response.status;
            const responseData = error.response.data as ApiErrorResponse;
            const backendMessage = responseData?.message || responseData?.error || '';

            switch (status) {
                case 400:
                    return Promise.reject(new BadRequestError(backendMessage, responseData));
                case 401:
                    clearTokens();
                    return Promise.reject(new UnauthorizedError(backendMessage, responseData));
                case 403:
                    return Promise.reject(new ForbiddenError(backendMessage, responseData));
                case 404:
                    return Promise.reject(new NotFoundError(backendMessage, responseData));
                case 422:
                    return Promise.reject(new ValidationError(backendMessage, responseData?.errors || {}));
                case 500:
                    return Promise.reject(new InternalServerError(backendMessage, responseData));
                default:
                    return Promise.reject(new ApiError(status, backendMessage || 'Đã xảy ra lỗi kết nối với máy chủ.', responseData));
            }
        }

        if (error.request) {
            return Promise.reject(new ApiError(0, 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền.'));
        }

        return Promise.reject(new ApiError(0, error.message || 'Đã xảy ra lỗi không xác định.'));
    }
);