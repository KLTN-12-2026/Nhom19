// Folder api: nơi gọi API Spring Boot.
// File này tạo Axios client dùng chung (base URL, header, interceptor).

import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
