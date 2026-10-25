// Folder routes: cấu hình định tuyến React Router.
// File này khai báo đường dẫn và component tương ứng.

import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Devices from "../pages/Devices";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
