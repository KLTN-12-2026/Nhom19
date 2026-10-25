// Folder layouts: khung giao diện dùng chung cho nhiều trang.
// File này là layout chính sau khi đăng nhập (sidebar + nội dung).

import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Outlet />
    </div>
  );
}
