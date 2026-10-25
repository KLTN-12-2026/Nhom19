// Folder hooks: custom React hooks.
// File này xử lý logic đăng nhập / phiên người dùng.

import { useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  return { user, setUser };
}
