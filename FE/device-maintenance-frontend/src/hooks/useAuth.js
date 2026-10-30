// src/hooks/useAuth.js
// Custom Hook tiện ích để truy cập Auth Context trong toàn bộ ứng dụng

import { useAuthContext } from "../context/AuthContext";

export default function useAuth() {
  return useAuthContext();
}
