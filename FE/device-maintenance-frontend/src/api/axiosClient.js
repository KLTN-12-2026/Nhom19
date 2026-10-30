// src/api/axiosClient.js
// Cấu hình Axios Client dùng chung: Base URL, Authorization Header và Interceptors tự động refresh token

import axios from "axios";
import { authStorage } from "../utils/authStorage";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Flag và hàng đợi để tránh gọi refresh token nhiều lần đồng thời
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Tự động đính kèm Access Token vào Header nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Trả về data trực tiếp hoặc xử lý lỗi 401 Refresh Token
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý lỗi không có kết nối tới máy chủ (Backend offline hoặc CORS chặn)
    if (!error.response) {
      const networkError = new Error(
        "Không thể kết nối đến máy chủ Backend (" +
          API_BASE_URL +
          "). Vui lòng kiểm tra dịch vụ Spring Boot đã được khởi động."
      );
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    // Nếu lỗi 401 Unauthorized và không phải request đăng nhập hoặc refresh-token
    const isAuthRoute =
      originalRequest.url?.includes("/api/v1/auth/login") ||
      originalRequest.url?.includes("/api/v1/auth/refresh-token");

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {
      const refreshToken = authStorage.getRefreshToken();

      if (!refreshToken) {
        authStorage.clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Đang refresh thì chờ kết quả
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token chuẩn hoá
        const res = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data?.accessToken;
        const newRefreshToken = res.data?.refreshToken || refreshToken;

        if (newAccessToken) {
          authStorage.setAccessToken(newAccessToken);
          authStorage.setRefreshToken(newRefreshToken);

          axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return axiosClient(originalRequest);
        } else {
          throw new Error("Không nhận được token mới từ máy chủ");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        authStorage.clearAuth();
        // Điều hướng về /login nếu đang ở browser
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login?expired=1";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
