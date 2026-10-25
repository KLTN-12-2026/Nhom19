// File này xử lý logic lấy và quản lý danh sách thiết bị.

import { useState } from "react";

export default function useDevices() {
  const [devices, setDevices] = useState([]);

  return { devices, setDevices };
}
