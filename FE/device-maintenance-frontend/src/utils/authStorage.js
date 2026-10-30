// src/utils/authStorage.js
// Quản lý lưu trữ Access Token, Refresh Token và thông tin cơ bản người dùng
// Tuyệt đối không lưu mật khẩu hoặc dữ liệu nhạy cảm vào localStorage.

const ACCESS_TOKEN_KEY = "qmba_access_token";
const REFRESH_TOKEN_KEY = "qmba_refresh_token";
const USER_KEY = "qmba_user";

export const authStorage = {
  getAccessToken: () => {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  setAccessToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    } catch (e) {
      console.error("Lỗi khi lưu access token:", e);
    }
  },

  getRefreshToken: () => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  setRefreshToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch (e) {
      console.error("Lỗi khi lưu refresh token:", e);
    }
  },

  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        // Chỉ lưu thông tin không nhạy cảm (id, fullName, email, phone, role)
        const safeUser = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error("Lỗi khi lưu user info:", e);
    }
  },

  setAuthData: ({ accessToken, refreshToken, user }) => {
    if (accessToken) authStorage.setAccessToken(accessToken);
    if (refreshToken) authStorage.setRefreshToken(refreshToken);
    if (user) authStorage.setUser(user);
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error("Lỗi khi xoá auth data:", e);
    }
  },

  isAuthenticated: () => {
    return Boolean(authStorage.getAccessToken());
  },
};

export default authStorage;
