import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} from "@/core/exceptions/api-error";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";

const BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api/v1";
const TIMEOUT = 15000;

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: true,
});

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("auth-logout"));
};

// Silent refresh token queue
let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<void> => {
  await axios.post(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {}, { withCredentials: true });
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isAuthRequest = [API_ENDPOINTS.AUTH.LOGIN, API_ENDPOINTS.AUTH.REFRESH_TOKEN].some((url) =>
      originalRequest?.url?.includes(url),
    );

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve: () => resolve(apiClient(originalRequest)), reject });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await refreshAccessToken();
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearTokens();
        return Promise.reject(new UnauthorizedError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."));
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as { message?: string; error?: string };
      const msg = data?.message || data?.error || "";
      switch (status) {
        case 400: return Promise.reject(new BadRequestError(msg, data));
        case 401: clearTokens(); return Promise.reject(new UnauthorizedError(msg, data));
        case 403: return Promise.reject(new ForbiddenError(msg, data));
        case 404: return Promise.reject(new NotFoundError(msg, data));
        case 500: return Promise.reject(new InternalServerError(msg, data));
        default: return Promise.reject(new ApiError(status, msg || "Đã xảy ra lỗi.", data));
      }
    }
    return Promise.reject(new ApiError(0, error.message || "Không thể kết nối đến máy chủ."));
  },
);
