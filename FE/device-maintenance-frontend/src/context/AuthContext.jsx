// src/context/AuthContext.jsx
// React Context quản lý trạng thái xác thực toàn cục cho ứng dụng QuanLyBaoTriAI

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";
import { authStorage } from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [token, setToken] = useState(() => authStorage.getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  // Lấy thông tin tài khoản hiện tại từ Backend (/api/v1/auth/me)
  const fetchCurrentUser = useCallback(async () => {
    const currentToken = authStorage.getAccessToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const data = await authApi.getMe();
      // data có thể là { user: {...} } hoặc chính là {...}
      const userData = data?.user || data;
      setUser(userData);
      authStorage.setUser(userData);
      return userData;
    } catch (err) {
      console.warn("Không thể tải thông tin tài khoản qua /api/v1/auth/me:", err?.message);
      // Nếu 401 Unauthorized, token đã hết hạn hoặc không hợp lệ
      if (err?.response?.status === 401) {
        authStorage.clearAuth();
        setUser(null);
        setToken(null);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Khởi tạo: kiểm tra token và nạp user khi ứng dụng vừa mở
  useEffect(() => {
    const currentToken = authStorage.getAccessToken();
    if (currentToken) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  /**
   * Đăng nhập: gọi API thực, chỉ cập nhật state khi backend phản hồi thành công
   */
  const login = async (email, password) => {
    // Gọi API thật, không giả lập thành công nếu backend lỗi
    const response = await authApi.login({ email, password });

    // Cấu trúc response chuẩn: { accessToken, refreshToken, tokenType, expiresIn, user }
    const accessToken = response?.accessToken;
    const refreshToken = response?.refreshToken;
    let userData = response?.user;

    if (!accessToken) {
      throw new Error("Phản hồi từ máy chủ không chứa access token.");
    }

    // Lưu token và user vào storage
    authStorage.setAccessToken(accessToken);
    if (refreshToken) {
      authStorage.setRefreshToken(refreshToken);
    }
    setToken(accessToken);

    // Nếu response login chưa có user chi tiết, thử gọi /api/v1/auth/me
    if (!userData) {
      try {
        const meRes = await authApi.getMe();
        userData = meRes?.user || meRes;
      } catch {
        // Fallback tối thiểu từ email đã đăng nhập
        userData = { email };
      }
    }

    setUser(userData);
    authStorage.setUser(userData);

    return response;
  };

  /**
   * Đăng ký tài khoản
   */
  const register = async (formData) => {
    return await authApi.register(formData);
  };

  /**
   * Đăng xuất: gọi API logout và xoá sạch storage
   */
  const logout = async () => {
    const refreshToken = authStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (e) {
      console.warn("Lỗi khi gọi API logout backend:", e?.message);
    } finally {
      authStorage.clearAuth();
      setUser(null);
      setToken(null);
    }
  };

  /**
   * Quên mật khẩu
   */
  const forgotPassword = async (email) => {
    return await authApi.forgotPassword({ email });
  };

  /**
   * Đặt lại mật khẩu bằng token
   */
  const resetPassword = async (payload) => {
    return await authApi.resetPassword(payload);
  };

  /**
   * Đổi mật khẩu
   */
  const changePassword = async (payload) => {
    return await authApi.changePassword(payload);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
    fetchCurrentUser,
    forgotPassword,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext phải được sử dụng bên trong AuthProvider");
  }
  return context;
};

export default AuthContext;
