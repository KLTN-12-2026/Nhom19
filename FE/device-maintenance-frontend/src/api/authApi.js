// File này chứa các hàm gọi API xác thực (đăng nhập, đăng xuất, đăng ký).

import axiosClient from "./axiosClient";

const authApi = {
  login: (payload) => axiosClient.post("/api/v1/auth/login", payload),
  logout: () => axiosClient.post("/api/v1/auth/logout"),
};

export default authApi;
