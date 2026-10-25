// File này là layout trang xác thực (đăng nhập / đăng ký), không có sidebar.

import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
}
